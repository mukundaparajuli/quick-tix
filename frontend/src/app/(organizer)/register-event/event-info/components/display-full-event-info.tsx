// DisplayFullEventInfo.tsx

import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface DisplayFullEventInfoProps {
    form: UseFormReturn<any>;
    onSubmit: () => void;
}

export default function DisplayFullEventInfo({ form, onSubmit }: DisplayFullEventInfoProps) {
    return (
        <div>
            <h2>Review Event Information</h2>
            {/* Display event information here using form.getValues() if needed */}

            {/* Submit Button */}
            <Button type="button" onClick={onSubmit} className="text-sky-600">
                Submit Event
            </Button>
        </div>
    );
}
