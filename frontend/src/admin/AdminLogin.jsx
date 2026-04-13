import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const LoginSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--beige) 0%, var(--cream) 100%);
`;

const LoginCard = styled(motion.div)`
  background: var(--white);
  padding: 40px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  max-width: 400px;
  width: 100%;
  border: 2px solid var(--primary-green);
`;

const LogoWrapper = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--primary-green);
  margin-bottom: 10px;

  svg {
    font-size: 2rem;
  }
`;

const AdminBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(27, 94, 32, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  color: var(--primary-green);
  font-size: 0.9rem;
  margin-top: 10px;

  svg {
    font-size: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--olive-green);
    font-size: 1.1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid rgba(85, 107, 47, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  background: var(--white);
  color: var(--dark-text);
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.1);
  }
`;

const Button = styled(motion.button)`
  padding: 15px;
  background: linear-gradient(135deg, var(--primary-green), var(--olive-green));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(27, 94, 32, 0.3);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: 20px;

  a {
    color: var(--light-brown);
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      color: var(--primary-green);
    }
  }
`;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login.php', 
        formData,
        { withCredentials: true }
      );
      
      if (response.data.user && response.data.user.is_admin) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admin privileges required.');
      }
    } catch (err) {
      setError('Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginSection>
      <LoginCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LogoWrapper>
          <Logo>
            <FaLeaf />
            NatureVeda
          </Logo>
          <AdminBadge>
            <FaShieldAlt />
            Admin Portal
          </AdminBadge>
        </LogoWrapper>
        
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <FaEnvelope />
            <Input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          
          <InputWrapper>
            <FaLock />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          
          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Admin Login'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        
        <BackLink>
          <a href="/">← Back to NatureVeda</a>
        </BackLink>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: 'rgba(27, 94, 32, 0.05)',
          borderRadius: '5px',
          fontSize: '0.85rem',
          color: 'var(--light-text)'
        }}>
          <strong>Demo Credentials:</strong><br/>
          Email: admin@natureveda.com<br/>
          Password: admin123
        </div>
      </LoginCard>
    </LoginSection>
  );
};

export default AdminLogin;
