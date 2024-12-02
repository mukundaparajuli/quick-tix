"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import postWithAuth from "../../../../utils/postWithAuth";
import { Failure, Success } from "./components";

const Page = () => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { data: session } = useSession();
    const searchParams = useSearchParams();

    const [verifyPayment, setVerifyPayment] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const data = {
        pidx: searchParams.get('pidx'),
        transaction_id: searchParams.get('transaction_id'),
        tidx: searchParams.get('tidx'),
        amount: searchParams.get('amount'),
        total_amount: searchParams.get('total_amount'),
        mobile: searchParams.get('mobile'),
        status: searchParams.get('status'),
        bookingId: searchParams.get('purchase_order_id'),
        purchase_order_name: searchParams.get('purchase_order_name'),
    };
    useEffect(() => {
        const fetchVerification = async () => {
            try {

                const response = await postWithAuth(
                    `${BACKEND_URL}/api/payment/verify-payment`,
                    data,
                    session
                );
                console.log("response=", response.success);
                setVerifyPayment(response.success);
            } catch (error) {
                console.log("Error verifying payment:", error);
                setVerifyPayment(false);
            } finally {
                setLoading(false);
            }
        };

        fetchVerification();
    }, [searchParams, session, BACKEND_URL]);

    if (loading) return <div>Loading...</div>;

    if (verifyPayment) return <Success bookingId={data.bookingId} />;
    return <Failure />;
};

export default Page;
