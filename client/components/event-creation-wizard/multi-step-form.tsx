"use client"

import { useWizardStore } from "@/stores/wizard-store";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import EventInfo from "./eventinfo/event-info";
import TicketTypes from "./ticket-types/ticket-types";
import Facilities from "./facilities/facilities";
import VenueStep from "./venue/venue";
import Sections from "./sections/sections";

export function MultiStepEventForm() {
    const { currentStep, nextStep, prevStep } = useWizardStore();

    const steps = [
        <EventInfo key="step-0" />,
        <TicketTypes key="step-1" />,
        <Facilities key="step-2" />,
        <VenueStep key="step-3" />,
        <Sections key="step-4" />,
    ];

    return (
        <div className="max-w-xl mx-auto min-h-screen flex flex-col justify-center">

            <Card>
                <CardHeader>
                    Step {currentStep + 1} of {steps.length}
                </CardHeader>
                <CardContent>
                    {steps[currentStep]}
                </CardContent>
            </Card>
            <div className="flex justify-between mt-4">
                {currentStep > 0 && (
                    <Button
                        onClick={prevStep}
                    >
                        Previous
                    </Button>
                )}
                {currentStep === 0 && (
                    <div />
                )}
                {currentStep < steps.length - 1 && (
                    <Button
                        onClick={nextStep}
                    >
                        Next
                    </Button>
                )}
                {currentStep === steps.length - 1 && (
                    <Button
                        onClick={() => console.log("Submit all steps")}
                    >
                        Finish
                    </Button>
                )}
            </div>
        </div>
    );
}
