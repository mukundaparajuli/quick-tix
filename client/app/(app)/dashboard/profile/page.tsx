"use client";

import useUpdateProfile from "@/hooks/user/use-update-profile";
import useAuthStore from "@/stores/auth-store";
import { useState } from "react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const user = useAuthStore((state) => state.user);
    const [data, setData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.attendeeProfile?.bio || "",
        phone: user?.attendeeProfile?.phone || "",
        photo: null as File | null
    });

    const updateUserMutation = useUpdateProfile();

    const handleChange = (key: keyof typeof data, value: string | File | null) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        updateUserMutation.mutate(data);
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">

                    {/* Name */}
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                            value={data.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            value={data.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                    </div>

                    {/* Photo */}
                    <div className="space-y-2">
                        <Label>Profile Photo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                handleChange("photo", e.target.files?.[0] || null)
                            }
                        />
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={updateUserMutation.isPending}
                        className="w-full"
                    >
                        {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
