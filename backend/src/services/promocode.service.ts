import { DiscountType } from "@prisma/client";
import ApiError from "../types/api-error";
import db from "../config/db";

type PromoCode = {
    code: string;
    discount: number;
    discountType: DiscountType;
    maxUses?: number;
    usedCount?: number;
    validFrom: string;
    validUntil: string;
}

export class PromocodeService {
    async createPromocode(eventId: number, promoCodes: PromoCode[]) {
        if (!eventId) {
            throw new ApiError(400, "Event id is required to create a promocode");
        }

        let createdPromocodes = [];

        for (const promocode of promoCodes) {
            const { code, discount, discountType, maxUses, usedCount, validFrom, validUntil } = promocode;

            if (!code || !discount || !discountType || !maxUses || !validFrom || !validUntil) {
                throw new ApiError(400, "Please provide all the necessary fields required to create a promocode", { code, discount, discountType, maxUses, validFrom, validUntil });
            }

            const createdPromoCode = await db.promocode.create({
                data: {
                    code,
                    discount,
                    discountType,
                    maxUses,
                    usedCount,
                    validFrom,
                    validUntil,
                    eventId
                }
            })

            createdPromocodes.push(createdPromoCode);
        }
        return createdPromocodes;
    }

    async updatePromoCode(promocodeId: number, promoCode: Partial<PromoCode>) {
        if (!promocodeId) {
            throw new ApiError(400, "Please provide a promocode id to update it")
        }

        const promocode = await db.promocode.findFirst({
            where: {
                id: promocodeId,
                deletedAt: null
            }
        });

        if (!promocode) {
            throw new ApiError(404, "No promocode was found for this id");
        }

        const updatedPromocode = await db.promocode.update({
            where: { id: promocodeId },
            data: promocode
        })
    }

    async deletePromoCode(promocodeId: number) {
        // necessary authorization check will be done in the controller we will just delete the promocode
        const promoCode = await db.promocode.findFirst({
            where: {
                id: promocodeId,
                deletedAt: null
            }
        });

        if (!promoCode) {
            throw new ApiError(404, "Promo code not found for this id");
        }

        const deletedPromocode = await db.promocode.update({
            where: { id: promocodeId },
            data: { deletedAt: new Date(Date.now()) }
        })
    }
}

export const promocodeService = new PromocodeService()