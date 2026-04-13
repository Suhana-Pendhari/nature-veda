import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaHeart, FaHandHoldingHeart, FaStethoscope } from 'react-icons/fa';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const Section = styled.section`
  padding: 80px 0;
  background: var(--cream);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--primary-green), transparent);
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const CategoryCard = styled(motion.div)`
  background: var(--white);
  padding: 40px 30px;
  border-radius: var(--border-radius);
  text-align: center;
  cursor: pointer;
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
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, var(--primary-green), var(--olive-green));
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover::before {
    transform: translateX(0);
  }

  svg {
    font-size: 3.5rem;
    color: var(--primary-green);
    margin-bottom: 20px;
    transition: var(--transition);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--dark-text);
  }

  p {
    color: var(--light-text);
  }

  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 20px 40px rgba(27, 94, 32, 0.15);

    svg {
      transform: scale(1.2);
      color: var(--olive-green);
    }
  }
`;

const categories = [
  {
    id: 1,
    icon: FaStethoscope,
    title: 'Cough & Cold',
    description: 'Natural remedies for respiratory health',
    color: '#1B5E20'
  },
  {
    id: 2,
    icon: FaHeart,
    title: 'Skin Care',
    description: 'Herbal solutions for glowing skin',
    color: '#556B2F'
  },
  {
    id: 3,
    icon: FaLeaf,
    title: 'Hair Care',
    description: 'Traditional treatments for healthy hair',
    color: '#A1887F'
  },
  {
    id: 4,
    icon: FaHandHoldingHeart,
    title: 'Digestion',
    description: 'Ayurvedic remedies for gut health',
    color: '#1B5E20'
  }
];

const Categories = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <Section ref={ref}>
      <div className="container">
        <SectionTitle>Explore Categories</SectionTitle>
        <CategoryGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon />
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </div>
    </Section>
  );
};

export default Categories;
