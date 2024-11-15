import { EventType } from "../../../../../../../types/eventType";

export default function EventDetailsPage({ event }: { event: EventType }) {
    console.log(event);
    return (
        <div>
            {event.title}
        </div>
    )
}