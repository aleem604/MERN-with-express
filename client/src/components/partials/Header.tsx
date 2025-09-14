import React from "react";
import { Link } from "react-router-dom";

const menuItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Cart", href: "/cart" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const Header: React.FC = () => (
    <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-800">MyShop</div>
            <nav>
                <ul className="flex space-x-6">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </header>
);

export default Header;