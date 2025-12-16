import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lytics - School Analytics Dashboard",
  description: "Comprehensive analytics dashboard for educational companies to monitor and compare school performance across brands, branches, and levels.",
  keywords: ["analytics", "school", "education", "dashboard", "metrics", "performance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
