import { motion } from "motion/react";
import imgModern from "figma:asset/5887c886e1ce213ea4a51b4b529d4ef3668b0ee7.png";
import img2000s from "figma:asset/d0c17c8a9f6e8a21d8e913cb2139c1e1be5c0567.png";
import img1990s from "figma:asset/175db61f0d922a36f53a6f249c4f73e63535c15d.png";


interface EraSelectorProps {
  onSelectEra: (era: "90s" | "2000s" | "modern") => void;
}

export function EraSelector({ onSelectEra }: EraSelectorProps) {
  const eras = [
    {
      id: "90s" as const,
      title: "1990s",
      movie: "Titanic (1997)",
      image: img1990s,
      glow: "hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.4)]",
      glowColor: "rgba(245,158,11,0.3)",
    },
    {
      id: "2000s" as const,
      title: "2000s",
      movie: "Avatar (2009)",
      image: img2000s,
      glow: "hover:shadow-[0_20px_60px_-15px_rgba(96,165,250,0.4)]",
      glowColor: "rgba(96,165,250,0.3)",
    },
    {
      id: "modern" as const,
      title: "Modern",
      movie: "F1 (2025)",
      image: imgModern,
      glow: "hover:shadow-[0_20px_60px_-15px_rgba(226,232,240,0.4)]",
      glowColor: "rgba(226,232,240,0.3)",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      {eras.map((era, index) => (
        <motion.div
          key={era.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -10 }}
          onClick={() => onSelectEra(era.id)}
          className={`relative overflow-hidden rounded-2xl cursor-pointer group ${era.glow} transition-all duration-300`}
          style={{
            clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
          }}
        >
          {/* Image */}
          <div className="relative h-125 overflow-hidden">
            <motion.img
              src={era.image}
              alt={era.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, ${era.glowColor} 0%, transparent 70%)`,
              }}
            />
          </div>

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <motion.h3
              className="text-white tracking-wider mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {era.title}
            </motion.h3>
            <motion.p
              className="text-slate-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {era.movie}
            </motion.p>
          </div>

          {/* Parallax effect indicator */}
          <motion.div
            className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      ))}
    </div>
  );
}
