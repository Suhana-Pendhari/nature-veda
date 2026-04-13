import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: var(--cream);
`;

const Header = styled.header`
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  color: white;
  padding: 20px 0;
  box-shadow: var(--shadow);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;

  svg {
    font-size: 2rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid rgba(85, 107, 47, 0.2);
  padding-bottom: 10px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: ${props => props.active ? 'var(--primary-green)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--dark-text)'};
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background: ${props => props.active ? 'var(--primary-green)' : 'rgba(27, 94, 32, 0.1)'};
  }
`;

const Table = styled.table`
  width: 100%;
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border-collapse: collapse;
`;

const Th = styled.th`
  background: var(--primary-green);
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid rgba(85, 107, 47, 0.1);
  color: var(--dark-text);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || 'var(--primary-green)'};
  cursor: pointer;
  padding: 5px;
  margin: 0 5px;
  transition: var(--transition);

  &:hover {
    transform: scale(1.2);
  }
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;
  transition: var(--transition);

  &:hover {
    background: var(--olive-green);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(27, 94, 32, 0.3);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: var(--white);
  padding: 30px;
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: var(--dark-text);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 2px solid rgba(85, 107, 47, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--white);
  color: var(--dark-text);

  &:focus {
    outline: none;
    border-color: var(--primary-green);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 15px;
  border: 2px solid rgba(85, 107, 47, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--white);
  color: var(--dark-text);
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-green);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled(motion.div)`
  background: var(--white);
  padding: 25px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  border: 1px solid rgba(85, 107, 47, 0.1);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-green);
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  color: var(--dark-text);
  font-size: 1rem;
  font-weight: 500;
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('remedies');
  const [remedies, setRemedies] = useState([]);
  const [plants, setPlants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [stats, setStats] = useState({
    users: 0,
    remedies: 0,
    plants: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const [usersRes, remediesRes, plantsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/stats/users.php'),
        axios.get('http://localhost:8000/api/stats/remedies.php'),
        axios.get('http://localhost:8000/api/stats/plants.php')
      ]);
      
      setStats({
        users: usersRes.data.count || 0,
        remedies: remediesRes.data.count || 0,
        plants: plantsRes.data.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
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
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint, method;
      
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
      await axios.post(endpoint, data, { withCredentials: true });
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving item');
    }
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:8000/api/auth/logout.php', {}, { withCredentials: true });
    localStorage.removeItem('user');
    navigate('/admin');
  };

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
        <StatsContainer>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatNumber>{stats.users}</StatNumber>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatNumber>{stats.remedies}</StatNumber>
            <StatLabel>Total Remedies</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatNumber>{stats.plants}</StatNumber>
            <StatLabel>Total Plants</StatLabel>
          </StatCard>
        </StatsContainer>

        <TabContainer>
          <Tab 
            active={activeTab === 'remedies'} 
            onClick={() => setActiveTab('remedies')}
          >
            Remedies
          </Tab>
          <Tab 
            active={activeTab === 'plants'} 
            onClick={() => setActiveTab('plants')}
          >
            Medicinal Plants
          </Tab>
        </TabContainer>

        <AddButton
          onClick={handleAdd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus />
          Add New {activeTab === 'remedies' ? 'Remedy' : 'Plant'}
        </AddButton>

        <Table>
          <thead>
            <tr>
              {activeTab === 'remedies' ? (
                <>
                  <Th>Problem</Th>
                  <Th>Ingredients</Th>
                  <Th>Category</Th>
                  <Th>Actions</Th>
                </>
              ) : (
                <>
                  <Th>Plant Name</Th>
                  <Th>Uses</Th>
                  <Th>Benefits</Th>
                  <Th>Actions</Th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'remedies' ? remedies : plants).map((item) => (
              <tr key={item.id}>
                <Td>{activeTab === 'remedies' ? item.problem : item.name}</Td>
                <Td>
                  {activeTab === 'remedies' 
                    ? item.ingredients.substring(0, 50) + '...'
                    : item.uses.substring(0, 50) + '...'
                  }
                </Td>
                <Td>
                  {activeTab === 'remedies' 
                    ? item.category || 'General'
                    : item.benefits.substring(0, 50) + '...'
                  }
                </Td>
                <Td>
                  <ActionButton onClick={() => handleEdit(item)} title="Edit">
                    <FaEdit />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleDelete(item.id)} 
                    color="#e74c3c"
                    title="Delete"
                  >
                    <FaTrash />
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
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
            <h2 style={{ marginBottom: '20px', color: 'var(--primary-green)' }}>
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'remedies' ? 'Remedy' : 'Plant'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {activeTab === 'remedies' ? (
                <>
                  <FormGroup>
                    <Label>Problem</Label>
                    <Input
                      value={formData.problem || ''}
                      onChange={(e) => setFormData({...formData, problem: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Ingredients</Label>
                    <TextArea
                      value={formData.ingredients || ''}
                      onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Steps</Label>
                    <TextArea
                      value={formData.steps || ''}
                      onChange={(e) => setFormData({...formData, steps: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Precautions</Label>
                    <TextArea
                      value={formData.precautions || ''}
                      onChange={(e) => setFormData({...formData, precautions: e.target.value})}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Category</Label>
                    <Input
                      value={formData.category || ''}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </FormGroup>
                </>
              ) : (
                <>
                  <FormGroup>
                    <Label>Plant Name</Label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Uses</Label>
                    <TextArea
                      value={formData.uses || ''}
                      onChange={(e) => setFormData({...formData, uses: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Benefits</Label>
                    <TextArea
                      value={formData.benefits || ''}
                      onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Image URL</Label>
                    <Input
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    />
                  </FormGroup>
                </>
              )}
              
              <ModalActions>
                <Button type="button" className="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="primary">
                  {editingItem ? 'Update' : 'Add'}
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
