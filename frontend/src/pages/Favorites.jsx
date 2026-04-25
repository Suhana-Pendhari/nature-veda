import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaLeaf } from 'react-icons/fa';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

// Styled Components (mirroring Remedies.jsx)
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
`;

const Title = styled.h1`
  font-size: 3rem;
  font-family: 'Playfair Display', serif;
  margin-bottom: 15px;
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
`;

const Card = styled(motion.div)`
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid rgba(85, 107, 47, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(27, 94, 32, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
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

// Favorite heart icon (static, indicates it's already a favorite)
const FavoriteBadge = styled.div`
  color: #e74c3c;
  font-size: 1.3rem;
`;

// Image container – same as Remedies page
const CardImage = styled.div`
  width: 100%;
  height: 180px;
  background: rgba(85, 107, 47, 0.1);
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 4rem;
    color: var(--olive-green);
    opacity: 0.6;
  }
`;

const SectionLabel = styled.h4`
  color: var(--primary-green);
  margin: 15px 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const Text = styled.p`
  color: var(--light-text);
  line-height: 1.6;
  margin-bottom: 10px;
`;

const Empty = styled.div`
  text-align: center;
  padding: 70px 20px;
  color: var(--light-text);

  svg {
    font-size: 3rem;
    opacity: 0.35;
    color: var(--primary-green);
    margin-bottom: 18px;
  }
`;

// Animation variant (same as Remedies)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Favorites = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');

        if (!user) {
          setFavorites([]);
          return;
        }

        const res = await axios.get('http://localhost:8000/api/favorites/get_favorites.php', {
          withCredentials: true
        });

        const data = Array.isArray(res.data) ? res.data : [];
        setFavorites(data);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load favorites.');
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <PageWrapper>
      <Navbar />

      <Header>
        <div className="container">
          <Title>
            <FaHeart style={{ marginRight: 10 }} />
            Favorite Remedies
          </Title>
          <Subtitle>Your saved herbal remedies in one place</Subtitle>
        </div>
      </Header>

      <Content>
        {error ? (
          <Empty>
            <FaLeaf />
            <p>{error}</p>
          </Empty>
        ) : favorites.length === 0 ? (
          <Empty>
            <FaLeaf />
            <p>No favorites yet. Open any remedy and tap the heart to save it.</p>
          </Empty>
        ) : (
          <Grid>
            {favorites.map((remedy, idx) => (
              <Card
                key={remedy.id || idx}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={idx}
              >
                {/* Image section – same as Remedies page */}
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
                    {remedy.problem || 'Unknown Remedy'}
                  </ProblemTitle>
                  <FavoriteBadge>
                    <FaHeart />
                  </FavoriteBadge>
                </CardHeader>

                <SectionLabel>Ingredients:</SectionLabel>
                <Text>{remedy.ingredients || '—'}</Text>

                <SectionLabel>How to Use:</SectionLabel>
                <Text>{remedy.steps || '—'}</Text>

                {remedy.precautions && (
                  <>
                    <SectionLabel>Precautions:</SectionLabel>
                    <Text style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                      {remedy.precautions}
                    </Text>
                  </>
                )}
              </Card>
            ))}
          </Grid>
        )}
      </Content>

      <Footer />
    </PageWrapper>
  );
};

export default Favorites;