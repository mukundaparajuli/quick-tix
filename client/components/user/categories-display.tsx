import { Badge } from "@/components/ui/badge";
import { Music, Film, PartyPopper, Languages, Mountain, Users, Book, Flame, Mic2 } from "lucide-react";

const categories = [
    { name: "Music", icon: Music },
    { name: "Movies", icon: Film },
    { name: "Parties", icon: PartyPopper },
    { name: "Language", icon: Languages },
    { name: "Travel", icon: Mountain },
    { name: "Community", icon: Users },
    { name: "Education", icon: Book },
    { name: "Trending", icon: Flame },
    { name: "Stand-up", icon: Mic2 },
];

export default function CategoriesDisplay() {
    return (
        <div className="w-full overflow-hidden">
            <div className="flex animate-marquee gap-3">
                {categories.map((cat, index) => {
                    const Icon = cat.icon;
                    return (
                        <Badge
                            key={index}
                            className="rounded-md bg-gray-100 px-3 py-2 text-sm flex items-center gap-2 text-gray-800"
                        >
                            <Icon size={16} className="text-gray-800" />
                            {cat.name}
                        </Badge>
                    );
                })}
                {/* Duplicate inside for seamless loop */}
                {categories.map((cat, index) => {
                    const Icon = cat.icon;
                    return (
                        <Badge
                            key={`dup-${index}`}
                            className="rounded-md bg-gray-100 px-3 py-2 text-sm flex items-center gap-2 text-gray-800"
                        >
                            <Icon size={16} className="text-gray-800" />
                            {cat.name}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}
