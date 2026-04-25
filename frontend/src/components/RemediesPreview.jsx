import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../context/AuthContext';

const Section = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, var(--beige) 0%, var(--cream) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M10,50 Q25,25 40,50 T70,50 T100,50" fill="none" stroke="%231B5E20" stroke-width="0.5" opacity="0.1"/></svg>');
    background-size: 100px 100px;
    pointer-events: none;
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

const RemedyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px;
  position: relative;

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

const RemedyCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid rgba(85, 107, 47, 0.15);
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
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::before {
    transform: translateX(0);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(27, 94, 32, 0.15);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 18px;
  background: linear-gradient(135deg, rgba(27, 94, 32, 0.08), rgba(120, 144, 156, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  svg {
    font-size: 3rem;
    color: var(--primary-green);
    opacity: 0.4;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ProblemTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-green);
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: var(--olive-green);
  }
`;

const FavoriteButton = styled(motion.button)`
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: ${props => props.$isFavorite ? '#e74c3c' : 'var(--light-brown)'};
  transition: var(--transition);

  &:hover {
    transform: scale(1.2);
    color: #e74c3c;
  }
`;

const SectionLabel = styled.h4`
  color: var(--primary-green);
  font-size: 1.1rem;
  margin: 15px 0 8px 0;
  font-weight: 600;
`;

const Text = styled.p`
  color: var(--light-text);
  line-height: 1.6;
  margin-bottom: 15px;
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

const RemediesPreview = () => {
  const [remedies, setRemedies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchRemedies();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchRemedies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/remedies/get_remedies.php');
      setRemedies(response.data.slice(0, 3)); // Show only 3 remedies
      setLoading(false);
    } catch (error) {
      console.error('Error fetching remedies:', error);
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/favorites/get_favorites.php', {
        withCredentials: true
      });
      setFavorites(response.data.map(f => f.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (remedyId) => {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }

    try {
      if (favorites.includes(remedyId)) {
        await axios.post('http://localhost:8000/api/favorites/remove_favorite.php',
          { remedy_id: remedyId },
          { withCredentials: true }
        );
        setFavorites(favorites.filter(id => id !== remedyId));
      } else {
        await axios.post('http://localhost:8000/api/favorites/add_favorite.php',
          { remedy_id: remedyId },
          { withCredentials: true }
        );
        setFavorites([...favorites, remedyId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

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
            <SectionTitle>Loading Remedies...</SectionTitle>
          </SectionHeader>
        </div>
      </Section>
    );
  }

  return (
    <Section ref={ref}>
      <div className="container">
        <SectionHeader>
          <SectionTitle>Popular Herbal Remedies</SectionTitle>
          <SectionSubtitle>
            Time-tested natural solutions for everyday health concerns
          </SectionSubtitle>
        </SectionHeader>

        <RemedyGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {remedies.map((remedy) => (
            <RemedyCard key={remedy.id} variants={itemVariants}>
              <CardImage>
                {remedy.image_url ? (
                  <img src={remedy.image_url} alt={remedy.problem} />
                ) : (
                  <FaLeaf />
                )}
              </CardImage>
              <CardHeader>
                <ProblemTitle>
                  <FaLeaf />
                  {remedy.problem}
                </ProblemTitle>
                <FavoriteButton
                  onClick={() => toggleFavorite(remedy.id)}
                  $isFavorite={favorites.includes(remedy.id)}
                >
                  {favorites.includes(remedy.id) ? <FaHeart /> : <FaRegHeart />}
                </FavoriteButton>
              </CardHeader>

              <SectionLabel>Ingredients:</SectionLabel>
              <Text>{remedy.ingredients}</Text>

              <SectionLabel>How to Use:</SectionLabel>
              <Text>{remedy.steps}</Text>

              {remedy.precautions && (
                <>
                  <SectionLabel>Precautions:</SectionLabel>
                  <Text style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                    {remedy.precautions}
                  </Text>
                </>
              )}
            </RemedyCard>
          ))}
        </RemedyGrid>

        <div style={{ textAlign: 'center' }}>
          <ViewMoreButton to="/remedies">
            View All Remedies
            <FaArrowRight />
          </ViewMoreButton>
        </div>
      </div>
    </Section>
  );
};

export default RemediesPreview;
