"use client";

import { useSession } from "next-auth/react";
import postWithAuth from "../../../../../utils/postWithAuth";
import { useRouter, useSearchParams } from "next/navigation";

const Success = async () => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    console.log(searchParams);

    const data = {
        pidx: searchParams.get('pidx'),
        // transaction_id: searchParams.get('transaction_id'),
        // tidx: searchParams.get('tidx'),
        // amount: searchParams.get('amount'),
        // total_amount: searchParams.get('total_amount'),
        // mobile: searchParams.get('mobile'),
        // status: searchParams.get('status'),
        bookingId: searchParams.get('purchase_order_id'),
        // purchase_order_name: searchParams.get('purchase_order_name'),
    };
    console.log(data);

    // Verify payment
    const verifyPayment = await postWithAuth(
        `${BACKEND_URL}/api/payment/verify-payment`,
        data,
        session
    );

    console.log(verifyPayment);
    return (
        <div>
            <h1>Payment Successful!!</h1>
            <p>Transaction ID: {searchParams.get('transaction_id')}</p>
            <p>Amount: {searchParams.get('amount')}</p>
            <p>Status: {searchParams.get('status')}</p>
            <p>Purchase Order: {searchParams.get('purchase_order_name')}</p>
        </div>
    );
};

export default Success;
