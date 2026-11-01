/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsAndCertificatesSection } from './components/sections/SkillsAndCertificatesSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { PremierIntroScreen } from './components/intro/PremierIntroScreen';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      const isAutostart = window.location.search.includes('autostart=1');
      if (isAutostart) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Premier Cyber Entrance Animation Screen */}
      {showIntro && (
        <PremierIntroScreen onComplete={() => setShowIntro(false)} />
      )}

      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero with interactive 3D Lanyard ID card */}
        <HeroSection />

        {/* About Me */}
        <AboutSection />

        {/* Projects Showcase */}
        <ProjectsSection />

        {/* Tech Stack & Certificates Tabs */}
        <SkillsAndCertificatesSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onReplayIntro={() => setShowIntro(true)} />
    </div>
  );
}
