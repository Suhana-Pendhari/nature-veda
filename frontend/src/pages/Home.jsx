import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import RemediesPreview from '../components/RemediesPreview';
import PlantsPreview from '../components/PlantsPreview';
import BeautyCare from '../components/BeautyCare';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <Hero />
      <Categories />
      <RemediesPreview />
      <PlantsPreview />
      <BeautyCare />
      <Footer />
    </motion.div>
  );
};

export default Home;
