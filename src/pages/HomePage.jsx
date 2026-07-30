import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import WhySection from '../components/WhySection';
import LatestStories from '../components/LatestStories';
import FeaturedProjects from '../components/FeaturedProjects';
import ProfileSection from '../components/ProfileSection';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <div className="home-page fade-in">
      <HeroSection />
      <StatsSection />
      <WhySection />
      <LatestStories />
      <FeaturedProjects />
      <ProfileSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
