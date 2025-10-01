/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import LegalLayout from "./layout";

export default function ContactUs() {
  return (
    <LegalLayout>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <h1 className="text-4xl font-bold text-center">Contact Us</h1>

        {/* General Support */}
        <Card>
          <CardContent className="p-6 space-y-2">
            <h2 className="text-2xl font-semibold">General Support</h2>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-5 h-5" /> <span>support@zuperr.co</span>
            </div>
            <p className="text-sm text-gray-600">
              We usually reply within 24–48 business hours.
            </p>
          </CardContent>
        </Card>

        {/* Feedback / Suggestions Form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Feedback / Suggestions</h2>
            <form className="grid gap-4">
              <Input type="text" placeholder="Full Name" required />
              <Input type="email" placeholder="Email Id" required />
              <Input type="text" placeholder="Subject" required />
              <Textarea placeholder="Your message here..." required />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="I’m contacting as..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jobseeker">Job Seeker</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Submit</Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Connect with Us</h2>
            <div className="flex flex-wrap gap-6 text-gray-700">
              <Link
                to="https://www.linkedin.com/company/zuperr9/"
                target="_blank"
                className="flex items-center gap-2"
              >
                <Linkedin /> LinkedIn
              </Link>
              <Link
                to="https://www.instagram.com/zuperr.co/"
                target="_blank"
                className="flex items-center gap-2"
              >
                <Instagram /> Instagram
              </Link>
              <Link
                to="https://x.com/zuperr_co"
                target="_blank"
                className="flex items-center gap-2"
              >
                <Twitter /> X (Twitter)
              </Link>
              <Link
                to="https://www.facebook.com/profile.php?id=61568067879295"
                target="_blank"
                className="flex items-center gap-2"
              >
                <Facebook /> Meta (Facebook)
              </Link>
              <Link
                to="https://www.whatsapp.com/channel/0029Vav7R6R8vd1ItdD5YF18"
                target="_blank"
                className="flex items-center gap-2"
              >
                <MessageCircle /> WhatsApp Channel
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Business Enquiries */}
        <Card>
          <CardContent className="p-6 space-y-2">
            <h2 className="text-2xl font-semibold">Business Enquiries</h2>
            <p>
              For partnership or media enquiries, write to us at:{" "}
              <strong>support@zuperr.co</strong>
            </p>
          </CardContent>
        </Card>

        {/* Optional Additions */}
        <Card>
          <CardContent className="p-6 space-y-2">
            <h2 className="text-2xl font-semibold">Our Office</h2>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5" />{" "}
              <span>Virtual HQ - To be added</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5" />{" "}
              <span>WhatsApp Support - Coming Soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </LegalLayout>
  );
}
