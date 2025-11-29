"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useGetEventDetails from "@/hooks/events/use-get-event-details";
import { useUpdateEvent } from "@/hooks/organizer";
import { normalizeEvent } from "@/utils/normalize-event-details";
import { formatDate } from "@/utils/format-date";
import { deleteEvent } from "@/services/event.service";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import EventInfo from "@/components/events/event-info";
import TicketTypesList from "@/components/events/ticket-types-list";
import FacilitiesList from "@/components/events/facilities-list";
import VenueDetails from "@/components/events/venue-details";
import SectionsList from "@/components/events/sections-list";
import DisplaySeats from "@/components/seats/display-seats";

import {
    CalendarDays,
    MapPin,
    Users,
    Edit,
    ArrowLeft,
    Ticket,
    Building,
    LayoutGrid,
    Image as ImageIcon,
    Trash2
} from "lucide-react";

export default function EventDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: 0,
    });

    if (!id) return <div className="text-slate-500 text-center mt-10">No event ID provided</div>;

    const { data: eventDetails, isFetching, refetch } = useGetEventDetails({ eventId: +id });
    const updateEventMutation = useUpdateEvent();

    if (isFetching) {
        return <EventDetailsSkeleton />;
    }

    const { event, ticketTypes, facilities, venue, sections, seats } = normalizeEvent(eventDetails?.data);

    const handleEditClick = () => {
        setEditForm({
            title: event?.title || "",
            description: event?.description || "",
            date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : "",
            location: event?.location || "",
            capacity: event?.capacity || 0,
        });
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!event?.id) return;

        await updateEventMutation.mutateAsync({
            eventId: +event.id,
            data: {
                title: editForm.title,
                description: editForm.description,
                date: editForm.date,
                location: editForm.location,
                capacity: editForm.capacity,
            },
        });

        setIsEditDialogOpen(false);
        refetch();
    };

    const handleDeleteEvent = async () => {
        if (!event?.id) return;

        setIsDeleting(true);
        try {
            const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
            await deleteEvent(eventId);
            toast.success("Event deleted successfully");
            router.push("/organizer/event");
        } catch (error: any) {
            console.error("Failed to delete event:", error);
            toast.error(error?.response?.data?.message || "Failed to delete event");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-800">{event?.title}</h1>
                            <Badge variant={event?.isPublished ? "default" : "secondary"}>
                                {event?.isPublished ? "Published" : "Draft"}
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Event ID: #{id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleEditClick}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Event
                    </Button>
                    {!event?.isPublished && (
                        <Link href={`/organizer/event/create/${id}`}>
                            <Button>Complete Setup</Button>
                        </Link>
                    )}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="danger">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this event? This action cannot be undone.
                                    {event?.isPublished && (
                                        <span className="block mt-2 text-amber-600 font-medium">
                                            Warning: This is a published event.
                                        </span>
                                    )}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteEvent}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isDeleting ? "Deleting..." : "Delete Event"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <CalendarDays className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Event Date</p>
                                <p className="font-semibold text-sm">{event?.date ? formatDate(event.date) : "Not set"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <MapPin className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Location</p>
                                <p className="font-semibold text-sm truncate max-w-[150px]">{event?.location || "Not set"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Capacity</p>
                                <p className="font-semibold text-sm">{event?.capacity || "Unlimited"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <Ticket className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Ticket Types</p>
                                <p className="font-semibold text-sm">{ticketTypes?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tickets">Tickets</TabsTrigger>
                    <TabsTrigger value="venue">Venue</TabsTrigger>
                    <TabsTrigger value="seating">Seating</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Event Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600">{event?.description || "No description provided"}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Facilities</CardTitle>
                            <CardDescription>Amenities included with different ticket types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FacilitiesList facilities={facilities} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tickets" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Ticket Types</CardTitle>
                            <CardDescription>Different ticket categories and pricing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TicketTypesList ticketTypes={ticketTypes} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="venue" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Venue Details</CardTitle>
                            <CardDescription>Venue information and sections</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <VenueDetails venue={venue} />
                            <SectionsList sections={sections} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seating" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Seating Layout</CardTitle>
                            <CardDescription>View all seats and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DisplaySeats seats={seats} sections={sections} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="media" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Event Media</CardTitle>
                            <CardDescription>Images and promotional material</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {event?.media && event.media.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.media.map((media: any, index: number) => (
                                        <div key={media.id || index} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                                            <Image
                                                src={media.url}
                                                alt={media.altText || `Event media ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No media uploaded yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Update the basic information of your event
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                                id="title"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date & Time</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={editForm.date}
                                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={editForm.capacity}
                                    onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={editForm.location}
                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSubmit}
                            disabled={updateEventMutation.isPending}
                        >
                            {updateEventMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function EventDetailsSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="pt-4">
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Skeleton className="h-10 w-full" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}
