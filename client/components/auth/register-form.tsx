"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import useRegister from "@/hooks/auth/use-register"
import Link from "next/dist/client/link"

const registerFormSchema = z
    .object({
        name: z.string().min(2).max(50),
        email: z.string().min(5).max(100).email(),
        password: z.string().min(6).max(100),
        role: z.enum(["ATTENDEE", "ORGANIZER"]),
        bio: z.string().max(160).optional(),
        phone: z.string().max(20).optional(),
        organizationName: z.string().max(100).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.role === "ORGANIZER") {
            if (!data.organizationName)
                ctx.addIssue({ path: ["organizationName"], message: "Organization Name is required", code: z.ZodIssueCode.custom })
        }
    })
export type RegisterForm = z.infer<typeof registerFormSchema>;

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const registerMutation = useRegister();
    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerFormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "ATTENDEE",
            bio: "",
            phone: "",
            organizationName: "",
        },
    })

    const selectedRole = form.watch("role")

    function onSubmit(values: z.infer<typeof registerFormSchema>) {
        registerMutation.mutate(values);
    }

    return (
        <div className={cn("", className)} {...props}>
            <Card className="w-full max-w-md min-w-md md:max-w-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create new account</CardTitle>
                    <CardDescription>
                        Continue with your GitHub account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                disabled={registerMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="john@example.com"
                                                disabled={registerMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                disabled={registerMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={registerMutation.isPending}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ATTENDEE">Attendee</SelectItem>
                                                    <SelectItem value="ORGANIZER">Organizer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {selectedRole === "ORGANIZER" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Short bio about yourself"
                                                        disabled={registerMutation.isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="+977-98XXXXXXXX"
                                                        disabled={registerMutation.isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="organizationName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Organization Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your Organization"
                                                        disabled={registerMutation.isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <Button
                                type="submit"
                                variant="secondary"
                                className="w-full"
                                disabled={registerMutation.isPending || !form.formState.isValid}
                            >
                                {registerMutation.isPending ? "Creating Account..." : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex items-center justify-center">
                    <p className="text-sm text-center text-gray-600">
                        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login.</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
