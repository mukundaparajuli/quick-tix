import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image";

interface PaymentMethodModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPaymentSelect: (method: 'khalti' | 'esewa') => void;
}

export const PaymentMethodModal = ({ open, onOpenChange, onPaymentSelect }: PaymentMethodModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-xl text-gray-900">
                        Select Payment Method
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-gray-600">
                        Choose your preferred payment method to complete the booking.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex space-x-4 p-4">
                    <Button
                        className="h-40 flex-1 flex flex-col items-center justify-center gap-2 "
                        onClick={() => onPaymentSelect('khalti')}
                    >
                        <Image src={"/khalti.webp"} alt="Khalti Logo" width={120} height={30} />
                    </Button>
                    <Button
                        className="h-40 flex-1 flex flex-col items-center justify-center gap-2 "
                        onClick={() => onPaymentSelect('esewa')}
                    >
                        <Image src={"/esewa.webp"} alt="Esewa Logo" width={120} height={30} />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
};