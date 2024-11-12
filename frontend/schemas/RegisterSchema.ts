import z from "zod";

const validatePasswordFormat = (password: string): boolean => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
};

const RegisterSchema = z
    .object({
        username: z.string(),
        email: z.string().trim().email("Email address is invalid"),
        fullName: z
            .string()
            .trim()
            .min(5, "Full name must be atleast 5 characters long")
            .max(50, "Full name should be less than 50 characters long")
            .optional(),
        gender: z.enum(["MALE", "FEMALE", "OTHERS"]).optional(),
        password: z
            .string()
            .trim()
            .refine((val) => validatePasswordFormat(val), {
                message:
                    "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            }),
        confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password and confirm password doesn't match.",
        path: ["confirmPassword"],
    });

export default RegisterSchema;
