import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,80 Q40,60 50,80 T80,80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/></svg>');
    background-size: 150px 150px;
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

const PlantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
`;

const PlantCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid rgba(85, 107, 47, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(27, 94, 32, 0.15);
  }
`;

const PlantImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  svg {
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.3);
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
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: var(--olive-green);
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

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    filterPlants();
  }, [searchTerm, plants]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/api/plants/get_plants.php');
      
      // Ensure the response data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setPlants(data);
      setFilteredPlants(data);
    } catch (error) {
      console.error('Error fetching plants:', error);
      setError('Failed to load plants. Please make sure the backend server is running.');
      setPlants([]);
      setFilteredPlants([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPlants = () => {
    // Ensure plants is an array
    if (!Array.isArray(plants)) {
      setFilteredPlants([]);
      return;
    }
    
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredPlants(plants);
      return;
    }
    
    const filtered = plants.filter(plant =>
      (plant.name && plant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (plant.uses && plant.uses.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (plant.benefits && plant.benefits.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPlants(filtered);
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
            <Title>Medicinal Plants</Title>
            <p style={{ marginBottom: '30px', opacity: 0.9 }}>
              Explore the healing power of nature
            </p>
          </div>
        </Header>
        <Content>
          <ErrorMessage>
            <FaLeaf style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }} />
            <p>{error}</p>
            <button 
              onClick={fetchPlants}
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

  // Ensure filteredPlants is an array before mapping
  const plantsToDisplay = Array.isArray(filteredPlants) ? filteredPlants : [];

  return (
    <PageWrapper>
      <Navbar />
      
      <Header>
        <div className="container">
          <Title>Medicinal Plants</Title>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            Explore the healing power of nature
          </p>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search plants by name or benefits..."
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
        {plantsToDisplay.length === 0 ? (
          <NoResults>
            <FaLeaf style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }} />
            <p>No plants found {searchTerm && `matching "${searchTerm}"`}</p>
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
          <PlantGrid>
            {plantsToDisplay.map((plant, index) => (
              <PlantCard
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
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
                    {plant.name || 'Unknown Plant'}
                  </PlantName>
                  
                  <SectionTitle>Traditional Uses:</SectionTitle>
                  <Text>{plant.uses || 'No uses listed'}</Text>
                  
                  <SectionTitle>Health Benefits:</SectionTitle>
                  <Text>{plant.benefits || 'No benefits listed'}</Text>
                </PlantContent>
              </PlantCard>
            ))}
          </PlantGrid>
        )}
      </Content>

      <Footer />
    </PageWrapper>
  );
};

export default Plants;
