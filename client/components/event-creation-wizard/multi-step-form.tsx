"use client"

import { useWizardStore } from "@/stores/wizard-store"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Progress } from "@/components/ui/progress" // 👈 add this import
import EventInfo from "./eventinfo/event-info"
import TicketTypes from "./ticket-types/ticket-types"
import Facilities from "./facilities/facilities"
import VenueStep from "./venue/venue"
import Sections from "./sections/sections"
import { Seats } from "./seats/seats"
import useEventStore from "@/stores/event-store"
import { markAsPublished } from "@/services/event.service"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function MultiStepEventForm() {
    const { currentStep, nextStep, prevStep, resetWizard } = useWizardStore()
    const { event, resetEvent } = useEventStore()
    const router = useRouter()
    const [isFinishing, setIsFinishing] = useState(false)

    const steps = [
        <EventInfo key="step-0" />,
        <TicketTypes key="step-1" />,
        <Facilities key="step-2" />,
        <VenueStep key="step-3" />,
        <Sections key="step-4" />,
        <Seats key="step-5" />
    ]

    const progressValue = ((currentStep + 1) / steps.length) * 100

    const handleFinish = async () => {
        if (!event?.id) {
            toast.error("No event found. Please create an event first.")
            return
        }

        setIsFinishing(true)
        try {
            const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id
            await markAsPublished(eventId)
            toast.success("Event published successfully!")

            // Reset stores
            resetWizard()
            resetEvent()

            // Redirect to event page
            router.push(`/organizer/event/${event.id}`)
        } catch (error) {
            console.error("Failed to publish event:", error)
            toast.error("Failed to publish event. Please try again.")
        } finally {
            setIsFinishing(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto min-h-screen flex flex-col justify-center">
            <Card>
                <CardHeader className="space-y-3">
                    <Progress value={progressValue} className="h-2 transition-all duration-300" />

                    <div className="text-sm text-muted-foreground text-center">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                </CardHeader>

                <CardContent>{steps[currentStep]}</CardContent>
            </Card>

            <div className="flex justify-between mt-4">
                {currentStep > 0 ? (
                    <Button variant="primary" onClick={prevStep}>
                        Previous
                    </Button>
                ) : (
                    <div />
                )}

                {currentStep < steps.length - 1 ? (
                    <Button onClick={nextStep}>Next</Button>
                ) : (
                    <Button onClick={handleFinish} disabled={isFinishing}>
                        {isFinishing ? "Publishing..." : "Finish"}
                    </Button>
                )}
            </div>
        </div>
    )
}
