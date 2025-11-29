"use client";

import { useQuery } from "@tanstack/react-query";
import { getCapacitySummary, CapacitySummary } from "@/services/seat.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info, CircleDot } from "lucide-react";

interface CapacityInfoProps {
    venueId: number;
}

export default function CapacityInfo({ venueId }: CapacityInfoProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["capacity-summary", venueId],
        queryFn: () => getCapacitySummary(venueId),
        enabled: !!venueId,
        refetchInterval: 5000, // Refetch every 5 seconds to keep updated
    });

    if (isLoading) {
        return (
            <Card className="mb-4">
                <CardContent className="pt-4">
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError || !data) {
        return null;
    }

    const {
        eventCapacity,
        venueCapacity,
        totalSectionCapacity,
        totalSeatsCreated,
        isFullyConfigured,
        checks,
        warnings,
        info,
        sections
    } = data;

    const seatsProgress = venueCapacity ? (totalSeatsCreated / venueCapacity) * 100 : 0;

    return (
        <Card className="mb-4 border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-slate-500" />
                        Capacity Configuration
                    </span>
                    {isFullyConfigured ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-xs">
                            In Progress
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Capacity Chain Display */}
                <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Capacity Chain</p>
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <div className="flex items-center gap-1">
                            <span className="text-slate-600">Event:</span>
                            <span className="font-semibold">{eventCapacity ?? '-'}</span>
                        </div>
                        <span className={`text-lg ${checks.venueMatchesEvent ? 'text-green-500' : 'text-red-500'}`}>
                            {checks.venueMatchesEvent ? '=' : '≠'}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-slate-600">Venue:</span>
                            <span className="font-semibold">{venueCapacity ?? '-'}</span>
                        </div>
                        <span className={`text-lg ${checks.sectionsMatchVenue ? 'text-green-500' : 'text-amber-500'}`}>
                            {checks.sectionsMatchVenue ? '=' : '→'}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-slate-600">Sections:</span>
                            <span className="font-semibold">{totalSectionCapacity}</span>
                        </div>
                        <span className={`text-lg ${checks.seatsMatchSections ? 'text-green-500' : 'text-amber-500'}`}>
                            {checks.seatsMatchSections ? '=' : '→'}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-slate-600">Seats:</span>
                            <span className="font-semibold">{totalSeatsCreated}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {venueCapacity && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Seats Created</span>
                            <span>{totalSeatsCreated} / {venueCapacity}</span>
                        </div>
                        <Progress
                            value={Math.min(seatsProgress, 100)}
                            className={`h-2 ${seatsProgress > 100
                                    ? '[&>div]:bg-red-500'
                                    : seatsProgress === 100
                                        ? '[&>div]:bg-green-500'
                                        : ''
                                }`}
                        />
                    </div>
                )}

                {/* Warnings */}
                {warnings.length > 0 && (
                    <div className="space-y-2">
                        {warnings.map((warning, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-2 rounded-md"
                            >
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{warning}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Messages */}
                {info.length > 0 && (
                    <div className="space-y-2">
                        {info.map((message, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 p-2 rounded-md"
                            >
                                <CircleDot className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{message}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sections Status */}
                <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500">Sections</p>
                    <div className="space-y-2">
                        {sections.map((section) => {
                            return (
                                <div key={section.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        {section.isOverCapacity ? (
                                            <AlertTriangle className="h-3 w-3 text-red-500" />
                                        ) : section.isFull ? (
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-slate-200" />
                                        )}
                                        <span className="font-medium">{section.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">
                                            {section.seatsCreated}/{section.capacity || '∞'}
                                        </span>
                                        {section.isOverCapacity && (
                                            <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                                Over
                                            </Badge>
                                        )}
                                        {section.isFull && !section.isOverCapacity && (
                                            <Badge className="text-[10px] px-1 py-0 bg-green-100 text-green-700">
                                                Full
                                            </Badge>
                                        )}
                                        {!section.isFull && !section.isOverCapacity && section.capacity && (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                {section.remainingSlots} left
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}