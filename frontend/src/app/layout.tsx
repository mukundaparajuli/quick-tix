import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "@/lib/Provider";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="light dark:bg-black" >
        <SessionProvider session={session}>
          <Provider>
            {children}
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
