import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import SolutionsSection from './components/SolutionsSection';
import RealCasesSection from './components/RealCasesSection';
import ProcessTimeline from './components/ProcessTimeline';
import FinancingSection from './components/FinancingSection';
import FAQSection from './components/FAQSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero Section with Interactive Lead-First Calculator */}
        <Hero />

        {/* 4 Pillars Trust Bar */}
        <TrustBar />

        {/* Solutions & Services: Residential, Commercial, Maintenance */}
        <SolutionsSection />

        {/* Real Cases & Before/After Tangible Metrics */}
        <RealCasesSection />

        {/* 6-Step Process & 60-90 Days Transparency Timeline */}
        <ProcessTimeline />

        {/* Financing Section with Santander & Banco BV Official Partnerships */}
        <FinancingSection />

        {/* Conversion FAQ Pre-sale Silent Seller */}
        <FAQSection />

        {/* Closing Final High-Converting CTA */}
        <FinalCTA />
      </main>

      {/* Footer with Physical Address, Phone, Email & Instagram */}
      <Footer />

      {/* Floating Smart WhatsApp for Instant Lead Qualification */}
      <FloatingWhatsApp />
    </div>
  );
}
