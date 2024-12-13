"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import esewa from "../../../../../../public/images/esewa.png";
import khalti from "../../../../../../public/images/khalti.png";

export default function Component({ setPaymentMethod }: any) {
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        console.log("Submitted:", selectedValue);
    };

    function capitalize(str: string) {
        if (!str) return "";
        const cleanedStr = str.replace(/-/g, "");
        return cleanedStr.charAt(0).toUpperCase() + cleanedStr.slice(1).toLowerCase();
    }

    const handlePaymentChange = (value: string) => {
        setSelectedValue(value);
        setPaymentMethod(capitalize(value));
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <RadioGroup
                aria-label="Payment Method"
                className="grid grid-cols-2"
                onValueChange={handlePaymentChange}
            >
                <RadioGroupItem id="Khalti" value="Khalti" className="peer sr-only" />
                <Label
                    htmlFor="Khalti"
                    className={`bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center gap-4 cursor-pointer border-2 transition-colors ${selectedValue === "Khalti"
                        ? "border-gray-900 dark:border-gray-50"
                        : "border-transparent hover:border-gray-900 dark:hover:border-gray-50"
                        }`}
                >
                    <Image src={khalti} height={100} width={100} alt="Khalti" />
                    <h3 className="text-xl font-semibold">Pay via Khalti</h3>
                </Label>

                <RadioGroupItem id="E-Sewa" value="E-Sewa" className="peer sr-only" />
                <Label
                    htmlFor="E-Sewa"
                    className={`bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center gap-4 cursor-pointer border-2 transition-colors ${selectedValue === "E-Sewa"
                        ? "border-gray-900 dark:border-gray-50"
                        : "border-transparent hover:border-gray-900 dark:hover:border-gray-50"
                        }`}
                >
                    <Image src={esewa} height={100} width={100} alt="E-Sewa" />
                    <h3 className="text-xl font-semibold">Pay via E-Sewa</h3>
                </Label>
            </RadioGroup>


        </form>
    );
}
