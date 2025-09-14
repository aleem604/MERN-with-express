import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white w-full fixed bottom-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
                {/* Links */}
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <a href="/" className="hover:underline">
                        Home
                    </a>
                    <a href="/about" className="hover:underline">
                        About
                    </a>
                    <a href="/services" className="hover:underline">
                        Services
                    </a>
                    <a href="/contact" className="hover:underline">
                        Contact
                    </a>
                </div>
                {/* Contact Form */}
                <form
                    className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        // handle submit logic here
                    }}
                >
                    <input
                        type="email"
                        required
                        placeholder="Your email"
                        className="px-2 py-1 rounded text-black"
                    />
                    <input
                        type="text"
                        required
                        placeholder="Message"
                        className="px-2 py-1 rounded text-black"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                        Send
                    </button>
                </form>
            </div>
            <div className="text-center text-xs py-2 bg-gray-900">
                &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;