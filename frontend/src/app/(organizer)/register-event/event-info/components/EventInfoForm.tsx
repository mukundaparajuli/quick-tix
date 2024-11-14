"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterEventSchema } from "../../../../../../schemas";
import EventInformationForm from "./event-info-form";
import LocationInfoForm from "./location-info-form";
import { useState } from "react";
import VenueInfoForm from "./venue-info-form";

interface RegisterEventFormProps extends React.HTMLAttributes<HTMLFormElement> { }

// Define the steps and fields to validate for each step
const steps = [
    {
        id: 'Step 1',
        name: "Event Information",
        fields: ['title', 'description', 'date', 'totalTickets', 'availableTickets', 'price', 'organizerName', 'organizerEmail', 'category']
    },
    {
        id: 'Step 2',
        name: 'Location Information',
        fields: ['location.address', 'location.city', 'location.state', 'location.country']
    },
    {
        id: 'Step 3',
        name: 'Venue Information',
        fields: ['venue.name', 'venue.description', 'venue.capacity', 'venue.amenities']
    }
];

export default function EventInfoForm({ className, ...props }: RegisterEventFormProps) {
    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const form = useForm<z.infer<typeof RegisterEventSchema>>({
        resolver: zodResolver(RegisterEventSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            totalTickets: 0,
            availableTickets: 0,
            price: 0,
            organizerName: "",
            organizerEmail: "",
            category: "",
            location: {
                address: "",
                city: "",
                country: "",
                state: ""
            },
            venue: {
                name: "",
                description: "",
                capacity: 0,
                amenities: "",
            },
            sections: ""
        }
    });

    const onSubmit = async (formData: any) => {
        console.log(formData);

        // Convert amenities from a string to an array if necessary
        if (typeof formData.venue.amenities === 'string') {
            formData.venue.amenities = formData.venue.amenities.split(',').map((item: string) => item.trim());
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to register event');
            }

            const result = await response.json();
            console.log('Event registered successfully:', result);
        } catch (error) {
            console.error('Error registering event:', error);
        }
    };

    // Move to the next step after validating current step fields
    const next = async () => {
        const fieldsToValidate = steps[currentStep].fields;

        // Trigger validation only for the fields in the current step
        const isValid = await form.trigger(fieldsToValidate);

        if (isValid) {
            if (currentStep < steps.length - 1) {
                // If we're on the last step, submit the form
                if (currentStep === steps.length - 2) {
                    await form.handleSubmit(onSubmit)();
                }
                setPreviousStep(currentStep);
                setCurrentStep((step) => step + 1);
            }
        } else {
            console.log('Validation failed on current step');
        }
    };

    // Go to the previous step
    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep);
            setCurrentStep((step) => step - 1);
        }
    };

    return (
        <div>
            <nav aria-label='Progress'>
                <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                    {steps.map((step, index) => (
                        <li key={step.name} className='md:flex-1'>
                            {currentStep > index ? (
                                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                    <span className='text-sm font-medium text-sky-600 transition-colors '>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            ) : currentStep === index ? (
                                <div
                                    className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                                    aria-current='step'
                                >
                                    <span className='text-sm font-medium text-sky-600'>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            ) : (
                                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                                    <span className='text-sm font-medium text-gray-500 transition-colors'>
                                        {step.id}
                                    </span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-6", className)} {...props}>
                    {/* Event Information */}
                    {currentStep === 0 && <EventInformationForm form={form} />}

                    {/* Location Fields */}
                    {currentStep === 1 && <LocationInfoForm form={form} />}

                    {/* Venue Fields */}
                    {currentStep === 2 && <VenueInfoForm form={form} />}

                    {/* Sections */}
                    <FormField
                        control={form.control}
                        name="sections"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sections</FormLabel>
                                <FormControl>
                                    <Input placeholder="Event Sections" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit">Register Event</Button>

                    <div className='mt-6 flex items-center justify-between'>
                        <button type='button' onClick={prev} className='text-gray-500'>
                            Back
                        </button>
                        <button type='button' onClick={next} className='text-sky-600'>
                            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
