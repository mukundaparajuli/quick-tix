"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { cn } from "@/lib/utils"
import useLogin from "@/hooks/auth/use-login"
import Link from "next/link"

// Zod schema for login
const loginFormSchema = z.object({
    email: z.string().min(5).max(100).email(),
    password: z.string().min(6).max(100),
})
export type LoginForm = z.infer<typeof loginFormSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const loginMutation = useLogin();
    const form = useForm<LoginForm>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof loginFormSchema>) {
        loginMutation.mutate(values);
    }

    return (
        <div className={cn("", className)} {...props}>
            <Card className="w-full min-w-md max-w-md md:max-w-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" variant="secondary" className="w-full">Login</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center items-center">
                    <p className="text-sm text-center text-gray-600">
                        Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register.</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
