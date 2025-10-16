import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20 gap-10">
            {/* Left content */}
            <div className="flex-1 text-center md:text-left space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    <span className="text-gray-500">Find & Book</span> Your Next Event in Seconds
                </h1>

                <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto md:mx-0">
                    Discover concerts, sports, and local shows effortlessly, your next unforgettable moment is just a click away.
                </p>

                <div className="flex justify-center md:justify-start gap-4">
                    <Button variant="secondary" size="lg">Book Now</Button>
                    <Button variant="secondaryOutline" size="lg">Explore Events</Button>
                </div>
            </div>

            {/* Right image */}
            <div className="flex-1 flex justify-center md:justify-end">
                <div className="relative">
                    <Image
                        src="/banner.jpg"
                        alt="banner"
                        width={600}
                        height={600}
                        className="rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
                        priority
                    />
                    {/* Optional subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl" />
                </div>
            </div>
        </section>
    );
}
