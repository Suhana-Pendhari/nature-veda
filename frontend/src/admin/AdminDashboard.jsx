import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaHome, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--beige) 0%, var(--cream) 100%);
`;

const Header = styled.header`
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  color: white;
  padding: 30px 0;
  box-shadow: 0 8px 32px rgba(27, 94, 32, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: bold;

  svg {
    font-size: 2.5rem;
    animation: leafSpin 3s linear infinite;
  }
  
  @keyframes leafSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: white;
    transform: scale(1.1);
  }
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const TabContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const Tab = styled.button`
  width: 100%;
  padding: 12px 28px;
  background: ${props => props.active ? 'var(--primary-green)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--primary-green)'};
  border: 2px solid var(--primary-green);
  border-radius: 25px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(27, 94, 32, 0.2);
  }
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const StatCard = styled.div`
  background: white;
  border: 2px solid rgba(27, 94, 32, 0.15);
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const StatLabel = styled.div`
  color: var(--light-text);
  font-size: 1rem;
`;

const StatValue = styled.div`
  color: var(--primary-green);
  font-size: 1.4rem;
  font-weight: 700;
`;

const Title = styled.h2`
  color: var(--primary-green);
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  margin: 0;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--olive-green);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(27, 94, 32, 0.3);
  }
`;

const SecondaryButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  background: transparent;
  color: var(--primary-green);
  border: 2px solid rgba(27, 94, 32, 0.35);
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-green);
    background: rgba(27, 94, 32, 0.06);
    transform: translateY(-2px);
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(27, 94, 32, 0.15);
    border-color: var(--primary-green);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, rgba(27, 94, 32, 0.1), rgba(120, 144, 156, 0.1));
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
    font-size: 3rem;
    color: var(--primary-green);
  }
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  color: var(--primary-green);
  margin: 0 0 12px 0;
  font-size: 1.2rem;
  font-weight: 600;
  word-break: break-word;
`;

const CardText = styled.p`
  color: var(--light-text);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 15px 0;
`;

const MetaTag = styled.span`
  background: rgba(27, 94, 32, 0.1);
  color: var(--primary-green);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid rgba(85, 107, 47, 0.1);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9rem;

  &.edit {
    background: rgba(27, 94, 32, 0.1);
    color: var(--primary-green);

    &:hover {
      background: var(--primary-green);
      color: white;
    }
  }

  &.delete {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;

    &:hover {
      background: #e74c3c;
      color: white;
    }
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 550px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const FormGroup = styled.div`
  margin-bottom: 22px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: var(--dark-text);
  font-weight: 600;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid rgba(85, 107, 47, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  color: var(--dark-text);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid rgba(85, 107, 47, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  color: var(--dark-text);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid rgba(85, 107, 47, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  color: var(--dark-text);
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &.primary {
    background: var(--primary-green);
    color: white;

    &:hover {
      background: var(--olive-green);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(27, 94, 32, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    border: 2px solid var(--primary-green);
    color: var(--primary-green);

    &:hover {
      background: var(--primary-green);
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--light-text);

  svg {
    font-size: 4rem;
    color: var(--primary-green);
    margin-bottom: 20px;
    opacity: 0.3;
  }

  p {
    font-size: 1.2rem;
  }
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('remedies');
  const [remedies, setRemedies] = useState([]);
  const [plants, setPlants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { logout } = useAuth();

  const remedyCategories = ['Cough & Cold', 'Digestion', 'Immunity', 'Skin Care', 'Stress Relief', 'General'];
  const plantCategories = ['Immunity Booster', 'Digestive', 'Skin Care', 'Hair Care', 'Respiratory', 'General'];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'remedies') {
        const response = await axios.get('http://localhost:8000/api/remedies/get_remedies.php');
        setRemedies(response.data);
      } else {
        const response = await axios.get('http://localhost:8000/api/plants/get_plants.php');
        setPlants(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ category: 'General' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const endpoint = activeTab === 'remedies'
          ? 'http://localhost:8000/api/remedies/delete_remedy.php'
          : 'http://localhost:8000/api/plants/delete_plant.php';
        
        await axios.post(endpoint, { id }, { withCredentials: true });
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting item');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint;
      const label = activeTab === 'remedies' ? 'Remedy' : 'Plant';
      
      if (activeTab === 'remedies') {
        endpoint = editingItem 
          ? 'http://localhost:8000/api/remedies/update_remedy.php'
          : 'http://localhost:8000/api/remedies/add_remedy.php';
      } else {
        endpoint = editingItem
          ? 'http://localhost:8000/api/plants/update_plant.php'
          : 'http://localhost:8000/api/plants/add_plant.php';
      }
      
      const data = editingItem ? { ...formData, id: editingItem.id } : formData;
      const res = await axios.post(endpoint, data, { withCredentials: true });
      
      setShowModal(false);
      fetchData();

      const msg = res?.data?.message;
      alert(msg || `${label} ${editingItem ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error saving:', error);
      const status = error?.response?.status;
      const detail = error?.response?.data?.error;
      const msg = error?.response?.data?.message || error?.message || 'Error saving item';
      const full = detail ? `${msg}: ${detail}` : msg;
      alert(status ? `${full} (HTTP ${status})` : full);
    }
  };

  const handleLogout = async () => {
    await logout(); // updates AuthContext + localStorage immediately
    navigate('/login');
  };

  const purgeSeedRemedies = async () => {
    if (!window.confirm('Remove duplicated default/seed remedies from the database?')) return;

    try {
      const res = await axios.post(
        'http://localhost:8000/api/remedies/purge_seed_remedies.php',
        {},
        { withCredentials: true }
      );
      const deleted = res?.data?.deleted ?? 0;
      alert(`Removed ${deleted} default/seed remedies.`);
      fetchData();
    } catch (error) {
      console.error('Error purging seed remedies:', error);
      alert(error?.response?.data?.message || 'Failed to purge seed remedies');
    }
  };

  const items = activeTab === 'remedies' ? remedies : plants;

  return (
    <DashboardWrapper>
      <Header>
        <HeaderContent>
          <Logo>
            <FaLeaf />
            NatureVeda Admin
          </Logo>
          <HeaderActions>
            <IconButton onClick={() => navigate('/')} title="View Site">
              <FaHome />
            </IconButton>
            <IconButton onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </IconButton>
          </HeaderActions>
        </HeaderContent>
      </Header>

      <MainContent>
        <TabContainer>
          <Tab 
            active={activeTab === 'remedies'} 
            onClick={() => setActiveTab('remedies')}
          >
            🌿 Herbal Remedies
          </Tab>
          <Tab 
            active={activeTab === 'plants'} 
            onClick={() => setActiveTab('plants')}
          >
            🌱 Medicinal Plants
          </Tab>
          <StatCard>
            <StatLabel>Total Remedies</StatLabel>
            <StatValue>{remedies.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Total Plants</StatLabel>
            <StatValue>{plants.length}</StatValue>
          </StatCard>
        </TabContainer>

        <ControlBar>
          <Title>
            {activeTab === 'remedies' ? 'Manage Remedies' : 'Manage Plants'}
          </Title>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {activeTab === 'remedies' && (
              <SecondaryButton
                type="button"
                onClick={purgeSeedRemedies}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                title="Delete duplicated default remedies"
              >
                Clean default remedies
              </SecondaryButton>
            )}
            <AddButton
              onClick={handleAdd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
              Add New
            </AddButton>
          </div>
        </ControlBar>

        {items.length === 0 ? (
          <EmptyState>
            <FaImage />
            <p>
              No {activeTab === 'remedies' ? 'remedies' : 'plants'} found.
              Click "Add New" to get started!
            </p>
          </EmptyState>
        ) : (
          <CardGrid>
            {items.map((item, index) => (
              <Card
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CardImage>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.problem || item.name} />
                  ) : (
                    <FaImage />
                  )}
                </CardImage>
                <CardContent>
                  <CardTitle>{activeTab === 'remedies' ? item.problem : item.name}</CardTitle>
                  
                  {activeTab === 'remedies' ? (
                    <>
                      <CardText><strong>Ingredients:</strong> {item.ingredients}</CardText>
                      <CardText><strong>Steps:</strong> {item.steps}</CardText>
                      {item.precautions && (
                        <CardText><strong>Precautions:</strong> {item.precautions}</CardText>
                      )}
                      {item.category && (
                        <CardMeta>
                          <MetaTag>{item.category}</MetaTag>
                        </CardMeta>
                      )}
                    </>
                  ) : (
                    <>
                      <CardText><strong>Uses:</strong> {item.uses}</CardText>
                      <CardText><strong>Benefits:</strong> {item.benefits}</CardText>
                      {item.category && (
                        <CardMeta>
                          <MetaTag>{item.category}</MetaTag>
                        </CardMeta>
                      )}
                    </>
                  )}

                  <CardActions>
                    <ActionButton className="edit" onClick={() => handleEdit(item)}>
                      <FaEdit /> Edit
                    </ActionButton>
                    <ActionButton className="delete" onClick={() => handleDelete(item.id)}>
                      <FaTrash /> Delete
                    </ActionButton>
                  </CardActions>
                </CardContent>
              </Card>
            ))}
          </CardGrid>
        )}
      </MainContent>

      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '25px', color: 'var(--primary-green)', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem' }}>
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'remedies' ? 'Remedy' : 'Plant'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {activeTab === 'remedies' ? (
                <>
                  <FormGroup>
                    <Label>Problem/Condition *</Label>
                    <Input
                      type="text"
                      value={formData.problem || ''}
                      onChange={(e) => setFormData({...formData, problem: e.target.value})}
                      placeholder="e.g., Cough & Cold"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Image URL</Label>
                    <Input
                      type="text"
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Ingredients *</Label>
                    <TextArea
                      value={formData.ingredients || ''}
                      onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                      placeholder="List all ingredients separated by commas"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Steps/Instructions *</Label>
                    <TextArea
                      value={formData.steps || ''}
                      onChange={(e) => setFormData({...formData, steps: e.target.value})}
                      placeholder="Describe the steps to prepare"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Precautions</Label>
                    <TextArea
                      value={formData.precautions || ''}
                      onChange={(e) => setFormData({...formData, precautions: e.target.value})}
                      placeholder="Any precautions or warnings"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Category</Label>
                    <Select
                      value={formData.category || 'General'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {remedyCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Select>
                  </FormGroup>
                </>
              ) : (
                <>
                  <FormGroup>
                    <Label>Plant Name *</Label>
                    <Input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Tulsi (Holy Basil)"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Image URL</Label>
                    <Input
                      type="text"
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Uses *</Label>
                    <TextArea
                      value={formData.uses || ''}
                      onChange={(e) => setFormData({...formData, uses: e.target.value})}
                      placeholder="Describe plant uses"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Benefits *</Label>
                    <TextArea
                      value={formData.benefits || ''}
                      onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                      placeholder="Describe plant benefits"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Category</Label>
                    <Select
                      value={formData.category || 'General'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {plantCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Select>
                  </FormGroup>
                </>
              )}

              <ModalActions>
                <Button className="secondary" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="primary" type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </DashboardWrapper>
  );
};

export default AdminDashboard;
