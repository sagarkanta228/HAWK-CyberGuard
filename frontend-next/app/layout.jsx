import './globals.css';

export const metadata = {
  title: 'HAWK - Multi-Vector AI Threat Defense Platform',
  description: 'HAWK Autonomous Multi-Vector AI Threat Defense Platform: PhishX (LightGBM + CharCNN), EMBER2024 (14 Benchmark Malware Classifiers), and DeepGuard (MS-EffGCViT Synthetic Media Forensics).',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#080a0f] text-white selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
