"use client";

import React, { useState } from "react";
import useAuthStore from "@/stores/auth-store";
import useUpdateProfile from "@/hooks/user/use-update-profile";

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

type FormState = {
    name: string;
    email: string;
    organizationName: string;
    website: string;
    contactEmail: string;
    bio: string;
    phone: string;
    avatar: File | null;
    cover: File | null;
};

export default function OrganizerProfileForm() {
    const user = useAuthStore((s) => s.user);

    const [data, setData] = useState<FormState>({
        name: user?.name || "",
        email: user?.email || "",
        organizationName: user?.organizerProfile?.organizationName || "",
        website: user?.organizerProfile?.website || "",
        contactEmail: user?.organizerProfile?.contactEmail || "",
        bio: user?.organizerProfile?.bio || "",
        phone: user?.organizerProfile?.phone || "",
        avatar: null,
        cover: null,
    });

    const updateMutation = useUpdateProfile();

    const handleChange = (key: keyof FormState, value: any) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        const payload: any = {
            name: data.name,
            email: data.email,
            organizationName: data.organizationName,
            website: data.website,
            contactEmail: data.contactEmail,
            bio: data.bio,
            phone: data.phone,
        };

        if (data.avatar) payload.photo = data.avatar;
        if (data.cover) payload.cover = data.cover;

        updateMutation.mutate(payload);
    };

    return (
        <div className="max-w-3xl mx-auto py-10">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Organizer Profile</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Organization Name</Label>
                        <Input
                            value={data.organizationName}
                            onChange={(e) => handleChange("organizationName", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <Input
                                value={data.website}
                                onChange={(e) => handleChange("website", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Contact Email</Label>
                            <Input
                                type="email"
                                value={data.contactEmail}
                                onChange={(e) => handleChange("contactEmail", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                            value={data.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            value={data.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Avatar</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleChange("avatar", e.target.files?.[0] || null)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Cover Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleChange("cover", e.target.files?.[0] || null)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>KYC Verified</Label>
                        <Input value={user?.organizerProfile?.kycVerified ? "Yes" : "No"} readOnly />
                    </div>
                </CardContent>

                <CardFooter>
                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="w-full">
                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
