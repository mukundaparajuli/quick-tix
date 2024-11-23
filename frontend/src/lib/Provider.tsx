"use client"
import React, { useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SocketProvider } from "@/contexts"

function Provider({ children, ...props }: any) {
    const [client] = useState(new QueryClient())
    return (
        <>
            <SocketProvider>
                <QueryClientProvider client={client}>
                    <NextThemesProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        {...props}
                    >
                        {children}
                    </NextThemesProvider>
                </QueryClientProvider>
            </SocketProvider>
        </>
    )
}

export { Provider }