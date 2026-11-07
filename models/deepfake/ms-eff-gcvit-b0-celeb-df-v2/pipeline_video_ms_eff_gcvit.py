from typing import Any, Dict, List

import cv2
import numpy as np
import torch
from transformers import Pipeline
from transformers.pipelines import PIPELINE_REGISTRY
from transformers.models.auto import AutoModelForImageClassification


class DeepfakeVideoPipeline(Pipeline):
    """Video -> sampled frames -> YOLO crop -> batched deepfake prob -> aggregate."""

    def _sanitize_parameters(self, **kwargs):
        pre_keys = ("num_frames", "margin_ratio", "conf_thres", "min_face_ratio", "tta_hflip")
        pre = {k: kwargs[k] for k in pre_keys if k in kwargs}
        post = {k: kwargs[k] for k in ("agg_mode", "return_frame_scores") if k in kwargs}
        return pre, {}, post

    # ---------- YOLO (image pipeline과 동일 로직) ----------
    def _ensure_detector(self, conf_thres: float):
        if getattr(self, "_detector", None) is not None:
            return
        from ultralytics import YOLO
        from huggingface_hub import hf_hub_download

        weights = hf_hub_download(self.model.name_or_path, "yolov8n-face.pt")
        self._detector = YOLO(weights, task="detect")
        self._conf_thres = conf_thres

    def _detect_and_crop(self, img, margin_ratio, conf_thres, min_face_ratio):
        res = self._detector(img, conf=conf_thres, verbose=False)[0]
        if len(res.boxes) == 0:
            return None

        data = res.boxes.data.cpu().numpy()
        faces = data[data[:, 5] == 0]
        if len(faces) == 0:
            return None

        areas = (faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])
        idx = int(np.argmax(areas))
        h, w = img.shape[:2]
        if areas[idx] / (h * w) < min_face_ratio:
            return None

        xmin, ymin, xmax, ymax = faces[idx, :4]
        pad_w = int((xmax - xmin) * margin_ratio)
        pad_h = int((ymax - ymin) * margin_ratio)
        y1, y2 = max(int(ymin - pad_h), 0), min(int(ymax + pad_h), h)
        x1, x2 = max(int(xmin - pad_w), 0), min(int(xmax + pad_w), w)

        crop = img[y1:y2, x1:x2]
        return crop if crop.size else None

    # ---------- video frame sampling ----------
    @staticmethod
    def _sample_frames(path, num_frames):
        cap = cv2.VideoCapture(path)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        idxs = np.linspace(0, max(total - 1, 0), num_frames, dtype=int)
        frames = []
        for i in idxs:
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(i))
            ok, frame = cap.read()
            if ok:
                frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        cap.release()
        return frames

    # ---------- preprocess ----------
    def preprocess(self, video_path, num_frames=20, margin_ratio=0.2,
                   conf_thres=0.5, min_face_ratio=0.01, tta_hflip=0.0) -> Dict[str, Any]:
        from deepguard.data import get_test_transforms

        self._ensure_detector(conf_thres)
        frames = self._sample_frames(video_path, num_frames)

        img_size = list(self.model.config.img_size)
        tfm = get_test_transforms(img_size=img_size, tta_hflip=tta_hflip)

        tensors = []
        for f in frames:
            crop = self._detect_and_crop(f, margin_ratio, conf_thres, min_face_ratio)
            if crop is None:
                continue
            tensors.append(tfm(image=crop)["image"])

        if not tensors:
            return {"pixel_values": None}
        return {"pixel_values": torch.stack(tensors).to(self.device)}

    # ---------- forward ----------
    def _forward(self, model_inputs) -> Dict[str, Any]:
        if model_inputs["pixel_values"] is None:
            return {"logits": None}
        with torch.no_grad():
            logits = self.model(pixel_values=model_inputs["pixel_values"]).logits
        return {"logits": logits}

    # ---------- postprocess ----------
    def postprocess(self, model_outputs, agg_mode="conf", return_frame_scores=False) -> List[Dict[str, Any]]:
        logits = model_outputs["logits"]
        if logits is None:
            return [{"label": "no_face_detected", "score": -1.0}]

        probs = logits.softmax(-1)[:, 1].cpu().numpy()   # fake prob per frame
        score = float(self._aggregate(probs, agg_mode))

        result = [
            {"label": "fake", "score": round(score, 4)},
            {"label": "real", "score": round(1.0 - score, 4)},
        ]
        if return_frame_scores:
            result.append({
                "frame_scores": [round(p, 4) for p in probs.tolist()],
                "agg_mode": agg_mode,
            })
        return result

    @staticmethod
    def _aggregate(preds: np.ndarray, agg_mode: str) -> float:
        sz = len(preds)
        if agg_mode == "mean":
            return np.mean(preds)
        if agg_mode == "vote":
            return np.sum(preds > 0.5) / sz
        # 'conf' heuristic
        t_fake, t_real = 0.8, 0.2
        fakes = preds[preds > t_fake]
        if len(fakes) > (sz // 2.5):
            return np.mean(fakes)
        if np.count_nonzero(preds < t_real) > 0.9 * sz:
            return np.mean(preds[preds < t_real])
        return np.mean(preds)


PIPELINE_REGISTRY.register_pipeline(
    "video-classification",
    pipeline_class=DeepfakeVideoPipeline,
    pt_model=AutoModelForImageClassification,
)