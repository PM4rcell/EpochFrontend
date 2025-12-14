import { motion } from "motion/react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

interface FooterProps {
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function Footer({ theme = "default" }: FooterProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          divider: "bg-gradient-to-r from-transparent via-amber-500/30 to-transparent",
          linkHover: "hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        };
      case "2000s":
        return {
          divider: "bg-gradient-to-r from-transparent via-blue-400/30 to-transparent",
          linkHover: "hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]",
        };
      case "modern":
        return {
          divider: "bg-gradient-to-r from-transparent via-slate-300/30 to-transparent",
          linkHover: "hover:text-slate-300 hover:drop-shadow-[0_0_8px_rgba(226,232,240,0.5)]",
        };
      default:
        return {
          divider: "bg-gradient-to-r from-transparent via-amber-500/30 to-transparent",
          linkHover: "hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        };
    }
  };

  const colors = getThemeColors();

  const links = [
    { label: "Legal", href: "#" },
    { label: "Contact", href: "#" },
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
  ];

  const socials = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Youtube, href: "#" },
  ];

  return (
    <footer className="mt-20 border-t border-white/10">
      {/* Thin divider with gradient */}
      <div className={`h-px ${colors.divider}`} />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links */}
          <div className="flex flex-wrap items-center gap-6">
            {links.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className={`text-slate-400 ${colors.linkHover} transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`text-slate-400 ${colors.linkHover} transition-all duration-200`}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-600 mt-6"
        >
          © 2025 CINERAMA. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}
