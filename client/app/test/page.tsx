"use client"

import CategoriesDisplay from "@/components/user/categories-display";
import EventsSection from "@/components/user/events-section";
import HeroSection from "@/components/user/hero-section";
import { useEffect, useState } from "react";
import { PaymentMethodModal } from "../(app)/dashboard/book/[id]/payment-modal";

export default function TestPage() {
    const [isOpen, setIsOpen] = useState(true);
    
    const handlePaymentSelect = (method: 'khalti' | 'esewa') => {
        console.log('Payment method selected:', method);
        setIsOpen(false);
    };

    return (
        <div className="p-4 text-center">
            <button 
                onClick={() => setIsOpen(true)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Open Payment Modal
            </button>
            <PaymentMethodModal 
                open={isOpen}
                onOpenChange={setIsOpen}
                onPaymentSelect={handlePaymentSelect}
            />
        </div>
    )
}