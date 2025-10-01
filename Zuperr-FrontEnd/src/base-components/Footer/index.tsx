/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
} from "lucide-react";
import googlePlay from "../../assets/images/google_play.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-0 mt-auto bg-white container mx-auto">
      <div className="mx-auto">
        {/* ----- Desktop Footer (visible on md and above) ----- */}
        <div className="hidden md:block">
          <div className="flex flex-row items-start md:items-center gap-2">
            <div>
              <h2 className="text-primary text-4xl font-bold italic">Zuperr</h2>

              <div className="mt-10 border border-gray-300 rounded-2xl p-6 max-w-xs">
                <p className="text-gray-700 font-medium">
                  Never miss a job opportunity with real-time alerts on our app!
                </p>
                <div className="mt-2">
                  <img src={googlePlay} alt="Google Play" className="h-16" />
                </div>
              </div>
            </div>

            <nav className="w-3/4 ml-auto pl-8 flex flex-wrap md:space-x-20 text-sm mb-20 md:mb-24 -mt-20">
              <Link to="/about-us" className="hover:text-primary mb-2 md:mb-0">
                About Us
              </Link>
              <Link to="/faqs" className="hover:text-primary mb-2 md:mb-0">
                FAQs
              </Link>
              <Link
                to="/contact-us"
                className="hover:text-primary mb-2 md:mb-0"
              >
                Contact Us
              </Link>
              <Link
                to="/trust-safety"
                className="hover:text-primary mb-2 md:mb-0"
              >
                Trust & Safety
              </Link>
              <Link
                to="/privacy-policy"
                className="hover:text-primary mb-2 md:mb-0"
              >
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="hover:text-primary">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          <div className="w-3/4 pl-8 ml-auto flex flex-col md:flex-row justify-between items-start md:items-center -mt-14">
            <div className="flex items-center mb-6 md:mb-0">
              <p className="flex flex-wrap gap-4 max-w-md text-large text-gray-2400 ml-2">
                Give us a Call{" "}
                <Link
                  to="tel:+917039494338"
                  className="font-normal text-gray-500 hover:text-primary"
                >
                  +91 7039494338
                </Link>
              </p>
            </div>
          </div>

          <div className="w-3/4 pl-8 h-30px px-2 py-2 ml-auto flex justify-between">
            <div className="flex space-x-4 border-t border-gray-300 w-full pt-2">
              <Link
                to="https://www.linkedin.com/company/zuperr9/"
                target="_blank"
                className="flex items-center gap-2 text-gray-600 hover:text-primary"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                to="https://www.instagram.com/zuperr.co/"
                target="_blank"
                className="flex items-center gap-2 text-gray-600 hover:text-primary"
              >
                <Instagram size={20} />
              </Link>
              <Link
                to="https://x.com/zuperr_co"
                target="_blank"
                className="flex items-center gap-2 text-gray-600 hover:text-primary"
              >
                <Twitter size={20} />
              </Link>
              <Link
                to="https://www.facebook.com/profile.php?id=61568067879295"
                target="_blank"
                className="flex items-center gap-2 text-gray-600 hover:text-primary"
              >
                <Facebook size={20} />
              </Link>
              <Link
                to="https://www.whatsapp.com/channel/0029Vav7R6R8vd1ItdD5YF18"
                target="_blank"
                className="flex items-center gap-2 text-gray-600 hover:text-primary"
              >
                <MessageCircle size={20} />
              </Link>
            </div>
            <div className="text-xs text-gray-500 text-right pt-4 border-t border-gray-300 w-full">
              © 2024 Zuperr. All rights reserved.
            </div>
          </div>
        </div>

        {/* ----- Mobile Footer (visible below md) ----- */}
        <div className="block md:hidden">
          <div className="flex flex-col gap-6">
            <h2 className="text-primary text-3xl font-bold italic">Zuperr</h2>

            <div className="border border-gray-300 rounded-2xl p-4">
              <p className="text-gray-700 text-sm font-medium">
                Never miss a job opportunity with real-time alerts on our app!
              </p>
              <div className="mt-3">
                <img src={googlePlay} alt="Google Play" className="h-12" />
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-3 text-sm">
              <Link to="/about-us" className="hover:text-primary">
                About Us
              </Link>
              <Link to="/contact-us" className="hover:text-primary">
                Contact Us
              </Link>
              <Link to="/trust-safety" className="hover:text-primary">
                Trust & Safety
              </Link>
              <Link to="/privacy-policy" className="hover:text-primary">
                Privacy Policy
              </Link>
              <Link
                to="/terms-conditions"
                className="hover:text-primary col-span-2"
              >
                Terms & Conditions
              </Link>
            </nav>

            <p className="text-gray-700 text-sm">
              Give us a Call{" "}
              <Link
                to="tel:+917039494338"
                className="font-normal text-gray-500 hover:text-primary"
              >
                +91 7039494338
              </Link>
            </p>

            <div className="border-t border-gray-300 pt-4 flex flex-col gap-3 items-start">
              <div className="flex space-x-4">
                <Link
                  to="https://www.linkedin.com/company/zuperr9/"
                  target="_blank"
                  className="text-gray-600 hover:text-primary"
                >
                  <Linkedin size={20} />
                </Link>
                <Link
                  to="https://www.instagram.com/zuperr.co/"
                  target="_blank"
                  className="text-gray-600 hover:text-primary"
                >
                  <Instagram size={20} />
                </Link>
                <Link
                  to="https://x.com/zuperr_co"
                  target="_blank"
                  className="text-gray-600 hover:text-primary"
                >
                  <Twitter size={20} />
                </Link>
                <Link
                  to="https://www.facebook.com/profile.php?id=61568067879295"
                  target="_blank"
                  className="text-gray-600 hover:text-primary"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  to="https://www.whatsapp.com/channel/0029Vav7R6R8vd1ItdD5YF18"
                  target="_blank"
                  className="text-gray-600 hover:text-primary"
                >
                  <MessageCircle size={20} />
                </Link>
              </div>
              <div className="text-xs text-gray-500">
                © 2024 Zuperr. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
