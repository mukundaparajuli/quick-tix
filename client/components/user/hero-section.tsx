import Image from "next/image";

export default function HeroSection() {
    return (
        <div className="relative p-2 h-128 md:h-150 mb-6 rounded-lg overflow-hidden">
            {/* Image */}
            <Image
                src="/banner.jpg"
                alt="Hero Banner"
                fill
                className="object-cover brightness-50" // darkens the image
            />

            {/* Text Overlay */}
            <div className="absolute bottom-6 left-6 text-start text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                    QuickTix
                </h1>
                <p className="text-lg md:text-xl">
                    Your gateway to unforgettable events and experiences.
                </p>
            </div>
        </div>
    );
}
