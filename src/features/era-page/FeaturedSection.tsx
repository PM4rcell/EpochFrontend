import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Calendar, Trophy, Newspaper } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";

interface FeaturedCard {
    id: string;
    type: "news" | "prize" | "event";
    title: string;
    description: string;
    image: string;
    icon: typeof Newspaper;
}

const featuredCards: FeaturedCard[] = [
    {
        id: "1",
        type: "news",
        title: "New Era Film Festival Announced",
        description: "Join us for a celebration of cinema across decades. Featuring restored classics and modern masterpieces.",
        image: "https://images.unsplash.com/photo-1702890764798-eda71e941da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
        icon: Newspaper,
    },
    {
        id: "2",
        type: "prize",
        title: "Win Premiere Tickets to F1 (2025)",
        description: "Enter for a chance to experience the adrenaline of opening night with exclusive VIP access.",
        image: "https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
        icon: Trophy,
    },
    {
        id: "3",
        type: "event",
        title: "Avatar Anniversary Screening",
        description: "Relive the magic on the big screen with a special 15th anniversary presentation in IMAX.",
        image: "https://images.unsplash.com/photo-1760420940953-3958ad9f6287?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
        icon: Calendar,
    },
];

export function FeaturedSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section
            ref={sectionRef}
            className="relative py-24 overflow-hidden"
            style={{ background: "radial-gradient(circle at center, #1a1108 0%, #0C0C0C 60%, #0B0B0B 100%)" }}
        >
            {/* Fade transition divider */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black to-transparent pointer-events-none" />

            <div className="container mx-auto px-6">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="bg-linear-to-r from-amber-600 via-amber-400 to-slate-400 bg-clip-text text-transparent mb-4 relative inline-block"
                        whileHover={{ filter: "drop-shadow(0 0 12px rgba(245,158,11,0.5))" }}
                    >
                        FEATURED NEWS & EVENTS
                    </motion.h2>

                    {/* Animated underline */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="h-px w-64 mx-auto bg-linear-to-r from-transparent via-slate-400 to-transparent"
                    />
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {featuredCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.1 + index * 0.1,
                                    ease: [0.65, 0, 0.35, 1],
                                }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="group bg-[#101010] rounded-[20px] overflow-hidden border border-amber-500/20 shadow-[0_8px_20px_rgba(255,255,255,0.08)] hover:border-amber-500/40 hover:shadow-[0_12px_30px_rgba(245,158,11,0.15)] transition-all duration-150 cursor-pointer"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <ImageWithFallback
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#101010] via-transparent to-transparent" />

                                    {/* Icon badge */}
                                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-amber-500/30 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-amber-400" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <motion.h3
                                        className="text-[#E0E0E0] mb-3 group-hover:text-white transition-colors duration-200"
                                        whileHover={{ filter: "drop-shadow(0 0 8px rgba(245,158,11,0.3))" }}
                                    >
                                        {card.title}
                                    </motion.h3>

                                    <p className="text-[#A0A0A0] mb-4 line-clamp-2">
                                        {card.description}
                                    </p>

                                    {/* Learn More Link */}
                                    <motion.div
                                        className="flex items-center gap-2 text-amber-600 group-hover:text-amber-400 transition-colors duration-200"
                                        whileHover={{ x: 5 }}
                                    >
                                        <span>Learn More</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Promotional Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                        background: "linear-gradient(90deg, #B08D57 0%, #C0C0C0 50%, #B08D57 100%)",
                    }}
                >
                    <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-black/40 backdrop-blur-sm">
                        <div className="text-center md:text-left">
                            <p className="text-white mb-2">
                                💫 Participate in this month's Epoch Prize Draw
                            </p>
                            <p className="text-slate-300">
                                Win Movie Collectibles!
                            </p>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                className="relative bg-amber-600 hover:bg-amber-500 text-white border-2 border-transparent hover:border-slate-400 rounded-full px-8 overflow-hidden group transition-all duration-250"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ["-200%", "200%"] }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                                <span className="relative z-10">Enter Now</span>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
