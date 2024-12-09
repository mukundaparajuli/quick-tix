import "./globals.css";
import { Provider } from "@/lib/Provider";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="light dark:bg-gray-800 bg-slate-100" >
        <SessionProvider session={session}>
          <Provider>
            <Toaster />
            {children}
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
