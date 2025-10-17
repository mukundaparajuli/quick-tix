import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Tix",
  description: "Quick Tix - Your Ticketing Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <ReactQueryProvider>
          {children}
          <Toaster
            position="top-right"
            hotkey={["esc"]}
            richColors
            closeButton
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
