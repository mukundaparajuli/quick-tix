"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { RegisterEventSchema } from "../../../../../../schemas";
import EventInformationForm from "./event-info-form";
import LocationInfoForm from "./location-info-form";
import VenueInfoForm from "./venue-info-form";
import SeatLayoutForm from "./seat-layout-form";
import postWithAuth from "../../../../../../utils/postWithAuth";

// Types
interface RegisterEventFormProps extends React.HTMLAttributes<HTMLFormElement> { }

type FormComponent = React.FC<{ form: ReturnType<typeof useForm> }>;

interface FormStep {
    id: string;
    name: string;
    component: FormComponent | null;
    fields: string[];
}

// Define the type for section data based on your schema
interface SectionData {
    name: string;
    rows: Array<{
        row: string;
        seats: Array<{
            id: string;
            status: 'available' | 'reserved' | 'sold';
        }>;
    }>;
}

const FORM_COMPONENTS = {
    EventInformationForm,
    LocationInfoForm,
    VenueInfoForm,
} as const;

const STEPS: FormStep[] = [
    {
        id: 'Step 1',
        name: "Event Information",
        component: EventInformationForm,
        fields: ['title', 'description', 'date', 'totalTickets', 'availableTickets', 'price', 'organizerName', 'organizerEmail', 'category']
    },
    {
        id: 'Step 2',
        name: 'Location Information',
        component: LocationInfoForm,
        fields: ['location.address', 'location.city', 'location.state', 'location.country']
    },
    {
        id: 'Step 3',
        name: 'Venue Information',
        component: VenueInfoForm,
        fields: ['venue.name', 'venue.description', 'venue.capacity', 'venue.amenities']
    },
    {
        id: 'Step 4',
        name: 'Seat Layout Information',
        component: null,
        fields: []
    }
] as const;

const DEFAULT_FORM_VALUES = {
    title: "",
    description: "",
    date: new Date(),
    totalTickets: 120,
    availableTickets: 120,
    price: 120,
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
};

export default function EventRegistrationForm({ className, ...props }: RegisterEventFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [sectionData, setSectionData] = useState<SectionData[]>([]);
    const [eventInfo, setEventInfo] = useState<z.infer<typeof RegisterEventSchema> | undefined>();
    const { data: session } = useSession();

    const form = useForm<z.infer<typeof RegisterEventSchema>>({
        resolver: zodResolver(RegisterEventSchema),
        defaultValues: DEFAULT_FORM_VALUES
    });

    const handleSubmitEvent = async (formData: z.infer<typeof RegisterEventSchema>) => {
        try {
            const processedFormData = {
                ...formData,
                venue: {
                    ...formData.venue,
                    amenities: typeof formData.venue.amenities === 'string'
                        ? formData.venue.amenities.split(',').map((item: string) => item.trim())
                        : formData.venue.amenities
                }
            };

            setEventInfo(processedFormData);
            console.log('Event information saved');
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleFinalSubmission = async () => {
        console.log(eventInfo, sectionData)
        try {
            if (!session) throw new Error("No active session");
            if (!eventInfo) throw new Error("No event information");
            const sections = sectionData;
            const data = { ...eventInfo, sections }
            const result = await postWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event`, data, session);
            console.log(result);
        } catch (error) {
            console.log('Final submission error:', error);
        }
    };

    const handleStepValidation = async () => {
        const fieldsToValidate = STEPS[currentStep].fields;
        return await form.trigger(fieldsToValidate as any[]);
    };

    const handleNext = async () => {
        const isValid = await handleStepValidation();

        if (!isValid) {
            console.log('Please check all required fields');
            return;
        }

        if (currentStep === STEPS.length - 2) {
            await form.handleSubmit(handleSubmitEvent)();
        }

        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const CurrentStepComponent = STEPS[currentStep].component;

    return (
        <div className="space-y-8">
            <nav aria-label="Progress" className="mb-8">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                    {STEPS.map((step, index) => (
                        <li key={step.name} className="md:flex-1">
                            <div
                                className={cn(
                                    "flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                                    {
                                        "border-sky-600": index <= currentStep,
                                        "border-gray-200": index > currentStep,
                                    }
                                )}
                            >
                                <span className={cn("text-sm font-medium", {
                                    "text-sky-600": index <= currentStep,
                                    "text-gray-500": index > currentStep,
                                })}>
                                    {step.id}
                                </span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitEvent)} className={cn("space-y-6", className)} {...props}>
                    {CurrentStepComponent && <CurrentStepComponent form={form as any} />}
                </form>
            </Form>

            {currentStep === STEPS.length - 1 && (
                <>
                    <SeatLayoutForm setSectionData={setSectionData} />
                    <Button
                        onClick={handleFinalSubmission}
                        className="w-full mt-4"
                    >
                        Submit Event Registration
                    </Button>
                </>
            )}

            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                >
                    Previous
                </Button>
                {currentStep < STEPS.length - 1 && (
                    <Button
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}