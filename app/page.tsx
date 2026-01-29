// pages/index.tsx
import Hero from '@/components/Hero';
import Navbar from '@/components/Header';
import FeaturedCollections from '@/components/FeaturedCollections';
import LuxuryFooter from '@/components/LuxuryFooter';
import AboutSection from '@/components/About';
import ContactForm from '@/components/ContactForm';
import ClientReviews from '@/components/ClientReviews';
import SafetyGuidesSection from '@/components/SafetyGuideSection';
import IndustriesServed from '@/components/IndustriesServed';
import CertificationsSection from '@/components/CertificationsSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
     
      <main>
        <Navbar />
        <Hero />
        <AboutSection />
        <FeaturedCollections />
        <CertificationsSection />
        <IndustriesServed />
        <SafetyGuidesSection />
        <ClientReviews />
        <ContactForm />
        <LuxuryFooter />
      
      </main>
    
    </div>
  );
}