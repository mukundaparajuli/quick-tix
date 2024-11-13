import React from "react";
import RegisterEventForm from "./EventInfoForm";
import Link from "next/link";
import EventInfoForm from "./EventInfoForm";

const EventInfoPage = () => {
    return (
        <div>
            <div className="lg:p-8">
                <div className="mx-auto flex flex-col justify-center space-y-6 w-2/3">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Event Registration
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Input your event information
                        </p>
                    </div>
                    <EventInfoForm />

                </div>
            </div>
        </div >
    );
};

export default EventInfoPage;