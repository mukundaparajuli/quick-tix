// "use client"

// import React, { useState } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// const IrregularSeatingLayout = () => {


//     // const [layout, setLayout] = useState(initialLayout);
//     const [selectedSeats, setSelectedSeats] = useState([]);

//     const handleSeatClick = (seatId: string, section: string, row: string) => {
//         // Find the seat in the layout
//         const sectionIndex = layout.sections.findIndex(s => s.name === section);
//         const rowIndex = layout.sections[sectionIndex].rows.findIndex(r => r.row === row);
//         const seat = layout.sections[sectionIndex].rows[rowIndex].seats.find(s => s.id === seatId);

//         if (!seat || seat.status === "booked") return;

//         // Update seat status
//         const newLayout = { ...layout };
//         const seatIndex = newLayout.sections[sectionIndex].rows[rowIndex].seats.findIndex(s => s.id === seatId);
//         const newStatus = seat.status === "selected" ? "available" : "selected";
//         newLayout.sections[sectionIndex].rows[rowIndex].seats[seatIndex].status = newStatus;

//         setLayout(newLayout);

//         // Update selected seats list
//         setSelectedSeats(prev => {
//             const seatInfo = `${section} - Row ${row} - Seat ${seatId}`;
//             return newStatus === "selected"
//                 ? [...prev, seatInfo]
//                 : prev.filter(s => s !== seatInfo);
//         });
//     };

//     const getSeatColor = (status) => {
//         switch (status) {
//             case "available": return "bg-gray-200 hover:bg-blue-200";
//             case "selected": return "bg-blue-500 text-white";
//             case "booked": return "bg-gray-500 text-white cursor-not-allowed";
//             default: return "bg-gray-200";
//         }
//     };

//     return (
//         <Card className="w-full max-w-4xl mx-auto">
//             <CardHeader>
//                 <CardTitle>Select Your Seats</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="flex flex-col items-center space-y-8">
//                     {/* Screen */}
//                     <div className="w-3/4 h-8 bg-gray-300 rounded-lg flex items-center justify-center text-sm">
//                         SCREEN
//                     </div>

//                     {/* Sections */}
//                     {layout.sections.map((section, sectionIndex) => (
//                         <div key={sectionIndex} className="w-full">
//                             <h3 className="text-lg font-semibold mb-4">{section.name}</h3>

//                             <div className="flex flex-col gap-4">
//                                 {/* Rows */}
//                                 {section.rows.map((row, rowIndex) => (
//                                     <div key={rowIndex} className="flex items-center gap-2">
//                                         {/* Row Label */}
//                                         <div className="w-8 text-sm font-medium">{row.row}</div>

//                                         {/* Seats */}
//                                         <div className="flex gap-2">
//                                             {row.seats.map((seat, seatIndex) => (
//                                                 seat.type === "gap" ? (
//                                                     // Gap element
//                                                     <div
//                                                         key={`gap-${seatIndex}`}
//                                                         className="h-8"
//                                                         style={{ width: `${seat.size * 2}rem` }}
//                                                     />
//                                                 ) : (
//                                                     // Seat element
//                                                     <Button
//                                                         key={seat.id}
//                                                         variant="outline"
//                                                         className={`w-8 h-8 p-0 flex items-center justify-center text-xs
//                               ${getSeatColor(seat.status)}`}
//                                                         onClick={() => handleSeatClick(seat.id, section.name, row.row)}
//                                                         disabled={seat.status === "booked"}
//                                                     >
//                                                         {seat.id.split('-').pop()}
//                                                     </Button>
//                                                 )
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}

//                     {/* Legend */}
//                     <div className="flex gap-4 text-sm">
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-gray-200 rounded"></div>
//                             Available
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-blue-500 rounded"></div>
//                             Selected
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <div className="w-4 h-4 bg-gray-500 rounded"></div>
//                             Booked
//                         </div>
//                     </div>

//                     {/* Selected Seats Display */}
//                     {selectedSeats.length > 0 && (
//                         <div className="text-sm">
//                             Selected: {selectedSeats.join(", ")}
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default IrregularSeatingLayout;


