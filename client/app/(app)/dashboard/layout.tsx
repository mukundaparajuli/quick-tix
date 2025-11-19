import ProtectedRoute from "@/components/protected-route";
import Header from "./header";

type Props = {
    children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
    return (
        <div className="max-w-screen mx-auto">
            <Header />
            <main >
                <ProtectedRoute role="ATTENDEE">
                    {children}
                </ProtectedRoute>
            </main>
        </div>
    )
}