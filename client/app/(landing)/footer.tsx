export default function Footer() {
    return (
        <footer className="w-full bg-gray-800 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; {new Date().getFullYear()} Quick Tix. All rights reserved.</p>
            </div>
        </footer>
    );
}