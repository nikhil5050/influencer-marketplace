"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

interface Offer {
  id: number;
  title: string;
  discount: string;
  image: string;
  badge?: string;
  link: string;
  color: string;
}

const OFFERS: Offer[] = [
  {
    id: 1,
    title: "Get Up to 50% Off",
    discount: "Limited Time Offer",
    image: "https://images.unsplash.com/photo-1505252585461-04db1267ae5b?w=500&q=80",
    badge: "50% OFF",
    link: "/marketplace?discount=summer",
    color: "from-green-400 to-emerald-300",
  },
  {
    id: 2,
    title: "Creator's Special Week",
    discount: "Join Now",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&q=80",
    link: "/register?role=influencer",
    color: "from-yellow-300 to-orange-300",
  },
  {
    id: 3,
    title: "Premium Brand Packages",
    discount: "Exclusive Deals",
    image: "https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=500&q=80",
    link: "/register?role=brand",
    color: "from-pink-300 to-rose-400",
  },
];

export default function OffersSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange-600 tracking-widest uppercase mb-3">
            Featured Offers
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Limited Time Deals
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Exclusive offers for creators and brands. Don't miss out on amazing
            opportunities to grow your presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <Link
              key={offer.id}
              href={offer.link}
              className="group relative rounded-3xl overflow-hidden card-hover h-80"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${offer.image})` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 text-white">
                {/* Heart Icon */}
                <button
                  className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Heart size={20} className="text-white" />
                </button>

                {/* Badge */}
                {offer.badge && (
                  <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-full w-fit font-bold text-sm shadow-lg">
                    <ShoppingBag size={16} />
                    {offer.badge}
                  </div>
                )}

                {/* Text Content */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                    {offer.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base">
                    {offer.discount}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                  <span>Explore Now</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
