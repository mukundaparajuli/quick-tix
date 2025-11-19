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
}

export const userService = new UserService();