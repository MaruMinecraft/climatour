import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Climatour",
  description: "Weather-driven tour search for comfortable trips"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
