import ProtectedRoute from "@/components/protected-route";
import Sidebar from "./sidebar";

type Props = {
    children: React.ReactNode;
}

export default function OrganizerLayout({ children }: Props) {
    return (
        <ProtectedRoute role="ORGANIZER">
            <Sidebar className="hidden lg:flex w-full" />
            <main className=" lg:pl-[256px] h-full pt-[50px] lg:pt-0 ">
                <div className="h-full w-full max-w-screen">
                    {children}
                </div>
            </main>
        </ProtectedRoute>
    )
}