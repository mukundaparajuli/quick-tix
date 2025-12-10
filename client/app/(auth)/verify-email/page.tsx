"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/services/auth.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail } from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleVerify = async () => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link. No token provided.");
            return;
        }

        setStatus("loading");

        try {
            await verifyEmail(token);
            setStatus("success");
            setMessage("Your email has been verified successfully! You can now log in to your account.");
        } catch (error: any) {
            setStatus("error");
            setMessage(
                error?.response?.data?.message ||
                "Failed to verify email. The link may have expired or is invalid."
            );
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Email Verification</CardTitle>
                    <CardDescription>
                        {status === "idle" && "Click the button below to verify your email address"}
                        {status === "loading" && "Verifying your email..."}
                        {status === "success" && "Verification complete"}
                        {status === "error" && "Verification failed"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {status === "idle" && (
                        <>
                            <Mail className="h-12 w-12 text-blue-500" />
                            <p className="text-center text-muted-foreground">
                                We&apos;re ready to verify your email address. This will activate your account.
                            </p>
                            <Button
                                onClick={handleVerify}
                                className="w-full"
                                variant="secondary"
                            >
                                Verify Email
                            </Button>
                        </>
                    )}
                    {status === "loading" && (
                        <>
                            <div className="flex items-center justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                            </div>
                            <p className="text-center text-muted-foreground">
                                Please wait while we verify your email...
                            </p>
                        </>
                    )}
                    {status === "success" && (
                        <>
                            <CheckCircle className="h-12 w-12 text-green-500" />
                            <p className="text-center text-muted-foreground">{message}</p>
                            <Button onClick={() => router.push("/login")} className="w-full" variant="secondary">
                                Continue to Login
                            </Button>
                        </>
                    )}
                    {status === "error" && (
                        <>
                            <XCircle className="h-12 w-12 text-red-500" />
                            <p className="text-center text-muted-foreground">{message}</p>
                            <div className="flex flex-col gap-2 w-full">
                                {token && (
                                    <Button
                                        onClick={handleVerify}
                                        className="w-full"
                                        variant="secondary"
                                    >
                                        Try Again
                                    </Button>
                                )}
                                <Button
                                    variant="secondaryOutline"
                                    onClick={() => router.push("/register")}
                                    className="w-full"
                                >
                                    Back to Register
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
