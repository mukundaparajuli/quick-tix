import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center px-4 my-10 lg:my-0">
            <LoginForm />
        </div>
    );
}