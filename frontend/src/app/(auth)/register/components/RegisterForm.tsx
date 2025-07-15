'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterFormData } from '@/schemas/RegisterSchema';
import { cn } from '@/lib/utils';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormProps extends React.HTMLAttributes<HTMLFormElement> {
    isOrganizer?: boolean;
}

const RegisterForm = ({ className, isOrganizer = false, ...props }: RegisterFormProps) => {
    const router = useRouter();
    const { signIn } = useAuth();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            fullName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            address: '',
            city: '',
            state: '',
            country: '',
            latitude: undefined,
            longitude: undefined,
            businessName: isOrganizer ? '' : undefined,
        },
    });

    const registerUser = async (formData: RegisterFormData) => {
        const { confirmPassword, ...data } = formData; // Exclude confirmPassword
        const endpoint = isOrganizer ? '/auth/register-organizer' : '/auth/register';
        const response = await axios.post(endpoint, data, { withCredentials: true });
        console.log(response.data)
        return response.data;
    };

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('Registration successful! Please check your email to verify your account.');
            router.push('/login');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Registration failed');
        },
    });

    const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
        mutation.mutate(data);
    };

    const handleGoogleSignIn = async () => {
        const result = await signIn('google', { redirect: false });
        if (result?.error) {
            toast.error('Google sign-in failed');
        } else {
            toast.success('Signed up with Google');
            router.push('/dashboard');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-6', className)} {...props}>
                <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" disabled={mutation.isPending} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe" disabled={mutation.isPending} {...field} />
                                </FormControl>
                                <FormMessage />
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
                                        type="email"
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        disabled={mutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
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
                                        placeholder="Password"
                                        autoComplete="new-password"
                                        disabled={mutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        disabled={mutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {isOrganizer && (
                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Event Co." disabled={mutation.isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Registering...' : 'Register'}
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    type="button"
                    disabled={mutation.isPending}
                    onClick={handleGoogleSignIn}
                >
                    <Icons.google className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </form>
        </Form>
    );
};

export default RegisterForm;