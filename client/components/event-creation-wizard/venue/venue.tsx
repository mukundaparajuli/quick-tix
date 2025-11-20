import useEventStore from "@/stores/event-store";
import { VenueForm } from "./venue-form";
import DisplayVenue from "./display-venue";

export default function VenueStep() {
    const venue = useEventStore().venue;


    return <DisplayVenue venue={venue} />;
}