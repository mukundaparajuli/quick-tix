import { EventInfoForm } from "@/components/event-creation-wizard/eventinfo/event-info-form";
import { MultiStepEventForm } from "@/components/event-creation-wizard/multi-step-form";

export default function TestPage() {
    return (
        <div className="p-4 text-center">
            <MultiStepEventForm />
        </div>
    )
}