"use client";

import { useRouter } from "next/navigation";

export default function ExploreCTA() {
    const router = useRouter();

    return (
        <div className="w-full flex justify-center mt-6">
            <button
                onClick={() => router.push("/explore")}
                className="px-8 py-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 shadow-md transition"
            >
                Explore Events
            </button>
        </div>
    );
}
