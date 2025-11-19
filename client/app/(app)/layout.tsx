import ProtectedRoute from "@/components/protected-route";

type Props = {
    children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
    return (
        <>
            <main className="">
                <ProtectedRoute>
                    {children}
                </ProtectedRoute>
            </main>
        </>
    )
}