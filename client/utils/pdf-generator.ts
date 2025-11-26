import jsPDF from 'jspdf';

export interface BookingTicketData {
    bookingId: number;
    event: {
        title: string;
        date: string;
        location: string;
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
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica', 'bold');

    // Header
    doc.setFontSize(20);
    doc.text('QUICK TIX', 105, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.text('BOOKING TICKET', 105, 35, { align: 'center' });

    // Booking ID
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 55);

    // Event Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Event Details', 20, 75);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Event: ${booking.event.title}`, 20, 90);
    doc.text(`Date: ${new Date(booking.event.date).toLocaleString()}`, 20, 105);
    doc.text(`Location: ${booking.event.location || 'Venue TBD'}`, 20, 120);

    // Seat Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Seat Details', 20, 140);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    let yPos = 155;
    booking.seats.forEach((seat, index) => {
        doc.text(`${index + 1}. ${seat.label} - ${seat.sectionName}`, 20, yPos);
        yPos += 15;
    });

    // Payment Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Payment Details', 20, yPos + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Total Amount: Rs. ${booking.totalPrice.toFixed(2)}`, 20, yPos + 25);
    doc.text(`Payment Method: ${booking.payment?.method?.toUpperCase() || 'N/A'}`, 20, yPos + 40);
    doc.text(`Transaction ID: ${booking.payment?.transactionId || 'N/A'}`, 20, yPos + 55);

    if (booking.payment?.paidAt) {
        doc.text(`Payment Date: ${new Date(booking.payment.paidAt).toLocaleString()}`, 20, yPos + 70);
    }

    // Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Status', 20, yPos + 90);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Booking Status: ${booking.status}`, 20, yPos + 105);
    doc.text(`Payment Status: ${booking.paymentStatus}`, 20, yPos + 120);

    // Footer
    doc.setFontSize(10);
    doc.text(`Booking Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 20, 270);
    doc.text('Thank you for choosing Quick Tix!', 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`booking-${booking.bookingId}.pdf`);
};