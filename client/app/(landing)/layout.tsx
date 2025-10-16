import Footer from "./footer";
import Header from "./header";

type Props = {
    children: React.ReactNode;
}

export default function LandingLayout({ children }: Props) {
    return (
        <>
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    )
}