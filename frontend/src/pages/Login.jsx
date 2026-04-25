import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const LoginSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  background: linear-gradient(135deg, var(--beige) 0%, var(--cream) 100%);
`;

const LoginCard = styled(motion.div)`
  background: var(--white);
  padding: 40px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  max-width: 450px;
  width: 100%;
  border: 1px solid rgba(85, 107, 47, 0.2);
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
    animation: leafSpin 3s linear infinite;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: var(--primary-green);
  margin-bottom: 30px;
  font-size: 1.8rem;
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

const ToggleText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: var(--light-text);
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: var(--primary-green);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 5px;

  &:hover {
    color: var(--olive-green);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

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
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          // Check if user is admin and redirect accordingly
          const user = result.data.user;
          if (user && user.is_admin) {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } else {
          setError(result.error);
        }
      } else {
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
          setIsLogin(true);
          setError('Registration successful! Please login.');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
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
          </LogoWrapper>
          <Title>{isLogin ? 'Welcome Back' : 'Create Account'}</Title>
          
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <InputWrapper>
                <FaUser />
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </InputWrapper>
            )}
            
            <InputWrapper>
              <FaEnvelope />
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
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
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </Button>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </Form>
          
          <ToggleText>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <ToggleLink onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register' : 'Login'}
            </ToggleLink>
          </ToggleText>
        </LoginCard>
      </LoginSection>
      <Footer />
    </>
  );
};

export default Login;
