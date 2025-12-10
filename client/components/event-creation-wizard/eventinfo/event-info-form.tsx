"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form, FormMessage } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { cn } from "@/lib/utils"
import useCreateEventInfo from "@/hooks/event-wizard/use-create-event-info"
import { useState } from "react"
import { UploadService } from "@/services/upload.service"
import { X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

const eventInfoSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(500).optional(),
    date: z.date(),
    location: z.string().min(2).max(100),
    capacity: z.number().optional(),
    images: z.array(z.string()).optional(),
})
export type EventInfoForm = z.infer<typeof eventInfoSchema>;

export function EventInfoForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const eventCreationMutation = useCreateEventInfo();
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const form = useForm<EventInfoForm>({
        resolver: zodResolver(eventInfoSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            location: "",
            capacity: 1,
            images: [],
        },
    })

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const result = await UploadService.uploadImage(file);
                return result.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            const newImages = [...uploadedImages, ...uploadedUrls];
            setUploadedImages(newImages);
            form.setValue("images", newImages);
        } catch (error) {
            console.error("Failed to upload images:", error);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        form.setValue("images", newImages);
    };

    function onSubmit(values: z.infer<typeof eventInfoSchema>) {
        eventCreationMutation.mutate(values);
    }

    return (
        <div className={cn("", className)} {...props}>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Event Title"
                                        disabled={eventCreationMutation.isPending || uploading}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Event Description"
                                        disabled={eventCreationMutation.isPending || uploading}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        disabled={eventCreationMutation.isPending || uploading}
                                        value={field.value.toISOString().split("T")[0]} // YYYY-MM-DD
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Event Location"
                                        disabled={eventCreationMutation.isPending || uploading}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Event Capacity"
                                        disabled={eventCreationMutation.isPending || uploading}
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage className="text-start" />
                            </FormItem>
                        )}
                    />

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <FormLabel>Event Images (Optional)</FormLabel>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                            {uploading ? "Uploading..." : "Upload event images"}
                                        </span>
                                        <input
                                            id="image-upload"
                                            name="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500">
                                        PNG, JPG, GIF up to 50MB each
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Display uploaded images */}
                        {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                {uploadedImages.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <Image
                                            src={url}
                                            alt={`Event image ${index + 1}`}
                                            width={200}
                                            height={150}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            disabled={eventCreationMutation.isPending || uploading}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="secondary"
                        className="w-full"
                        disabled={eventCreationMutation.isPending || uploading || !form.formState.isValid}
                    >
                        {eventCreationMutation.isPending ? "Creating Event..." : uploading ? "Uploading Images..." : "Create Event"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
