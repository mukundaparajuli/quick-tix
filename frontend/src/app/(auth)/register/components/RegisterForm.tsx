"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/icons";
import RegisterSchema from "../../../../../schemas/RegisterSchema";
import { useMutation } from "@tanstack/react-query";



interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const RegisterForm = ({ className, ...props }: RegisterFormProps) => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const mutation = useMutation({
        mutationFn: async (formData: z.infer<typeof RegisterSchema>) => {
            console.log("here i am")
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                return result;
            }
            console.log(await response.json());
        }
    })

    const onSubmit = (formData: z.infer<typeof RegisterSchema>) => {
        console.log("registering...")
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
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only" htmlFor="fullName">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="fullName"
                                                placeholder="Full Name"
                                                type="text"
                                                autoCapitalize="none"
                                                autoComplete="fullName"
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
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only" htmlFor="username">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="username"
                                                placeholder="username"
                                                type="text"
                                                autoCapitalize="none"
                                                autoComplete="username"
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
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only" htmlFor="confirmPassword">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                placeholder="confirm password"
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
                                {mutation.isPending ? 'Registering...' : 'Register'}
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

export default RegisterForm;
