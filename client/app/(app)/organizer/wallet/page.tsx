"use client";

import { useOrganizerEarnings } from "@/hooks/organizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/format-date";
import { DollarSign, TrendingUp, CreditCard, Wallet, BarChart3 } from "lucide-react";

export default function OrganizerWalletPage() {
    const { data: earnings, isLoading, isError } = useOrganizerEarnings();

    if (isLoading) {
        return <WalletPageSkeleton />;
    }

    if (isError || !earnings) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-red-500">Failed to load earnings data</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Wallet & Earnings</h1>
                <p className="text-slate-500 mt-1">Track your revenue and payment history</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-100">Total Earnings</p>
                                <p className="text-3xl font-bold mt-1">
                                    NPR {earnings.totalEarnings.toLocaleString()}
                                </p>
                                <p className="text-xs text-green-100 mt-1">From all confirmed bookings</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-full">
                                <Wallet className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Transactions</p>
                                <p className="text-3xl font-bold mt-1">{earnings.totalTransactions}</p>
                                <p className="text-xs text-slate-400 mt-1">Successful payments</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-full">
                                <CreditCard className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Average per Transaction</p>
                                <p className="text-3xl font-bold mt-1">
                                    NPR {earnings.totalTransactions > 0
                                        ? Math.round(earnings.totalEarnings / earnings.totalTransactions).toLocaleString()
                                        : 0}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Per booking</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-full">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Earnings Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Monthly Earnings Overview
                    </CardTitle>
                    <CardDescription>Last 6 months performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {earnings.earningsByMonth.map((month, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-24 text-sm text-slate-500">{month.month}</div>
                                <div className="flex-1">
                                    <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${earnings.totalEarnings > 0
                                                    ? (month.earnings / earnings.totalEarnings) * 100
                                                    : 0}%`,
                                                minWidth: month.earnings > 0 ? "2%" : "0%",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-32 text-right">
                                    <p className="font-semibold">NPR {month.earnings.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">{month.bookings} bookings</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings by Event */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Earnings by Event</CardTitle>
                        <CardDescription>Revenue breakdown per event</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {earnings.earningsByEvent.length > 0 ? (
                            <div className="space-y-4">
                                {earnings.earningsByEvent
                                    .sort((a, b) => b.totalEarnings - a.totalEarnings)
                                    .slice(0, 5)
                                    .map((event) => (
                                        <div
                                            key={event.eventId}
                                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{event.eventTitle}</p>
                                                <p className="text-xs text-slate-500">{event.totalBookings} bookings</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-green-600">
                                                    NPR {event.totalEarnings.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No earnings data yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Transactions</CardTitle>
                        <CardDescription>Latest payment activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {earnings.recentPayments.length > 0 ? (
                            <div className="space-y-4">
                                {earnings.recentPayments.slice(0, 5).map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {payment.booking.attendee.user.name || payment.booking.attendee.user.email}
                                            </p>
                                            <p className="text-xs text-slate-500">{payment.booking.event.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">
                                                +NPR {payment.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {formatDate(payment.paidAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No transactions yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* All Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Transaction History</CardTitle>
                    <CardDescription>Complete list of all payments received</CardDescription>
                </CardHeader>
                <CardContent>
                    {earnings.recentPayments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {earnings.recentPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-mono text-xs">
                                                {payment.transactionId || `#${payment.id}`}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {payment.booking.attendee.user.name || "N/A"}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {payment.booking.attendee.user.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[150px] truncate">
                                                {payment.booking.event.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {payment.method}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold text-green-600">
                                                NPR {payment.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500">
                                                {formatDate(payment.paidAt)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No transactions yet</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Transactions will appear here once you receive payments
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function WalletPageSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
