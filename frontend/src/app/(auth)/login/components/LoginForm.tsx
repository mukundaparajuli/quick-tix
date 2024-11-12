"use client"

import { useForm } from "react-hook-form";
import LoginSchema from "../../../../../schemas/LoginSchema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const LoginForm = ({ className, ...props }: LoginFormProps) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof LoginSchema>) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const result = await response.json();
                console.log("result is:", result);
                router.replace('/dashboard')
                return result;
            } console.log(await response.json())
        }
    });

    const onSubmit = (formData: z.infer<typeof LoginSchema>) => {
        mutation.mutate(formData);
        console.log(formData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={cn("grid gap-6", className)} {...props}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only" htmlFor="email">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                placeholder="name@example.com"
                                                type="email"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                autoCorrect="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-1">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only" htmlFor="password">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                placeholder="password"
                                                type="password"
                                                autoCapitalize="none"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" type="button">
                        <Icons.google className="mr-2 h-4 w-4" />
                        Google
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default LoginForm;
