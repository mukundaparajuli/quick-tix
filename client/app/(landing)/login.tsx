import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
    variant: "primary" | "primaryOutline" | "secondary" | "secondaryOutline" | "danger" | "dangerOutline" | "ghost"
    title: string;
}

export default function LoginDialog({ variant, title }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" variant={variant} >{title}</Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent>
                <LoginForm />
            </DialogContent>
        </Dialog>
    )
}