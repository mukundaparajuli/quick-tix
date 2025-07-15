import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import NextAuth from 'next-auth';


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
                        credentials,
                        { withCredentials: true }
                    );
                    console.log("response", response.data)
                    return response.data.data;
                } catch (error: any) {
                    if (error.response?.data?.message === 'Please verify your email to login') {
                        throw new Error('Please verify your email to login');
                    }
                    throw new Error('Invalid credentials');
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
            if (user) {
                token.id = user.user.id;
                token.fullName = user.user.fullName;
                token.username = user.username;
                token.email = user.user.email;
                token.role = user.user.role;
                token.access_token = user.jwtToken;
            }
            if (account?.provider === 'google') {
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
                        { access_token: account.access_token },
                        { withCredentials: true }
                    );
                    const { user } = response.data;
                    token.id = user.id;
                    token.fullName = user.fullName;
                    token.username = user.username;
                    token.email = user.email;
                    token.role = user.role;
                } catch (error) {
                    console.error('Google auth failed:', error);
                }
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user.id = token.id;
            session.user.fullName = token.fullName;
            session.user.username = token.username;
            session.user.email = token.email;
            session.user.role = token.role;
            session.access_token = token.access_token;
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
