import ProtectedRoute from "@/components/protected-route";

type Props = {
    children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
    return (
        <>
            <main className="flex-1 flex flex-col items-center justify-center min-h-screen">
                <ProtectedRoute role="ATTENDEE">
                    {children}
                </ProtectedRoute>
            </main>
        </>
    )
}