import {
    CreditCard,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Twitter,
} from 'lucide-react'; // Import icons
import React from 'react';

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-gray-300 py-12 mt-12 border-t border-gray-800'>
            <div className='container mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12'>
                    {/* Store Information */}
                    <div>
                        <h6 className='font-semibold text-white mb-6 text-lg'>Store Information</h6>
                        <ul className='list-none space-y-3'>
                            <li className='flex items-center gap-2'>
                                <MapPin className='w-4 h-4 text-gray-400' />
                                <span>Sector - 2 , Jankipuram Extension </span>
                            </li>
                            <li className='flex items-center gap-2'>
                                <Phone className='w-4 h-4 text-gray-400' />
                                <span>+91 9118459914</span>
                            </li>
                            <li className='flex items-center gap-2'>
                                <Mail className='w-4 h-4 text-gray-400' />
                                <a href='mailto:info@example.com' className='hover:text-green-400 transition-colors'>
                                    dwivedirishi50@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h6 className='font-semibold text-white mb-6 text-lg'>Quick Links</h6>
                        <ul className='list-none space-y-3'>
                            <li>
                                <a href='/new-arrivals' className='hover:text-green-400 transition-colors'>
                                    New Arrivals
                                </a>
                            </li>
                            <li>
                                <a href='/best-sellers' className='hover:text-green-400 transition-colors'>
                                    Best Sellers
                                </a>
                            </li>
                            <li>
                                <a href='/categories' className='hover:text-green-400 transition-colors'>
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a href='/sale' className='hover:text-green-400 transition-colors'>
                                    Sale
                                </a>
                            </li>
                            <li>
                                 <a href='/orders' className='hover:text-green-400 transition-colors'>
                                    Orders
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h6 className='font-semibold text-white mb-6 text-lg'>Customer Service</h6>
                        <ul className='list-none space-y-3'>
                            <li>
                                <a href='/shipping-policy' className='hover:text-green-400 transition-colors'>
                                    Shipping Policy
                                </a>
                            </li>
                            <li>
                                <a href='/returns-exchanges' className='hover:text-green-400 transition-colors'>
                                    Returns & Exchanges
                                </a>
                            </li>
                            <li>
                                <a href='/faq' className='hover:text-green-400 transition-colors'>
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href='/track-order' className='hover:text-green-400 transition-colors'>
                                    Track Your Order
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect With Us */}
                    <div>
                        <h6 className='font-semibold text-white mb-6 text-lg'>Connect With Us</h6>
                        <div className='flex items-center gap-4'>
                            <a
                                href='#'
                                className='hover:text-green-400 transition-colors'
                                aria-label='Facebook'
                            >
                                <Facebook className='w-6 h-6' />
                            </a>
                            <a
                                href='#'
                                className='hover:text-green-400 transition-colors'
                                aria-label='Instagram'
                            >
                                <Instagram className='w-6 h-6' />
                            </a>
                            <a
                                href='#'
                                className='hover:text-green-400 transition-colors'
                                aria-label='Twitter'
                            >
                                <Twitter className='w-6 h-6' />
                            </a>
                            <a
                                href='#'
                                className='hover:text-green-400 transition-colors'
                                aria-label='LinkedIn'
                            >
                                <Linkedin className='w-6 h-6' />
                            </a>
                        </div>
                        <div className="mt-6">
                            <h6 className='font-semibold text-white mb-3 text-lg'>Payment Methods</h6>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <ShieldCheck className="w-5 h-5 text-gray-400"/>
                                {/* Add more payment icons as needed */}
                            </div>
                            <p className="text-sm mt-2 text-gray-400">
                                Secure transactions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright and Legal */}
                <div className='mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-center'>
                    <p className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="/privacy-policy" className="hover:text-green-400 transition-colors text-sm">Privacy Policy</a>
                        <span className="text-gray-600 text-sm">|</span>
                        <a href="/terms-of-service" className="hover:text-green-400 transition-colors text-sm">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
