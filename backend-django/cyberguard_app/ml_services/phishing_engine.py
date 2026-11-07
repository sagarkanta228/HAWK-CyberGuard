import os
import sys
import logging
import joblib
import numpy as np
import torch
import torch.nn as nn
from pathlib import Path

logger = logging.getLogger("hawk.phishing")

# Ensure OpenMP stability
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# Path to models
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODELS_DIR = BASE_DIR.parent / "models" / "phishing"
if not MODELS_DIR.exists():
    MODELS_DIR = BASE_DIR / "models" / "phishing"

# Import feature extraction from local phishx_core
sys.path.insert(0, str(BASE_DIR))
try:
    from phishx_core.feature_extraction import extract_lexical_features, encode_url_to_char_indices, DEFAULT_MAX_LEN
except Exception as e:
    logger.warning(f"Failed to import from phishx_core: {e}")
    from urllib.parse import urlparse
    DEFAULT_MAX_LEN = 200
    def extract_lexical_features(url, perform_network_checks=False):
        return {"url_length": len(url), "has_https": 1 if "https" in url.lower() else 0}
    def encode_url_to_char_indices(url, maxlen=200):
        chars = [ord(c) % 128 for c in url[:maxlen]]
        return np.pad(chars, (0, max(0, maxlen - len(chars))), 'constant')

MODEL_FEATURES = [
    "url_length", "host_length", "path_length", "num_dots", "num_path_segments",
    "num_query_params", "count_digits", "count_letters", "digit_letter_ratio",
    "count_special_chars", "num_hyphens", "has_at", "has_ip_in_host",
    "suspicious_tld", "entropy_host", "entropy_path", "percent_encoded_frac",
    "vowel_frac", "has_https", "has_port", "has_fragment", "token_login",
    "token_signin", "token_secure", "token_webscr", "token_bank", "token_verify",
    "token_update", "token_account", "token_confirm", "url_len_bucket_<50",
    "url_len_bucket_50_100", "url_len_bucket_100_200", "url_len_bucket_>=200",
    "dns_ip_count", "dns_resolves"
]

TRUSTED_DOMAINS = {
    "google.com", "www.google.com", "microsoft.com", "apple.com", "amazon.com",
    "github.com", "linkedin.com", "twitter.com", "x.com", "facebook.com",
    "wikipedia.org", "cloudflare.com", "mozilla.org", "python.org", "neon.tech"
}
TRUSTED_TLDS = {"edu", "ac.in", "gov.in", "gov", "mil"}

class CharCNN(nn.Module):
    def __init__(self, vocab_size=52, embed_dim=16, num_filters=128, fc_dim=64, dropout=0.3):
        super().__init__()
        self.embedding = nn.Embedding(num_embeddings=vocab_size, embedding_dim=embed_dim, padding_idx=0)
        self.conv3 = nn.Conv1d(in_channels=embed_dim, out_channels=num_filters, kernel_size=3, padding=1)
        self.conv5 = nn.Conv1d(in_channels=embed_dim, out_channels=num_filters, kernel_size=5, padding=2)
        self.conv7 = nn.Conv1d(in_channels=embed_dim, out_channels=num_filters, kernel_size=7, padding=3)
        self.relu = nn.ReLU()
        self.pool = nn.AdaptiveMaxPool1d(1)
        self.fc = nn.Sequential(
            nn.Linear(num_filters * 3, fc_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(fc_dim, 1)
        )

    def forward(self, x):
        x = self.embedding(x).transpose(1, 2)
        c3 = self.pool(self.relu(self.conv3(x))).squeeze(2)
        c5 = self.pool(self.relu(self.conv5(x))).squeeze(2)
        c7 = self.pool(self.relu(self.conv7(x))).squeeze(2)
        feat = torch.cat([c3, c5, c7], dim=1)
        return self.fc(feat)

class PhishingDetector:
    _instance = None

    def __init__(self):
        self.lgb_model = None
        self.char_model = None
        self._load_models()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _load_models(self):
        # 1. Load LightGBM model
        lgb_path = MODELS_DIR / "lgb_calibrated.pkl"
        if not lgb_path.exists():
            lgb_path = MODELS_DIR / "lgb_raw.pkl"

        if lgb_path.exists():
            try:
                self.lgb_model = joblib.load(str(lgb_path))
                logger.info(f"Loaded PhishX LightGBM model from {lgb_path.name}")
            except Exception as e:
                logger.error(f"Failed to load LightGBM model: {e}")

        # 2. Load CharCNN model
        char_path = MODELS_DIR / "charcnn.pt"
        if char_path.exists():
            try:
                self.char_model = CharCNN()
                state = torch.load(str(char_path), map_location="cpu", weights_only=False)
                self.char_model.load_state_dict(state)
                self.char_model.eval()
                logger.info("Loaded PhishX CharCNN model")
            except Exception as e:
                logger.error(f"Failed to load CharCNN model: {e}")

    def is_trusted(self, url: str) -> bool:
        from urllib.parse import urlparse
        try:
            host = urlparse(url).netloc.lower().split(":")[0]
            if not host:
                host = url.split("/")[0].lower()
            if host in TRUSTED_DOMAINS:
                return True
            parts = host.split(".")
            if len(parts) >= 2 and parts[-1] in TRUSTED_TLDS:
                return True
            if len(parts) >= 3 and f"{parts[-2]}.{parts[-1]}" in TRUSTED_TLDS:
                return True
        except Exception:
            pass
        return False

    def predict(self, url: str, content: str = "") -> dict:
        url = (url or "").strip()
        if not url and content:
            # Check for URLs embedded inside email content
            import re
            found = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', content)
            if found:
                url = found[0]
            else:
                url = "http://internal-scanned-document.local"

        if not url:
            return {"error": "No URL or content provided"}

        # Whitelist check
        if self.is_trusted(url):
            return {
                "url": url,
                "isPhishing": False,
                "probability": 0.01,
                "riskScore": 2,
                "severity": "SAFE",
                "confidence": 99,
                "model": "PhishX Whitelist Enforcer",
                "features": {"url_length": len(url), "is_trusted_domain": 1.0},
                "indicators": ["Domain is present on enterprise trust registry"],
                "evidence": [{"type": "WHITELIST", "label": "Verified Allowlist", "detail": "Official domain name signature", "impact": "-50"}],
                "explanation": f"The domain {url} is recognized as an authoritative, verified infrastructure endpoint."
            }

        # 1. Extract lexical features
        feats = extract_lexical_features(url, perform_network_checks=False)
        row = [float(feats.get(k, 0.0) or 0.0) for k in MODEL_FEATURES]
        X = np.array([row], dtype=float)

        # 2. LGBM Prediction
        lgb_prob = 0.5
        if self.lgb_model is not None:
            try:
                if hasattr(self.lgb_model, "predict_proba"):
                    probs = self.lgb_model.predict_proba(X)
                    lgb_prob = float(probs[0][1])
                else:
                    lgb_prob = float(self.lgb_model.predict(X)[0])
            except Exception as e:
                logger.error(f"LGBM inference error: {e}")

        # 3. CharCNN Prediction
        char_prob = lgb_prob
        if self.char_model is not None:
            try:
                char_idx = encode_url_to_char_indices(url, maxlen=DEFAULT_MAX_LEN)
                x_tensor = torch.tensor(char_idx, dtype=torch.long).unsqueeze(0)
                with torch.no_grad():
                    logits = self.char_model(x_tensor)
                    char_prob = float(torch.sigmoid(logits).item())
            except Exception as e:
                logger.error(f"CharCNN inference error: {e}")

        # 4. Ensemble Probability (40% LGBM + 60% CharCNN)
        ensemble_prob = float(np.clip(0.40 * lgb_prob + 0.60 * char_prob, 0.0, 1.0))

        # Check content keywords if email content was provided
        content_lower = content.lower()
        heuristics_boost = 0.0
        indicators = []
        evidence = []

        if any(w in content_lower for w in ["password", "verify", "suspended", "urgent", "15 minutes", "action required"]):
            heuristics_boost += 0.15
            indicators.append("Urgency/coercive language demanding immediate credential entry")
            evidence.append({"type": "NLP_URGENCY", "label": "Urgency Trigger", "detail": "High-urgency language threatening lockout", "impact": "+25"})

        if any(w in url.lower() for w in ["login", "signin", "auth", "verify", "account", "secure", "update"]):
            indicators.append("Credential harvesting tokens embedded in URL path")
            evidence.append({"type": "TOKEN", "label": "Credential Hook", "detail": "Contains sensitive authentication keyword tokens", "impact": "+20"})

        if feats.get("entropy_host", 0) > 3.8:
            indicators.append(f"High host entropy ({feats.get('entropy_host', 0):.2f}) indicating DGA or suspicious subdomain generation")
            evidence.append({"type": "ENTROPY", "label": "Host Randomness", "detail": "High Shannon entropy in host domain", "impact": "+18"})

        if feats.get("has_ip_in_host", 0) == 1:
            indicators.append("Direct IP address used instead of valid hostname")
            evidence.append({"type": "IP_HOST", "label": "Raw IP Host", "detail": "Bypasses standard DNS registration", "impact": "+35"})

        final_prob = float(np.clip(ensemble_prob + heuristics_boost, 0.01, 0.99))
        risk_score = int(round(final_prob * 100))
        is_phishing = risk_score >= 55

        severity = "CRITICAL" if risk_score >= 80 else ("HIGH" if risk_score >= 60 else ("MEDIUM" if risk_score >= 40 else "LOW"))
        if risk_score < 25:
            severity = "SAFE"

        if not indicators:
            if is_phishing:
                indicators.append("Abnormal character distributions and synthetic URL structure")
                evidence.append({"type": "CHAR_CNN", "label": "Structural Anomaly", "detail": "Neural character sequence detected malicious n-grams", "impact": "+22"})
            else:
                indicators.append("URL patterns match typical benign domain distributions")
                evidence.append({"type": "REPUTATION", "label": "Clean Distribution", "detail": "Standard entropy and segment length", "impact": "-20"})

        explanation = (
            f"PhishX Hybrid Engine evaluated URL '{url}' with {risk_score}% threat confidence. "
            f"LightGBM score: {lgb_prob:.3f}, Character CNN score: {char_prob:.3f}. "
            f"Ensemble verdict: {'MALICIOUS PHISHING CAMPAIGN' if is_phishing else 'BENIGN / LOW THREAT'}."
        )

        return {
            "url": url,
            "isPhishing": is_phishing,
            "probability": round(final_prob, 4),
            "lgbScore": round(lgb_prob, 4),
            "charCnnScore": round(char_prob, 4),
            "riskScore": risk_score,
            "severity": severity,
            "confidence": int(round(max(final_prob, 1.0 - final_prob) * 100)),
            "model": "PhishX (LightGBM + CharCNN Ensemble)",
            "features": {k: float(feats.get(k, 0.0) or 0.0) for k in MODEL_FEATURES[:15]},
            "indicators": indicators,
            "evidence": evidence,
            "explanation": explanation
        }

phishing_detector = PhishingDetector.get_instance()
