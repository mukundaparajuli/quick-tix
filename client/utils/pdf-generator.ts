import jsPDF from 'jspdf';

export interface BookingTicketData {
    bookingId: number;
    event: {
        title: string;
        date: string;
        location: string;
        organizer?: {
            organizationName: string;
            contactEmail: string;
            user: {
                name: string;
            };
        };
    };
    seats: Array<{
        id: number;
        label: string;
        sectionName: string;
    }>;
    payment: {
        method: string;
        transactionId: string | null;
        paidAt: string | null;
    } | null;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
}

export const generateBookingTicketPDF = (booking: BookingTicketData) => {
    // Create A4 size PDF (210 x 297 mm)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Colors
    const primaryColor = [59, 130, 246]; // Blue
    const secondaryColor = [107, 114, 128]; // Gray
    const accentColor = [16, 185, 129]; // Green

    let yPos = margin;

    // Header with border
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Company branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(31, 41, 55);
    doc.text('QUICK TIX', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Event Booking Confirmation', pageWidth / 2, 28, { align: 'center' });

    yPos = 50;

    // Decorative line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Booking ID prominently displayed
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('BOOKING CONFIRMATION', margin, yPos);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`Booking ID: #${booking.bookingId.toString().padStart(6, '0')}`, margin, yPos + 8);

    // Status badges
    const statusColor = booking.status === 'CONFIRMED' ? accentColor : [239, 68, 68];
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(pageWidth - margin - 40, yPos - 5, 40, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(booking.status, pageWidth - margin - 20, yPos, { align: 'center' });

    yPos += 25;

    // Event Details Section
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text('EVENT DETAILS', margin + 5, yPos + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text(`Event: ${booking.event.title}`, margin + 5, yPos + 18);

    const eventDate = new Date(booking.event.date);
    doc.text(`Date & Time: ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, margin + 5, yPos + 26);
    doc.text(`Venue: ${booking.event.location || 'Venue TBD'}`, margin + 5, yPos + 34);

    yPos += 45;

    // Organizer Information
    if (booking.event.organizer) {
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text('ORGANIZED BY', margin + 5, yPos + 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(17, 24, 39);
        doc.text(`${booking.event.organizer.organizationName}`, margin + 5, yPos + 16);
        doc.text(`Contact: ${booking.event.organizer.contactEmail}`, margin + 5, yPos + 22);

        yPos += 35;
    }

    // Seat Information
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, yPos, contentWidth, Math.max(25, booking.seats.length * 8 + 15), 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('YOUR SEATS', margin + 5, yPos + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);

    booking.seats.forEach((seat, index) => {
        doc.text(`${index + 1}. Seat ${seat.label} - ${seat.sectionName}`, margin + 5, yPos + 18 + (index * 8));
    });

    yPos += Math.max(35, booking.seats.length * 8 + 25);

    // Payment Information
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('PAYMENT DETAILS', margin + 5, yPos + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);

    // Total Amount - prominently displayed
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(`Rs. ${booking.totalPrice.toFixed(2)}`, pageWidth - margin - 5, yPos + 20, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`Payment Method: ${booking.payment?.method?.toUpperCase() || 'N/A'}`, margin + 5, yPos + 20);
    doc.text(`Transaction ID: ${booking.payment?.transactionId || 'N/A'}`, margin + 5, yPos + 28);

    if (booking.payment?.paidAt) {
        doc.text(`Payment Date: ${new Date(booking.payment.paidAt).toLocaleString()}`, margin + 5, yPos + 36);
    }

    yPos += 50;

    // Important Notes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text('IMPORTANT NOTES:', margin, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    const notes = [
        '• Please arrive at the venue 30 minutes before the event starts.',
        '• Bring this ticket (printed or digital) for entry verification.',
        '• No refunds or exchanges unless specified by the organizer.',
        '• For any queries, contact the organizer directly.'
    ];

    notes.forEach((note, index) => {
        doc.text(note, margin, yPos + 12 + (index * 6));
    });

    yPos += 40;

    // Footer
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`Booking created on: ${new Date(booking.createdAt).toLocaleString()}`, margin, yPos);
    doc.text(`This is an electronically generated ticket. No signature required.`, pageWidth - margin, yPos, { align: 'right' });

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Thank you for choosing Quick Tix!', pageWidth / 2, yPos, { align: 'center' });

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Experience the best events with us', pageWidth / 2, yPos + 3, { align: 'center' });

    // Save the PDF
    doc.save(`QuickTix-Booking-${booking.bookingId.toString().padStart(6, '0')}.pdf`);
};