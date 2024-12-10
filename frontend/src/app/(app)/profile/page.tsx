"use client"
import { useSession } from "next-auth/react";
import { BookingsInfo } from "./components";

export default function Page() {

    return (
        <div className="flex justify-center">
            <BookingsInfo />
        </div>
    )
}