import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
    variant: "primary" | "primaryOutline" | "secondary" | "secondaryOutline" | "ghost"
    title: string;
}

export default function RegisterDialog({ variant, title }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" variant={variant} >{title}</Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="max-h-[98vh]">
                <RegisterForm />
            </DialogContent>
        </Dialog>
    )
}