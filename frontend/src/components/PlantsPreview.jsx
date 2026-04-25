import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';

const Section = styled.section`
  padding: 80px 0;
  background: var(--cream);
  position: relative;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
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

const PlantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PlantCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid rgba(85, 107, 47, 0.1);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(27, 94, 32, 0.2);
  }
`;

const PlantImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--olive-green) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  svg {
    font-size: 5rem;
    color: rgba(255, 255, 255, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%);
  }
`;

const PlantImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const PlantContent = styled.div`
  padding: 25px;
`;

const PlantName = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-green);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: var(--olive-green);
    font-size: 1.2rem;
  }
`;

const SectionLabel = styled.h4`
  color: var(--primary-green);
  font-size: 1rem;
  margin: 10px 0 5px 0;
  font-weight: 600;
`;

const Text = styled.p`
  color: var(--light-text);
  line-height: 1.6;
  font-size: 0.95rem;
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

  svg {
    transition: var(--transition);
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

const PlantsPreview = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/plants/get_plants.php');
      setPlants(response.data.slice(0, 4)); // Show only 3 plants
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plants:', error);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  if (loading) {
    return (
      <Section>
        <div className="container">
          <SectionHeader>
            <SectionTitle>Loading Plants...</SectionTitle>
          </SectionHeader>
        </div>
      </Section>
    );
  }

  return (
    <Section ref={ref}>
      <div className="container">
        <SectionHeader>
          <SectionTitle>Medicinal Plants</SectionTitle>
          <SectionSubtitle>
            Discover the healing power of nature's pharmacy
          </SectionSubtitle>
        </SectionHeader>

        <PlantGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {plants.map((plant) => (
            <PlantCard key={plant.id} variants={itemVariants}>
              <PlantImageWrapper>
                {plant.image_url ? (
                  <PlantImage src={plant.image_url} alt={plant.name} />
                ) : (
                  <FaLeaf />
                )}
              </PlantImageWrapper>
              <PlantContent>
                <PlantName>
                  <FaLeaf />
                  {plant.name}
                </PlantName>
                <SectionLabel>Uses:</SectionLabel>
                <Text>{plant.uses}</Text>
                <SectionLabel>Benefits:</SectionLabel>
                <Text>{plant.benefits}</Text>
              </PlantContent>
            </PlantCard>
          ))}
        </PlantGrid>

        <div style={{ textAlign: 'center' }}>
          <ViewMoreButton to="/plants">
            Explore All Plants
            <FaArrowRight />
          </ViewMoreButton>
        </div>
      </div>
    </Section>
  );
};

export default PlantsPreview;
