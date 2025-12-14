import { motion } from "motion/react";
import { Navbar } from "../..//components/layout/Navbar";
import { EraSelector } from "./EraSelector";
import { FeaturedSection } from "./FeaturedSection";
import { Footer } from "../..//components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { useEra } from "../../context/EraContext";

export type Era = "90s" | "2000s" | "modern";

export type LandingPageProps = {
  onNavigate?: (page: string) => void;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { setEra } = useEra();

  const handleEraSelect = (eraId: string) => {
    const era = eraId as Era;
    setEra(era);                 // app state
    navigate(`/era/${era}`);     // URL-based routing
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(226,232,240,0.05),transparent_50%)]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="container mx-auto px-6 text-center mb-16"
          >
            <motion.h1 className="mb-6 bg-gradient-to-r from-amber-500 via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Explore Cinema Through Time
            </motion.h1>

            <motion.p className="text-slate-400 max-w-2xl mx-auto">
              Journey through the most iconic eras of filmmaking.
            </motion.p>
          </motion.div>

          {/* Era selector */}
          <EraSelector onSelectEra={handleEraSelect} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      <FeaturedSection />
      <Footer />
    </div>
  );
}
