import { Link } from "react-router";
import { MdTravelExplore } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-green-900 mt-16 text-sm">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex items-center mb-4 gap-1">
                           <MdTravelExplore className="bg-black text-white text-4xl rounded-full" />
                            <span className="text-2xl font-bold text-black font-pacifico">Ghuro</span>
                        </div>
                        <p className="font-nunito leading-relaxed mb-6 max-w-md">
                            Discover amazing destinations and create unforgettable memories with Ghuro. 
                            Your journey begins here.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200">
                                <FaFacebookF className="text-white text-lg" />
                            </a>
                            <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200">
                                <FaTwitter className="text-white text-lg" />
                            </a>
                            <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200">
                                <FaInstagram className="text-white text-lg" />
                            </a>
                            <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200">
                                <FaLinkedinIn className="text-white text-lg" />
                            </a>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-xl font-bold font-nunito mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className=" font-nunito transition-colors duration-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className=" font-nunito transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/destinations" className=" font-nunito transition-colors duration-200">
                                    Destinations
                                </Link>
                            </li>
                            <li>
                                <Link to="/packages" className=" font-nunito transition-colors duration-200">
                                    Packages
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className=" font-nunito transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-xl font-bold font-nunito mb-6">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/help" className=" font-nunito transition-colors duration-200">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className=" font-nunito transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className=" font-nunito transition-colors duration-200">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className=" font-nunito transition-colors duration-200">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking-policy" className=" font-nunito transition-colors duration-200">
                                    Booking Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className=" font-nunito text-sm mb-4 md:mb-0">
                            © 2024 Ghuro. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className=" font-nunito text-sm transition-colors duration-200">
                                Privacy
                            </Link>
                            <Link to="/terms" className=" font-nunito text-sm transition-colors duration-200">
                                Terms
                            </Link>
                            <Link to="/cookies" className=" font-nunito text-sm transition-colors duration-200">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;