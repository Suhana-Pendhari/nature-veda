import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaLeaf } from 'react-icons/fa';
import styled from 'styled-components';
import heroBg from '../assets/hero-bg.png'; // Add a nature/herbal background image

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, rgba(27, 94, 32, 0.05), rgba(85, 107, 47, 0.1)),
              url(${heroBg}) center/cover no-repeat;
  padding: 100px 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, var(--cream) 100%);
    opacity: 0.35;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 5rem);
  font-family: 'Playfair Display', serif;
  color: var(--primary-green);
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: var(--light-text);
  margin-bottom: 40px;
  font-style: italic;
`;

const SearchContainer = styled(motion.div)`
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  background: var(--white);
  border-radius: 50px;
  box-shadow: var(--shadow);
  overflow: hidden;
  border: 2px solid rgba(27, 94, 32, 0.2);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 18px 25px;
  border: none;
  font-size: 1.1rem;
  background: transparent;
  color: var(--dark-text);

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--light-brown);
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  border: none;
  padding: 0 30px;
  color: white;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    padding: 0 40px;
    background: linear-gradient(135deg, var(--olive-green), var(--primary-green));
  }

  svg {
    font-size: 1.2rem;
  }
`;

const LeafDecoration = styled(motion.div)`
  position: absolute;
  opacity: 0.1;
  color: var(--primary-green);
  font-size: 100px;
  z-index: 0;

  &:nth-child(1) {
    top: 10%;
    left: 5%;
    transform: rotate(-30deg);
  }

  &:nth-child(2) {
    bottom: 10%;
    right: 5%;
    transform: rotate(45deg);
  }

  &:nth-child(3) {
    top: 20%;
    right: 15%;
    transform: rotate(15deg);
  }
`;

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to remedies with search term
    window.location.href = `/remedies?search=${searchTerm}`;
  };

  return (
    <HeroSection>
      <LeafDecoration
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      >
        <FaLeaf />
      </LeafDecoration>
      <LeafDecoration
        animate={{ rotate: [0, -360], scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity }}
      >
        <FaLeaf />
      </LeafDecoration>
      <LeafDecoration
        animate={{ rotate: [0, 180, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity }}
      >
        <FaLeaf />
      </LeafDecoration>

      <div className="container">
        <HeroContent>
          <Title
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            NatureVeda
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Herbal solutions for everyday health
          </Subtitle>
          <SearchContainer
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
              <SearchInput
                type="text"
                placeholder="Search for health concerns (e.g., cough, acne)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton type="submit">
                <FaSearch />
                <span>Search</span>
              </SearchButton>
            </form>
          </SearchContainer>
        </HeroContent>
      </div>
    </HeroSection>
  );
};

export default Hero;
