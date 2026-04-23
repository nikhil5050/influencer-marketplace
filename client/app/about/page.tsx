"use client";

import { Sparkles, Users, Target, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-stone-900 mb-6">
            About <span className="text-orange-600">InfluenceHub</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Connecting brands with authentic influencers to create meaningful partnerships and drive real results.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-6">Our Mission</h2>
            <p className="text-stone-600 text-lg mb-4">
              At InfluenceHub, we believe in the power of authentic connections. Our mission is to revolutionize the influencer marketing industry by making it easier for brands to find and collaborate with the right influencers.
            </p>
            <p className="text-stone-600 text-lg">
              We provide a seamless platform that bridges the gap between brands seeking visibility and influencers looking to monetize their influence in meaningful ways.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 flex items-center justify-center h-80">
            <div className="text-center">
              <Sparkles size={64} className="text-orange-600 mx-auto mb-4" />
              <p className="text-stone-700 font-semibold">Empowering Influencer Partnerships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold text-stone-900 text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-stone-100 hover:shadow-lg transition-shadow">
            <Users size={40} className="text-orange-600 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 mb-3">Authenticity</h3>
            <p className="text-stone-600">
              We believe in genuine partnerships built on real engagement and authentic connections between brands and influencers.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-stone-100 hover:shadow-lg transition-shadow">
            <Target size={40} className="text-orange-600 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 mb-3">Innovation</h3>
            <p className="text-stone-600">
              We continuously evolve our platform with cutting-edge technology to deliver the best experience for our users.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-stone-100 hover:shadow-lg transition-shadow">
            <Award size={40} className="text-orange-600 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 mb-3">Excellence</h3>
            <p className="text-stone-600">
              We're committed to delivering exceptional service and support to help our users achieve their goals.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
              <p className="text-stone-300">Active Influencers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">1000+</div>
              <p className="text-stone-300">Registered Brands</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">5000+</div>
              <p className="text-stone-300">Successful Campaigns</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">$10M+</div>
              <p className="text-stone-300">Total Collaborations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-6">Ready to Get Started?</h2>
        <p className="text-stone-600 text-lg mb-8">
          Join thousands of brands and influencers already using InfluenceHub.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/register"
            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/contact"
            className="border border-orange-600 text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
