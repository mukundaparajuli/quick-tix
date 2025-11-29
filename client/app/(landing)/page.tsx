import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
    Ticket,
    Calendar,
    CreditCard,
    Shield,
    Users,
    Zap,
    Star,
    ArrowRight,
    CheckCircle,
    MapPin
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20 gap-10">
                <div className="flex-1 text-center md:text-left space-y-6">
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm text-slate-600 mb-4">
                        <Zap className="h-4 w-4" />
                        <span>Fast & Secure Ticketing Platform</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                        Find & Book Your{" "}
                        <span className="text-slate-500">Next Event</span>{" "}
                        in Seconds
                    </h1>

                    <p className="text-slate-600 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
                        Discover concerts, sports, theater, and local shows effortlessly.
                        Your next unforgettable moment is just a click away.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                        <Link href="/register">
                            <Button size="lg" className="w-full sm:w-auto">
                                Get Started Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="secondaryOutline" size="lg" className="w-full sm:w-auto">
                                Explore Events
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-6 pt-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Free to use</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Instant booking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Secure payments</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex justify-center md:justify-end">
                    <div className="relative">
                        <Image
                            src="/banner.jpg"
                            alt="Event ticketing"
                            width={550}
                            height={550}
                            className="rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />

                        {/* Floating card */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-900 p-2 rounded-lg">
                                    <Ticket className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">10,000+</p>
                                    <p className="text-xs text-slate-500">Tickets Sold</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold text-white">500+</p>
                            <p className="text-slate-400 mt-1">Events Listed</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-white">50K+</p>
                            <p className="text-slate-400 mt-1">Happy Customers</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-white">100+</p>
                            <p className="text-slate-400 mt-1">Trusted Organizers</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-white">99.9%</p>
                            <p className="text-slate-400 mt-1">Uptime</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Why Choose Quick Tix?
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We make event ticketing simple, secure, and seamless for both attendees and organizers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="h-6 w-6" />}
                            title="Lightning Fast"
                            description="Book your tickets in seconds with our streamlined checkout process. No hassle, no waiting."
                        />
                        <FeatureCard
                            icon={<Shield className="h-6 w-6" />}
                            title="Secure Payments"
                            description="Your transactions are protected with industry-standard encryption and secure payment gateways."
                        />
                        <FeatureCard
                            icon={<CreditCard className="h-6 w-6" />}
                            title="Multiple Payment Options"
                            description="Pay with your preferred method - cards, digital wallets, and local payment options."
                        />
                        <FeatureCard
                            icon={<Calendar className="h-6 w-6" />}
                            title="Easy Event Management"
                            description="Organizers can create, manage, and track events with our intuitive dashboard."
                        />
                        <FeatureCard
                            icon={<Users className="h-6 w-6" />}
                            title="Seat Selection"
                            description="Choose your perfect seats with our interactive seat map for venue events."
                        />
                        <FeatureCard
                            icon={<MapPin className="h-6 w-6" />}
                            title="Local Events"
                            description="Discover events happening near you with our location-based recommendations."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Get your tickets in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <StepCard
                            number="01"
                            title="Find Your Event"
                            description="Browse through hundreds of events or search for something specific."
                        />
                        <StepCard
                            number="02"
                            title="Select Your Seats"
                            description="Pick your preferred seats and ticket type from available options."
                        />
                        <StepCard
                            number="03"
                            title="Book & Enjoy"
                            description="Complete your secure payment and receive instant confirmation."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Trusted by thousands of event-goers and organizers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="Quick Tix made booking concert tickets so easy! The seat selection feature is amazing."
                            author="Sarah M."
                            role="Music Enthusiast"
                        />
                        <TestimonialCard
                            quote="As an event organizer, the dashboard gives me everything I need to manage my events efficiently."
                            author="John D."
                            role="Event Organizer"
                        />
                        <TestimonialCard
                            quote="Secure, fast, and reliable. I've been using Quick Tix for all my event bookings."
                            author="Priya K."
                            role="Regular Customer"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Experience Events Like Never Before?
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who trust Quick Tix for their event ticketing needs.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                                Create Free Account
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="secondaryOutline" className="border-white  ">
                                Browse Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* For Organizers Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                Are You an Event Organizer?
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Take your events to the next level with our powerful organizer tools.
                                Create events, manage bookings, track sales, and grow your audience - all in one place.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Easy event creation wizard
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Real-time booking analytics
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Flexible pricing & ticket types
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Instant payouts to your wallet
                                </li>
                            </ul>
                            <Link href="/register">
                                <Button size="lg">
                                    Start Organizing Events
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <div className="bg-slate-100 rounded-2xl p-8">
                                <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-500">Total Revenue</span>
                                        <span className="text-2xl font-bold text-slate-900">NPR 125,000</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-900 rounded-full" style={{ width: '75%' }} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                        <div>
                                            <p className="text-lg font-semibold text-slate-900">12</p>
                                            <p className="text-xs text-slate-500">Events</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-slate-900">450</p>
                                            <p className="text-xs text-slate-500">Tickets Sold</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-slate-900">4.8</p>
                                            <p className="text-xs text-slate-500">Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
            <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center text-slate-700 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="bg-slate-900 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {number}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm">{description}</p>
        </div>
    );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <p className="text-slate-700 mb-4 italic">&ldquo;{quote}&rdquo;</p>
            <div>
                <p className="font-semibold text-slate-900">{author}</p>
                <p className="text-sm text-slate-500">{role}</p>
            </div>
        </div>
    );
}
