import React from 'react';
import { Helmet } from 'react-helmet-async';
import FloatingLetters from '@/components/FloatingLetters';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Free Edit Hub - Edit Text, Images, Video, Audio & Documents Free</title>
        <meta
          name="description"
          content="Free Edit Hub is your all-in-one free editing suite. Edit text, images, videos, audio, and documents with powerful tools. No watermarks, no subscriptions, unlimited access."
        />
        <meta name="keywords" content="free editor, image editor, video editor, text editor, audio editor, document editor, online editor, no watermark" />
        <link rel="canonical" href="https://freeedithub.com" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <FloatingLetters />
        <Navbar />
        
        <main>
          <HeroSection />
          <FeaturesSection />
          <CTASection />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
