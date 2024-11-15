"use client";

import { SectionSchema } from '../../../../../../schemas/register-event.schema';


// Types and Interfaces
interface GridCell {
    type: CellType;
    id: string;
    status: SeatStatus;
}

interface GridSize {
    rows: number;
    cols: number;
}

interface Section {
    sectionName: string;
    rows: Row[];
}

interface Row {
    row: string;
    seats: (Seat | Gap)[];
}

interface Seat {
    id: string;
    status: SeatStatus;
}

interface Gap {
    type: 'gap';
    size: number;
}

interface SelectedCell {
    rowIndex: number;
    colIndex: number;
}

type CellType = 'empty' | 'seat' | 'gap';
type SeatStatus = 'available' | 'booked' | 'selected';

// Constants
const CELL_TYPES = {
    EMPTY: 'empty' as CellType,
    SEAT: 'seat' as CellType,
    GAP: 'gap' as CellType
};

// Main Component
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

const SeatLayoutForm: React.FC<{ setSectionData: React.Dispatch<React.SetStateAction<typeof SectionSchema[]>> }> = ({ setSectionData }) => {
    const [sections, setSections] = useState<Section[]>([]);
    const [currentSection, setCurrentSection] = useState<Section>({
        sectionName: '',
        rows: []
    });
    const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
    const [gridSize, setGridSize] = useState<GridSize>({ rows: 10, cols: 15 });

    // Initialize empty grid
    const initializeGrid = useCallback((): GridCell[][] => {
        return Array(gridSize.rows).fill(null).map(() =>
            Array(gridSize.cols).fill(null).map(() => ({
                type: CELL_TYPES.EMPTY,
                id: '',
                status: 'available'
            }))
        );
    }, [gridSize]);

    const [grid, setGrid] = useState<GridCell[][]>(initializeGrid());

    const handleCellClick = (rowIndex: number, colIndex: number): void => {
        const newGrid = [...grid];
        const cell = newGrid[rowIndex][colIndex];

        // Cycle through cell types
        if (cell.type === CELL_TYPES.EMPTY) {
            cell.type = CELL_TYPES.SEAT;
            cell.id = `${currentSection.sectionName}-${rowIndex + 1}-${colIndex + 1}`;
        } else if (cell.type === CELL_TYPES.SEAT) {
            cell.type = CELL_TYPES.GAP;
            cell.id = '';
        } else {
            cell.type = CELL_TYPES.EMPTY;
            cell.id = '';
        }

        setGrid(newGrid);
        setSelectedCell({ rowIndex, colIndex });
    };

    const getCellStyle = (cell: GridCell): string => {
        switch (cell.type) {
            case CELL_TYPES.SEAT:
                return 'bg-blue-200 hover:bg-blue-300';
            case CELL_TYPES.GAP:
                return 'bg-gray-300 hover:bg-gray-400';
            default:
                return 'bg-gray-100 hover:bg-gray-200';
        }
    };

    const generateLayoutData = (): { sections: Section[] } => {
        const layoutData: { sections: Section[] } = {
            sections: [],
        };

        // Process current section
        const sectionData: Section = {
            sectionName: currentSection.sectionName,
            rows: []
        };

        grid.forEach((row, rowIndex) => {
            const rowData: Row = {
                row: `${rowIndex + 1}`,
                seats: []
            };

            let currentGapSize = 0;

            row.forEach((cell, colIndex) => {
                if (cell.type === CELL_TYPES.GAP) {
                    currentGapSize++;
                } else {
                    if (currentGapSize > 0) {
                        rowData.seats.push({ type: 'gap', size: currentGapSize });
                        currentGapSize = 0;
                    }
                    if (cell.type === CELL_TYPES.SEAT) {
                        rowData.seats.push({
                            id: cell.id,
                            status: cell.status
                        });
                    }
                }
            });

            // Add any remaining gap at the end of the row
            if (currentGapSize > 0) {
                rowData.seats.push({ type: 'gap', size: currentGapSize });
            }

            // Only add rows that have seats or gaps
            if (rowData.seats.length > 0) {
                sectionData.rows.push(rowData);
            }
        });

        layoutData.sections.push(sectionData);
        return layoutData;
    };

    const handleSave = (): void => {
        const layoutData = generateLayoutData();
        console.log('Layout Data:', JSON.stringify(layoutData, null, 2));
        console.log(layoutData.sections);
        setSectionData(layoutData.sections as unknown as typeof SectionSchema[]);

    };

    const handleGridSizeChange = (dimension: keyof GridSize, value: string): void => {
        const numValue = parseInt(value) || 0;
        const newSize: GridSize = {
            ...gridSize,
            [dimension]: numValue
        };
        setGridSize(newSize);
        setGrid(Array(newSize.rows).fill(null).map(() =>
            Array(newSize.cols).fill(null).map(() => ({
                type: CELL_TYPES.EMPTY,
                id: '',
                status: 'available'
            }))
        ));
    };

    return (
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Venue Layout Editor</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Controls */}
                    <div className="flex gap-4 items-center">
                        <Input
                            placeholder="Section Name"
                            value={currentSection.sectionName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setCurrentSection({ ...currentSection, sectionName: e.target.value })}
                            className="w-48"
                        />
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Rows"
                                value={gridSize.rows}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleGridSizeChange('rows', e.target.value)}
                                className="w-20"
                            />
                            <span>×</span>
                            <Input
                                type="number"
                                placeholder="Columns"
                                value={gridSize.cols}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleGridSizeChange('cols', e.target.value)}
                                className="w-20"
                            />
                        </div>
                        <Button onClick={handleSave} className="flex items-center gap-2">
                            <Save size={16} />
                            Save Layout
                        </Button>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-100 border rounded"></div>
                            Empty
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-200 rounded"></div>
                            Seat
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                            Gap
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="overflow-x-auto">
                        <div
                            className="grid gap-1"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize.cols}, 2rem)`,
                                width: 'fit-content'
                            }}
                        >
                            {grid.map((row, rowIndex) => (
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`w-8 h-8 rounded border ${getCellStyle(cell)} transition-colors`}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                    />
                                ))
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="text-sm text-gray-600">
                        <p>Click cells to cycle through: Empty → Seat → Gap → Empty</p>
                        <p>Create your venue layout by clicking the grid cells to define seats and gaps.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SeatLayoutForm;