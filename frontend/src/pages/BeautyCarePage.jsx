import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaStar, FaHeart, FaMagic, FaSeedling } from 'react-icons/fa';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--cream);
`;

const Header = styled.div`
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  padding: 120px 0 60px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.03) 10px,
      rgba(255, 255, 255, 0.03) 20px
    );
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-family: 'Playfair Display', serif;
  margin-bottom: 20px;
  position: relative;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
`;

const BeautyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
`;

const BeautyCard = styled(motion.div)`
  background: var(--white);
  padding: 30px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid rgba(85, 107, 47, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-green), var(--olive-green));
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(27, 94, 32, 0.15);
  }
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 2rem;
    color: white;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  color: var(--primary-green);
  margin-bottom: 15px;
`;

const CardDescription = styled.p`
  color: var(--light-text);
  line-height: 1.6;
  margin-bottom: 20px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  padding: 5px 12px;
  background: rgba(27, 94, 32, 0.1);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--primary-green);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: var(--primary-green);
  margin: 50px 0 30px;
  font-family: 'Playfair Display', serif;
  text-align: center;
`;

const beautyTips = [
  {
    icon: FaStar,
    title: 'Glowing Skin Face Pack',
    description: 'Mix 1 tsp turmeric powder with 2 tsp sandalwood powder and enough rose water to make a paste. Apply evenly on face and neck. Leave for 15-20 minutes and rinse with cool water. Use twice a week for radiant, glowing skin.',
    tags: ['Turmeric', 'Sandalwood', 'Rose Water']
  },
  {
    icon: FaHeart,
    title: 'Hair Growth Oil Massage',
    description: 'Warm 4 tbsp coconut oil with 1 tbsp amla powder and a handful of curry leaves. Let it infuse for 10 minutes. Massage into scalp in circular motions. Leave overnight and wash next morning. Do this twice weekly for stronger, thicker hair.',
    tags: ['Coconut', 'Amla', 'Curry Leaves']
  },
  {
    icon: FaMagic,
    title: 'Natural Skin Toner',
    description: 'Mix equal parts rose water and witch hazel. Add 2-3 drops of tea tree oil. Store in a spray bottle. Use after cleansing to tighten pores and refresh skin. Perfect for oily and combination skin types.',
    tags: ['Rose Water', 'Witch Hazel', 'Tea Tree']
  },
  {
    icon: FaLeaf,
    title: 'Anti-Aging Avocado Mask',
    description: 'Mash half a ripe avocado and mix with 1 tbsp honey and 2 tbsp plain yogurt. Apply to face and neck. Leave for 20 minutes and rinse with lukewarm water. Rich in antioxidants and moisturizing properties.',
    tags: ['Avocado', 'Honey', 'Yogurt']
  },
  {
    icon: FaSeedling,
    title: 'Aloe Vera Moisturizer',
    description: 'Extract fresh aloe vera gel from the leaf. Mix with 2-3 drops of vitamin E oil. Apply as a light moisturizer before bed. Helps heal acne, reduce inflammation, and keep skin hydrated.',
    tags: ['Aloe Vera', 'Vitamin E']
  },
  {
    icon: FaStar,
    title: 'Neem Acne Treatment',
    description: 'Make a paste of fresh neem leaves with a pinch of turmeric. Apply directly on acne spots. Leave for 15 minutes and wash off. Neem\'s antibacterial properties help clear acne and prevent future breakouts.',
    tags: ['Neem', 'Turmeric']
  }
];

const BeautyCarePage = () => {
  return (
    <PageWrapper>
      <Navbar />
      
      <Header>
        <div className="container">
          <Title>Natural Beauty Care</Title>
          <p style={{ marginBottom: '20px', opacity: 0.9, fontSize: '1.1rem' }}>
            Ancient Ayurvedic beauty secrets for modern radiance
          </p>
        </div>
      </Header>

      <Content>
        <SectionTitle>Face Packs & Masks</SectionTitle>
        <BeautyGrid>
          {beautyTips.slice(0, 4).map((tip, index) => (
            <BeautyCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <IconWrapper>
                <tip.icon />
              </IconWrapper>
              <CardTitle>{tip.title}</CardTitle>
              <CardDescription>{tip.description}</CardDescription>
              <TagList>
                {tip.tags.map((tag, i) => (
                  <Tag key={i}>{tag}</Tag>
                ))}
              </TagList>
            </BeautyCard>
          ))}
        </BeautyGrid>

        <SectionTitle>Natural Skin Care</SectionTitle>
        <BeautyGrid>
          {beautyTips.slice(4).map((tip, index) => (
            <BeautyCard
              key={index + 4}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <IconWrapper>
                <tip.icon />
              </IconWrapper>
              <CardTitle>{tip.title}</CardTitle>
              <CardDescription>{tip.description}</CardDescription>
              <TagList>
                {tip.tags.map((tag, i) => (
                  <Tag key={i}>{tag}</Tag>
                ))}
              </TagList>
            </BeautyCard>
          ))}
        </BeautyGrid>

        <div style={{
          background: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--border-radius)',
          marginTop: '50px',
          textAlign: 'center',
          boxShadow: 'var(--shadow)'
        }}>
          <FaLeaf style={{ fontSize: '3rem', color: 'var(--primary-green)', marginBottom: '20px' }} />
          <h3 style={{ color: 'var(--primary-green)', marginBottom: '15px' }}>
            Ancient Wisdom for Modern Beauty
          </h3>
          <p style={{ color: 'var(--light-text)', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
            These beauty remedies have been used for centuries in Ayurvedic traditions. 
            They are made from natural ingredients that are gentle on your skin and hair. 
            Remember to always do a patch test before trying any new remedy, and consult 
            a dermatologist if you have sensitive skin or allergies.
          </p>
        </div>
      </Content>

      <Footer />
    </PageWrapper>
  );
};

export default BeautyCarePage;
