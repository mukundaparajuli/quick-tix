"use client"
import React, { useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"

function Provider({ children }: any) {
    const [client] = useState(new QueryClient())
    return (
        <>
            <QueryClientProvider client={client}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </>
    )
}

export { Provider }