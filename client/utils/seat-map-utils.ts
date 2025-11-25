import { Seats } from "@/types/seat";
import { Section } from "@/types/section";

export interface SeatMapConfig {
    showRowLabels: boolean;
    showSectionLabels: boolean;
    compactMode: boolean;
    maxSeatsPerRow: number;
}

export interface SeatMapStats {
    totalSeats: number;
    availableSeats: number;
    bookedSeats: number;
    selectedSeats: number;
    sectionCount: number;
}

export class SeatMapUtils {
    /**
     * Generate seat map statistics
     */
    static generateStats(
        seats: Seats[],
        selectedSeatIds: string[]
    ): SeatMapStats {
        const totalSeats = seats.length;
        const bookedSeats = seats.filter(seat => seat.isBooked).length;
        const availableSeats = seats.filter(seat => !seat.isBooked).length;
        const selectedSeats = selectedSeatIds.length;

        const sectionIds = new Set(seats.map(seat => seat.sectionId));
        const sectionCount = sectionIds.size;

        return {
            totalSeats,
            availableSeats,
            bookedSeats,
            selectedSeats,
            sectionCount
        };
    }

    /**
     * Group seats by section and row for optimal display
     */
    static groupSeatsBySection(
        seats: Seats[],
        sections: Section[]
    ): Record<string, Record<string, Seats[]>> {
        const sectionMap = new Map(sections.map(section => [String(section.id), section.name]));
        const grouped: Record<string, Record<string, Seats[]>> = {};

        seats.forEach(seat => {
            const sectionName = sectionMap.get(String(seat.sectionId)) || `Section ${seat.sectionId}`;
            const rowLabel = this.extractRowFromLabel(seat.label);

            if (!grouped[sectionName]) {
                grouped[sectionName] = {};
            }

            if (!grouped[sectionName][rowLabel]) {
                grouped[sectionName][rowLabel] = [];
            }

            grouped[sectionName][rowLabel].push(seat);
        });

        // Sort seats within each row
        Object.keys(grouped).forEach(sectionName => {
            Object.keys(grouped[sectionName]).forEach(rowLabel => {
                grouped[sectionName][rowLabel].sort((a, b) =>
                    this.naturalSort(a.label, b.label)
                );
            });
        });

        return grouped;
    }

    /**
     * Extract row identifier from seat label (e.g., "A12" -> "A")
     */
    static extractRowFromLabel(label: string): string {
        const match = label.match(/^([A-Z]+)/);
        return match ? match[1] : '#';
    }

    /**
     * Natural sort for seat labels (handles numbers correctly)
     */
    static naturalSort(a: string, b: string): number {
        return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: 'base'
        });
    }

    /**
     * Calculate optimal seat display configuration
     */
    static calculateDisplayConfig(
        seatCount: number,
        containerWidth: number
    ): SeatMapConfig {
        const seatSize = 48; // 3rem in pixels
        const seatGap = 8; // gap between seats
        const maxSeatsPerRow = Math.floor((containerWidth - 20) / (seatSize + seatGap));

        return {
            showRowLabels: seatCount > 20,
            showSectionLabels: true,
            compactMode: seatCount > 100,
            maxSeatsPerRow: Math.max(8, maxSeatsPerRow)
        };
    }

    /**
     * Generate accessibility description for seat
     */
    static generateSeatDescription(
        seat: Seats,
        sectionName: string,
        isSelected: boolean,
        isProcessing: boolean
    ): string {
        let description = `Seat ${seat.label} in ${sectionName}`;

        if (seat.isBooked) {
            description += ', already booked, unavailable';
        } else if (isProcessing) {
            description += ', currently being processed';
        } else if (isSelected) {
            description += ', selected for booking';
        } else {
            description += ', available for selection';
        }

        return description;
    }

    /**
     * Validate seat selection constraints
     */
    static validateSeatSelection(
        seatId: string,
        currentlySelected: string[],
        maxSeats: number,
        seat?: Seats
    ): { isValid: boolean; reason?: string } {
        if (!seat) {
            return { isValid: false, reason: 'Seat not found' };
        }

        if (seat.isBooked) {
            return { isValid: false, reason: 'Seat is already booked' };
        }

        if (currentlySelected.includes(seatId)) {
            return { isValid: false, reason: 'Seat is already selected' };
        }

        if (currentlySelected.length >= maxSeats) {
            return { isValid: false, reason: `Maximum of ${maxSeats} seats allowed` };
        }

        return { isValid: true };
    }

    /**
     * Calculate distance between seats (for grouping logic)
     */
    static calculateSeatDistance(seat1: Seats, seat2: Seats): number {
        // If different sections, return high distance
        if (seat1.sectionId !== seat2.sectionId) {
            return 1000;
        }

        // Extract row and seat numbers
        const row1 = this.extractRowFromLabel(seat1.label);
        const row2 = this.extractRowFromLabel(seat2.label);

        const num1 = parseInt(seat1.label.replace(/[A-Z]/g, '')) || 0;
        const num2 = parseInt(seat2.label.replace(/[A-Z]/g, '')) || 0;

        // If same row, calculate seat number difference
        if (row1 === row2) {
            return Math.abs(num1 - num2);
        }

        // Different rows, calculate row difference + seat difference
        const rowDiff = Math.abs(row1.charCodeAt(0) - row2.charCodeAt(0));
        return rowDiff * 10 + Math.abs(num1 - num2);
    }

    /**
     * Find best available seats for group booking
     */
    static findBestGroupSeats(
        seats: Seats[],
        count: number,
        preferredSectionId?: number
    ): string[] {
        const availableSeats = seats.filter(seat => !seat.isBooked);

        if (availableSeats.length < count) {
            return [];
        }

        // Filter by preferred section if specified
        const candidateSeats = preferredSectionId
            ? availableSeats.filter(seat => seat.sectionId === preferredSectionId)
            : availableSeats;

        if (candidateSeats.length < count) {
            return [];
        }

        // Find the best consecutive seats
        let bestGroup: Seats[] = [];
        let bestScore = Infinity;

        for (let i = 0; i <= candidateSeats.length - count; i++) {
            const group = candidateSeats.slice(i, i + count);
            const score = this.calculateGroupScore(group);

            if (score < bestScore) {
                bestScore = score;
                bestGroup = group;
            }
        }

        return bestGroup.map(seat => seat.id);
    }

    /**
     * Calculate score for seat group (lower is better)
     */
    private static calculateGroupScore(seats: Seats[]): number {
        if (seats.length <= 1) return 0;

        let score = 0;
        for (let i = 0; i < seats.length - 1; i++) {
            score += this.calculateSeatDistance(seats[i], seats[i + 1]);
        }

        return score / (seats.length - 1);
    }

    /**
     * Generate seat map layout for rendering
     */
    static generateSeatLayout(
        seats: Seats[],
        sections: Section[],
        config: SeatMapConfig
    ): Array<{
        sectionName: string;
        rows: Array<{
            rowLabel: string;
            seats: Seats[];
            shouldBreak?: boolean;
        }>;
    }> {
        const grouped = this.groupSeatsBySection(seats, sections);
        const layout: Array<{
            sectionName: string;
            rows: Array<{
                rowLabel: string;
                seats: Seats[];
                shouldBreak?: boolean;
            }>;
        }> = [];

        Object.entries(grouped).forEach(([sectionName, rows]) => {
            const sectionRows: Array<{
                rowLabel: string;
                seats: Seats[];
                shouldBreak?: boolean;
            }> = [];

            Object.entries(rows).forEach(([rowLabel, rowSeats]) => {
                if (config.compactMode && rowSeats.length > config.maxSeatsPerRow) {
                    // Break long rows into chunks
                    for (let i = 0; i < rowSeats.length; i += config.maxSeatsPerRow) {
                        const chunk = rowSeats.slice(i, i + config.maxSeatsPerRow);
                        sectionRows.push({
                            rowLabel: i === 0 ? rowLabel : `${rowLabel}-${Math.floor(i / config.maxSeatsPerRow) + 1}`,
                            seats: chunk,
                            shouldBreak: i + config.maxSeatsPerRow < rowSeats.length
                        });
                    }
                } else {
                    sectionRows.push({
                        rowLabel,
                        seats: rowSeats
                    });
                }
            });

            layout.push({
                sectionName,
                rows: sectionRows.sort((a, b) => this.naturalSort(a.rowLabel, b.rowLabel))
            });
        });

        return layout;
    }
}