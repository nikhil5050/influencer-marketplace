"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 text-center">
        <h1 className="text-5xl font-bold text-stone-900 mb-6">
          Get in <span className="text-orange-600">Touch</span>
        </h1>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <div className="bg-white rounded-2xl p-8 border border-stone-100 text-center hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Email</h3>
            <p className="text-stone-600">support@influencehub.com</p>
            <p className="text-sm text-stone-500 mt-2">We'll reply within 24 hours</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-100 text-center hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone size={24} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Phone</h3>
            <p className="text-stone-600">+1 (555) 123-4567</p>
            <p className="text-sm text-stone-500 mt-2">Mon-Fri, 9AM-6PM EST</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-100 text-center hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Location</h3>
            <p className="text-stone-600">San Francisco, CA</p>
            <p className="text-sm text-stone-500 mt-2">Serving Global Clients</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-stone-100 p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <MessageSquare size={28} className="text-orange-600" />
              Send us a Message
            </h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                ✓ Thank you! Your message has been sent successfully. We'll be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Brand Partnership">Brand Partnership</option>
                  <option value="Influencer Inquiry">Influencer Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold text-stone-900 text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              q: "How long does it take to get a response?",
              a: "We typically respond to inquiries within 24 hours during business days.",
            },
            {
              q: "Do you offer phone support?",
              a: "Yes! Call us at +1 (555) 123-4567 during business hours (Mon-Fri, 9AM-6PM EST).",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, bank transfers, and digital payment methods.",
            },
            {
              q: "Can I schedule a demo?",
              a: "Absolutely! Contact us and we'll arrange a personalized demo for your team.",
            },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-stone-100">
              <h3 className="font-semibold text-stone-900 mb-2">{item.q}</h3>
              <p className="text-stone-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
