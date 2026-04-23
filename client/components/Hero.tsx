"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const videos = [
  "https://mediumaquamarine-quetzal-462306.hostingersite.com//public/9e3c4e392134bbbe1096fe31058017cb.mp4","https://mediumaquamarine-quetzal-462306.hostingersite.com//public/9e7d4d5c382bf881b6d6f6767c6150ca_720w.mp4","https://mediumaquamarine-quetzal-462306.hostingersite.com//public/94cd2b5ba8ded567599b46fdfde6f1e1_720w.mp4","https://mediumaquamarine-quetzal-462306.hostingersite.com//public/95c864fa947d10478547f234105c0ee1.mp4","https://mediumaquamarine-quetzal-462306.hostingersite.com/public/db0c4c19abeeaf20c88076c14ed83eda_720w.mp4"
];

const VerticalSlider = ({ reverse = false }: { reverse?: boolean }) => {
  // Double the array to create a seamless loop
  const displayItems = [...videos, ...videos];

  return (
    <div className="flex flex-col gap-4 overflow-hidden h-[120vh]">
      <motion.div
        initial={{ y: reverse ? "-50%" : "0%" }}
        animate={{ y: reverse ? "0%" : "-50%" }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
        className="flex flex-col gap-4"
      >
        {displayItems.map((src, idx) => (
          <div key={idx} className="relative w-full h-[350px] rounded-3xl overflow-hidden shadow-xl">
            <video
              src={src}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Hero() {
  return (
    <main className="relative min-h-screen bg-white flex items-center overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text Content */}
        <div className="z-10 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-neutral-900 leading-[0.9]">
              We humanize <br /> 
              <span className="text-neutral-800">brands</span>
            </h1>
            
            <p className="mt-8 text-lg md:text-xl text-neutral-600 max-w-md leading-relaxed">
              Founded by creators, we are a global marketing agency with creators 
              at its core — built for creative, media & commerce.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10 group flex items-center gap-2 bg-[#f03a47] text-white px-8 py-4 rounded-full font-medium transition-all"
            >
              Get in touch
              <div className="bg-white/20 p-1 rounded-full">
                <ArrowUpRight size={20} />
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side: Animated Video Grid */}
        <div className="relative order-1 lg:order-2 h-[80vh] flex gap-8">
          {/* Top & Bottom Blur Overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-20 backdrop-blur-[2px]" />
          
          
          <div className="w-1/2">
            <VerticalSlider />
          </div>
          <div className="w-1/2 mt-12">
            <VerticalSlider reverse />
          </div>
        </div>

        {/* Bottom Blur Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 backdrop-blur-[2px]" />
      </div>
    </main>
  );
}