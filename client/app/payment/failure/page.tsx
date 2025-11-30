import { Suspense } from 'react';
import PaymentResult from '@/components/payment/payment-result';

function PaymentFailureContent() {
    return <PaymentResult type="failure" />;
}

export default function PaymentFailurePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading payment result...</p>
                </div>
            </div>
        }>
            <PaymentFailureContent />
        </Suspense>
    );
}