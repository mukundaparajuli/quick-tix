import ProtectedRoute from "@/components/protected-route";

type Props = {
    children: React.ReactNode;
}

export default function OrganizerLayout({ children }: Props) {
    return (
        <>
            <main className="flex-1 flex flex-col items-center justify-center min-h-screen">
                <ProtectedRoute role="ORGANIZER">
                    {children}
                </ProtectedRoute>
            </main>
        </>
    )
}