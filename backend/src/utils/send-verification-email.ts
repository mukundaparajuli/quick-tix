import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);



export const sendVerificationEmail = async (email: string, verificationToken: string) => {


    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Email Verification",
        html: `<p>Visit this link to verify your email: http://localhost:5000/api/auth/verify-email/${verificationToken}</p>`,
    });

    return { data, error };
};
