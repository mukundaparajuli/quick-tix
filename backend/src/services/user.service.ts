import db from "../config/db";
import ApiError from "../types/api-error";

class UserService {
    async getUserById(id: number) {
        const user = await db.user.findUnique({
            where: { id },
            include: {
                attendeeProfile: {
                    include: { avatar: true }
                }, organizerProfile: {
                    include: { avatar: true }
                }
            },
        });
        if (!user) return null;
        const { password, ...safeUser } = user;
        return safeUser;
    }
    async updateUserProfile(userId: number, updateData: any) {
        console.log("Update Data in Service:", updateData);

        // Get the user to determine their role
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { attendeeProfile: true, organizerProfile: true }
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const updatePayload: any = {
            name: updateData.name,
            email: updateData.email,
        };

        // Handle profile updates based on role
        if (user.role === 'ORGANIZER' && user.organizerProfile) {
            updatePayload.organizerProfile = {
                update: {
                    organizationName: updateData.organizationName,
                    website: updateData.website,
                    contactEmail: updateData.contactEmail,
                    bio: updateData.bio,
                    phone: updateData.phone,
                    ...(updateData.photo && { avatar: updateData.photo }),
                },
            };
        } else if (user.role === 'ATTENDEE' && user.attendeeProfile) {
            updatePayload.attendeeProfile = {
                update: {
                    bio: updateData.bio,
                    phone: updateData.phone,
                    ...(updateData.photo && { avatar: updateData.photo }),
                },
            };
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: updatePayload,
            include: {
                organizerProfile: true,
                attendeeProfile: true,
            },
        });
        return updatedUser;
    }
}

export const userService = new UserService();