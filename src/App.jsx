import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import { ThemeProvider } from './context/ThemeContext';

// Below-the-fold dynamic imports for bundle optimization and instant LCP
const VSLSection = lazy(() => import('./components/VSLSection'));
const PhotoGallery3D = lazy(() => import('./components/PhotoGallery3D'));
const SolutionsSection = lazy(() => import('./components/SolutionsSection'));
const RealCasesSection = lazy(() => import('./components/RealCasesSection'));
const ProcessTimeline = lazy(() => import('./components/ProcessTimeline'));
const FinancingSection = lazy(() => import('./components/FinancingSection'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const FinalCTA = lazy(() => import('./components/FinalCTA'));
const Footer = lazy(() => import('./components/Footer'));
const FloatingWhatsApp = lazy(() => import('./components/FloatingWhatsApp'));

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white transition-colors duration-300">
        {/* Top Header Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow">
          {/* Critical Top-of-Page Sections (Loaded Synchronously for zero LCP delay) */}
          <Hero />
          <TrustBar />

          {/* Below-the-fold Sections (Loaded Asynchronously via Suspense) */}
          <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center bg-slate-50 text-slate-400 text-sm" />}>
            {/* VSL Section: Official Presentation Video */}
            <VSLSection />

            {/* 3D Interactive Installation Gallery */}
            <PhotoGallery3D />

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
          </Suspense>
        </main>

        {/* Footer & Floating WhatsApp */}
        <Suspense fallback={null}>
          <Footer />
          <FloatingWhatsApp />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}
