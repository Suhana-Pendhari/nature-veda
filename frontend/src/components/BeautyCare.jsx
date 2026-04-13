import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaStar, FaHeart, FaMagic } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const Section = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, var(--beige) 0%, var(--cream) 100%);
  position: relative;

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
      rgba(27, 94, 32, 0.02) 10px,
      rgba(27, 94, 32, 0.02) 20px
    );
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--primary-green);
  margin-bottom: 15px;
  font-family: 'Playfair Display', serif;
`;

const SectionSubtitle = styled.p`
  color: var(--light-text);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const BeautyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  position: relative;
`;

const BeautyCard = styled(motion.div)`
  background: var(--white);
  padding: 30px 25px;
  border-radius: var(--border-radius);
  text-align: center;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid rgba(85, 107, 47, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(27, 94, 32, 0.05) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(27, 94, 32, 0.15);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
    border-radius: 50%;
    opacity: 0.3;
    z-index: -1;
  }

  svg {
    font-size: 2.5rem;
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
  justify-content: center;
  margin-top: 15px;
`;

const Tag = styled.span`
  padding: 5px 12px;
  background: rgba(27, 94, 32, 0.1);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--primary-green);
  border: 1px solid rgba(27, 94, 32, 0.2);
`;

const ViewMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  padding: 12px 30px;
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 20px rgba(27, 94, 32, 0.3);
  }
`;

const beautyTips = [
  {
    id: 1,
    icon: FaStar,
    title: 'Glowing Skin Face Pack',
    description: 'Mix turmeric, sandalwood powder, and rose water. Apply for 15 minutes for radiant skin.',
    tags: ['Turmeric', 'Sandalwood', 'Rose Water']
  },
  {
    id: 2,
    icon: FaHeart,
    title: 'Hair Growth Oil',
    description: 'Warm coconut oil with amla and curry leaves. Massage scalp twice weekly.',
    tags: ['Coconut', 'Amla', 'Curry Leaves']
  },
  {
    id: 3,
    icon: FaMagic,
    title: 'Natural Toner',
    description: 'Mix rose water with witch hazel. Apply with cotton ball after cleansing.',
    tags: ['Rose Water', 'Witch Hazel']
  },
  {
    id: 4,
    icon: FaLeaf,
    title: 'Anti-Aging Mask',
    description: 'Blend avocado with honey and yogurt. Leave on for 20 minutes.',
    tags: ['Avocado', 'Honey', 'Yogurt']
  }
];

const BeautyCare = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Section ref={ref}>
      <div className="container">
        <SectionHeader>
          <SectionTitle>Natural Beauty Care</SectionTitle>
          <SectionSubtitle>
            Ancient beauty secrets for modern radiance
          </SectionSubtitle>
        </SectionHeader>

        <BeautyGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {beautyTips.map((tip) => (
            <BeautyCard key={tip.id} variants={itemVariants}>
              <IconWrapper>
                <tip.icon />
              </IconWrapper>
              <CardTitle>{tip.title}</CardTitle>
              <CardDescription>{tip.description}</CardDescription>
              <TagList>
                {tip.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagList>
            </BeautyCard>
          ))}
        </BeautyGrid>

        <div style={{ textAlign: 'center' }}>
          <ViewMoreButton to="/beauty-care">
            Discover More Beauty Tips
            <FaLeaf />
          </ViewMoreButton>
        </div>
      </div>
    </Section>
  );
};

export default BeautyCare;
