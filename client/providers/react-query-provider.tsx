"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type Props = { children: React.ReactNode };

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: 10 * 60 * 1000,
            cacheTime: 15 * 60 * 1000,
        },
    },
});

const ReactQueryProvider = (props: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
