import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M10,50 Q25,25 40,50 T70,50 T100,50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/></svg>');
    background-size: 100px 100px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-family: 'Playfair Display', serif;
  margin-bottom: 20px;
  position: relative;
`;

const SearchBar = styled.div`
  max-width: 500px;
  margin: 0 auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 50px 15px 20px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-green);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
`;

const RemedyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
`;

const RemedyCard = styled(motion.div)`
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

const FavoriteButton = styled.button`
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: ${props => props.isFavorite ? '#e74c3c' : 'var(--light-brown)'};
  transition: var(--transition);

  &:hover {
    transform: scale(1.2);
  }
`;

const SectionTitle = styled.h4`
  color: var(--primary-green);
  margin: 15px 0 10px 0;
  font-size: 1.1rem;
`;

const Text = styled.p`
  color: var(--light-text);
  line-height: 1.6;
  margin-bottom: 10px;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 5px 12px;
  background: rgba(27, 94, 32, 0.1);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--primary-green);
  margin-top: 15px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--light-text);
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #e74c3c;
  font-size: 1.2rem;
`;

const Remedies = () => {
  const [remedies, setRemedies] = useState([]);
  const [filteredRemedies, setFilteredRemedies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRemedies();
    if (user) {
      fetchFavorites();
    }
    
    // Check for search param in URL
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [user]);

  useEffect(() => {
    filterRemedies();
  }, [searchTerm, remedies]);

  const fetchRemedies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/api/remedies/get_remedies.php');
      
      // Ensure the response data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setRemedies(data);
      setFilteredRemedies(data);
    } catch (error) {
      console.error('Error fetching remedies:', error);
      setError('Failed to load remedies. Please make sure the backend server is running.');
      setRemedies([]);
      setFilteredRemedies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/favorites/get_favorites.php', {
        withCredentials: true
      });
      
      // Ensure favorites data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setFavorites(data.map(f => f.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    }
  };

  const filterRemedies = () => {
    // Ensure remedies is an array
    if (!Array.isArray(remedies)) {
      setFilteredRemedies([]);
      return;
    }
    
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredRemedies(remedies);
      return;
    }
    
    const filtered = remedies.filter(remedy =>
      (remedy.problem && remedy.problem.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (remedy.ingredients && remedy.ingredients.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (remedy.category && remedy.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRemedies(filtered);
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
      alert('Failed to update favorite. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <PageWrapper>
        <Navbar />
        <Header>
          <div className="container">
            <Title>Herbal Remedies</Title>
            <p style={{ marginBottom: '30px', opacity: 0.9 }}>
              Discover natural solutions for your health concerns
            </p>
          </div>
        </Header>
        <Content>
          <ErrorMessage>
            <FaLeaf style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }} />
            <p>{error}</p>
            <button 
              onClick={fetchRemedies}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: 'var(--primary-green)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </ErrorMessage>
        </Content>
        <Footer />
      </PageWrapper>
    );
  }

  // Ensure filteredRemedies is an array before mapping
  const remediesToDisplay = Array.isArray(filteredRemedies) ? filteredRemedies : [];

  return (
    <PageWrapper>
      <Navbar />
      
      <Header>
        <div className="container">
          <Title>Herbal Remedies</Title>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            Discover natural solutions for your health concerns
          </p>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search remedies (e.g., cough, skin, digestion)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
          </SearchBar>
        </div>
      </Header>

      <Content>
        {remediesToDisplay.length === 0 ? (
          <NoResults>
            <FaLeaf style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }} />
            <p>No remedies found {searchTerm && `matching "${searchTerm}"`}</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: 'var(--primary-green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            )}
          </NoResults>
        ) : (
          <RemedyGrid>
            {remediesToDisplay.map((remedy, index) => (
              <RemedyCard
                key={remedy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <CardHeader>
                  <ProblemTitle>
                    <FaLeaf />
                    {remedy.problem || 'Unknown'}
                  </ProblemTitle>
                  <FavoriteButton
                    onClick={() => toggleFavorite(remedy.id)}
                    isFavorite={favorites.includes(remedy.id)}
                  >
                    {favorites.includes(remedy.id) ? <FaHeart /> : <FaRegHeart />}
                  </FavoriteButton>
                </CardHeader>
                
                <SectionTitle>Ingredients:</SectionTitle>
                <Text>{remedy.ingredients || 'No ingredients listed'}</Text>
                
                <SectionTitle>How to Use:</SectionTitle>
                <Text>{remedy.steps || 'No steps provided'}</Text>
                
                {remedy.precautions && (
                  <>
                    <SectionTitle>Precautions:</SectionTitle>
                    <Text style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                      {remedy.precautions}
                    </Text>
                  </>
                )}
                
                {remedy.category && (
                  <CategoryBadge>{remedy.category}</CategoryBadge>
                )}
              </RemedyCard>
            ))}
          </RemedyGrid>
        )}
      </Content>

      <Footer />
    </PageWrapper>
  );
};

export default Remedies;