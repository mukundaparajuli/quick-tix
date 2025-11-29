"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganizerStats } from "@/hooks/organizer";
import { CalendarDays, DollarSign, Ticket, Users, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizerDashboard() {
    const { data: stats, isLoading, isError } = useOrganizerStats();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (isError || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-red-500">Failed to load dashboard stats</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here&apos;s your overview</p>
                </div>
                <Link href="/organizer/event/create">
                    <Button>+ Create Event</Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Events"
                    value={stats.events.total}
                    subtitle={`${stats.events.published} published, ${stats.events.drafts} drafts`}
                    icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
                    bgColor="bg-blue-50"
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.bookings.total}
                    subtitle={`${stats.bookings.confirmed} confirmed`}
                    icon={<Ticket className="h-5 w-5 text-green-600" />}
                    bgColor="bg-green-50"
                />
                <StatsCard
                    title="Total Earnings"
                    value={`NPR ${stats.earnings.total.toLocaleString()}`}
                    subtitle="From confirmed bookings"
                    icon={<DollarSign className="h-5 w-5 text-yellow-600" />}
                    bgColor="bg-yellow-50"
                />
                <StatsCard
                    title="Pending Bookings"
                    value={stats.bookings.pending}
                    subtitle={`${stats.bookings.cancelled} cancelled`}
                    icon={<Clock className="h-5 w-5 text-orange-600" />}
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Recent Bookings</CardTitle>
                            <CardDescription>Latest booking activity</CardDescription>
                        </div>
                        <Link href="/organizer/bookings">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {stats.recentBookings.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentBookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm truncate">
                                                {booking.attendee.user.name || booking.attendee.user.email}
                                            </p>
                                            <p className="text-xs text-slate-500">{booking.event.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm">NPR {booking.totalPrice}</p>
                                            <BookingStatusBadge status={booking.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No bookings yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Upcoming Events</CardTitle>
                            <CardDescription>Events scheduled soon</CardDescription>
                        </div>
                        <Link href="/organizer/event">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {stats.upcomingEvents.length > 0 ? (
                            <div className="space-y-4">
                                {stats.upcomingEvents.map((event) => (
                                    <Link href={`/organizer/event/${event.id}`} key={event.id}>
                                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                {new Date(event.date).getDate()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{event.title}</p>
                                                <p className="text-xs text-slate-500">{formatDate(event.date)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold">{event.bookingCount}</p>
                                                <p className="text-xs text-slate-500">bookings</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-500 mb-4">No upcoming events</p>
                                <Link href="/organizer/event/create">
                                    <Button variant="secondary" size="sm">Create Event</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/organizer/event/create">
                            <QuickActionCard
                                icon={<CalendarDays className="h-6 w-6" />}
                                title="Create Event"
                                description="Start a new event"
                            />
                        </Link>
                        <Link href="/organizer/event">
                            <QuickActionCard
                                icon={<Users className="h-6 w-6" />}
                                title="Manage Events"
                                description="View all events"
                            />
                        </Link>
                        <Link href="/organizer/bookings">
                            <QuickActionCard
                                icon={<Ticket className="h-6 w-6" />}
                                title="View Bookings"
                                description="Check bookings"
                            />
                        </Link>
                        <Link href="/organizer/wallet">
                            <QuickActionCard
                                icon={<TrendingUp className="h-6 w-6" />}
                                title="Earnings"
                                description="Track revenue"
                            />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({
    title,
    value,
    subtitle,
    icon,
    bgColor,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;
}) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">{title}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-full ${bgColor}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickActionCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-center">
            <div className="flex justify-center mb-2 text-slate-600">{icon}</div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-slate-500">{description}</p>
        </div>
    );
}

function BookingStatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
        CONFIRMED: { color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3" /> },
        PENDING: { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-3 w-3" /> },
        CANCELLED: { color: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3" /> },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <Badge variant="outline" className={`text-xs ${config.color} border-0`}>
            <span className="flex items-center gap-1">
                {config.icon}
                {status}
            </span>
        </Badge>
    );
}

function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}