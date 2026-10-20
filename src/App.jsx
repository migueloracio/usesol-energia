import React, { Suspense, lazy, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import ProposalView from './components/ProposalView';
import ProposalDashboard from './components/ProposalDashboard';
import ProposalLogin from './components/ProposalLogin';
import { supabase } from './lib/supabase';
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
  const [user, setUser] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const determineViewFromHash = () => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash;
    if (hash.startsWith('#proposta')) return 'proposal';
    if (hash === '#painel' || hash === '#login') return 'dashboard';
    return 'home';
  };

  const [currentView, setCurrentView] = useState(determineViewFromHash);

  // Monitorar autenticação Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Monitorar mudanças de URL/Hash
  useEffect(() => {
    const handleHash = () => {
      const view = determineViewFromHash();
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.hash = '';
    setCurrentView('home');
  };

  // 1. Rota de Proposta (/ #proposta ou #proposta?id=...)
  if (currentView === 'proposal') {
    return (
      <ThemeProvider>
        <ProposalView
          initialData={selectedProposal}
          isConsultant={Boolean(user)}
          onBack={() => {
            if (user) {
              window.location.hash = '#painel';
              setCurrentView('dashboard');
            } else {
              window.location.hash = '';
              setCurrentView('home');
            }
          }}
        />
      </ThemeProvider>
    );
  }

  // 2. Rota do Painel do Consultor / Login (/ #painel)
  if (currentView === 'dashboard') {
    if (!user) {
      return (
        <ThemeProvider>
          <ProposalLogin
            onLoginSuccess={(loggedUser) => {
              setUser(loggedUser);
            }}
            onBack={() => {
              window.location.hash = '';
              setCurrentView('home');
            }}
          />
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider>
        <ProposalDashboard
          user={user}
          onLogout={handleLogout}
          onViewProposal={(prop) => {
            setSelectedProposal(prop);
            window.location.hash = `#proposta?id=${prop.id}`;
            setCurrentView('proposal');
          }}
          onBackToSite={() => {
            window.location.hash = '';
            setCurrentView('home');
          }}
        />
      </ThemeProvider>
    );
  }

  // 3. Landing Page Principal
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white transition-colors duration-300">
        {/* Top Header Navigation */}
        <Navbar
          onOpenProposal={() => {
            window.location.hash = user ? '#painel' : '#proposta';
            setCurrentView(user ? 'dashboard' : 'proposal');
          }}
          user={user}
        />

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
