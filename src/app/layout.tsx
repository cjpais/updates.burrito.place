import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Burrito Updates",
  description: "Updates about the Burrito project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col w-full items-center sm:py-16 py-8 px-8">
          <h4>
            <a href="/" className="no-underline">
              burrito updates
            </a>
          </h4>
          {children}
        </main>
      </body>
    </html>
  );
}
