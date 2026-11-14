import './globals.css';

export const metadata = {
  title: 'HAWK — Secure Everything You Click, Open & Trust',
  description:
    'HAWK brings PhishX, EMBER2024, and DeepGuard AI threat detection into one real-time command center.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f5f7fc] text-[#0f172a] selection:bg-[#2454ff]/15 selection:text-[#2454ff] antialiased">
        {children}
      </body>
    </html>
  );
}
