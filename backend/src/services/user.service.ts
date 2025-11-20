import db from "../config/db";

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
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                name: updateData.name,
                email: updateData.email,
                organizerProfile: {
                    update: {
                        organizationName: updateData.organizationName,
                        website: updateData.website,
                        contactEmail: updateData.contactEmail,
                        bio: updateData.bio,
                        phone: updateData.phone,
                        ...(updateData.photo && {
                            avatar: {
                                create: {
                                    filePath: updateData.photo,
                                },
                            },
                        }),
                    },
                },
            },
            include: {
                organizerProfile: true,
                attendeeProfile: true,
            },
        });
        return updatedUser;
    }
}

export const userService = new UserService();