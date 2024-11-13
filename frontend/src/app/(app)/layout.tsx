import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    console.log(session);
    if (!session?.user) {
        return redirect('/login');
    }
    return <main>{children}</main>;
}