"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import esewa from "../../../../../../public/images/esewa.png"
import khalti from "../../../../../../public/images/khalti.png"

export default function Component() {
    const handleSubmit = () => {
        console.log("submitted")
    }
    return (
        <form className="space-y-6">
            <RadioGroup aria-label="Feedback" className="grid grid-cols-2">
                <RadioGroupItem value="Khalti" className="peer sr-only" />
                <Label
                    htmlFor="Khalti"
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center gap-4 cursor-pointer border-2 border-transparent hover:border-gray-900 dark:hover:border-gray-50 transition-colors peer-checked:border-gray-900 dark:peer-checked:border-gray-50"
                >
                    <Image src={khalti} height={100} width={100} alt="Khalti" />
                    <h3 className="text-xl font-semibold">Pay via Khalti</h3>

                </Label>


                <RadioGroupItem value="E-Sewa" className="peer sr-only" />
                <Label
                    htmlFor="E-Sewa"
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center gap-4 cursor-pointer border-2 border-transparent hover:border-gray-900 dark:hover:border-gray-50 transition-colors peer-checked:border-gray-900 dark:peer-checked:border-gray-50"
                >
                    <Image src={esewa} height={100} width={100} alt="E-Sewa" />
                    <h3 className="text-xl font-semibold">Pay via E-Sewa</h3>

                </Label>
            </RadioGroup>
            <Button type="submit" className="w-full" onClick={handleSubmit}>
                Submit
            </Button>
        </form>
    )
}
