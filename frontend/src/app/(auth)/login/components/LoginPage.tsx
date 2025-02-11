import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";

const LoginPage = () => {
    return (
        <div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back!
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Login with your credentials
                        </p>
                    </div>
                    <LoginForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Register now.
                        </Link>
                    </p>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link
                            href="/submit-email"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Forgot Password?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;