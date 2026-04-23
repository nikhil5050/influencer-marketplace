import Link from "next/link";
import { Sparkles, Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-stone-400 pt-16 pb-8 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-white mb-4"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              Influence<span className="text-orange-500">Hub</span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-500">
              India's most trusted influencer marketing platform. Connecting
              real brands with authentic creators.
            </p>
            <div className="flex gap-4 mt-5">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              {["Marketplace", "For Brands", "For Creators", "Pricing"].map(
                (l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="hover:text-orange-500 transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Blog", "Careers", "Press"].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>
            © 2026 InfluenceHub. All rights reserved. Made with ❤️ in India 🇮🇳
          </p>
          <p className="text-stone-600">GST: 27AABCU9603R1ZX</p>
        </div>
      </div>
    </footer>
  );
}
