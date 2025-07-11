// src/components/features/auth/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '@/schemas/LoginSchema';
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
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LoginFormProps extends React.HTMLAttributes<HTMLFormElement> { }

const LoginForm = ({ className, ...props }: LoginFormProps) => {
    const { signIn, status } = useAuth();
    const router = useRouter();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            toast.error(result.error === 'Please verify your email to login'
                ? 'Please check your email to verify your account'
                : 'Invalid email or password');
        } else {
            toast.success('Logged in successfully');
            router.push('/dashboard');
        }
    };

    const handleGoogleSignIn = async () => {
        const result = await signIn('google', { redirect: false });
        if (result?.error) {
            toast.error('Google sign-in failed');
        } else {
            toast.success('Logged in with Google');
            router.push('/dashboard');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-6', className)} {...props}>
                <div className="grid gap-2">
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
                                        disabled={status === 'loading'}
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
                                <FormLabel className="sr-only" htmlFor="password">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="password"
                                        placeholder="password"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="current-password"
                                        autoCorrect="off"
                                        disabled={status === 'loading'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Logging in...' : 'Login'}
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
                    disabled={status === 'loading'}
                    onClick={handleGoogleSignIn}
                >
                    <Icons.google className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;