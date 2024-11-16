import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Header from './dashboard/components/Header';

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
    return <main>
        <Header />
        <div className='mt-20'> {children}</div>
    </main>;
}