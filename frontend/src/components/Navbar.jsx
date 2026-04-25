import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Nav = styled.nav`
  background: ${props => props.theme === 'dark' ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-green);
  text-decoration: none;
  transition: var(--transition);

  &:hover {
    transform: scale(1.05);
  }

  svg {
    font-size: 2rem;
    animation: leafSpin 3s linear infinite;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: ${props => props.theme === 'dark' ? 'rgba(45, 45, 45, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 30px;
    gap: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    z-index: 999;
    border-radius: 0 0 10px 10px;
  }
`;

const MenuLink = styled(Link)`
  color: var(--dark-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: 25px;
  transition: var(--transition);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--primary-green);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 80%;
  }

  &:hover {
    color: var(--primary-green);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--primary-green);
  cursor: pointer;
  transition: var(--transition);
  padding: 8px;
  border-radius: 4px;

  &:hover {
    background: rgba(85, 107, 47, 0.1);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const LoginMenuLink = styled(MenuLink)`
  background: var(--primary-green);
  color: white !important;
  padding: 10px 20px !important;
  border-radius: 25px;
  text-align: center;
  margin: 0;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
  display: inline-block;

  &:hover {
    background: var(--primary-green-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(85, 107, 47, 0.3);
    color: white !important;
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    display: none;
  }
`;

const LogoutMenuLink = styled.button`
  background: transparent;
  color: var(--dark-text);
  border: 2px solid var(--primary-green);
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
  text-align: center;

  &:hover {
    background: var(--primary-green);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(85, 107, 47, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UserGreeting = styled.div`
  color: var(--primary-green);
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 900px) {
    max-width: 160px;
  }

  @media (max-width: 768px) {
    max-width: unset;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const firstName = user?.name ? String(user.name).trim().split(/\s+/)[0] : '';

  return (
    <Nav theme={document.body.getAttribute('data-theme')} style={{
      padding: scrolled ? '0.5rem 0' : '1rem 0',
    }}>
      <NavContainer>
        <Logo to="/">
          <FaLeaf />
          NatureVeda
        </Logo>

        <MenuButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>

        <Menu $isOpen={isOpen} theme={document.body.getAttribute('data-theme')}>
          <MenuLink to="/" onClick={() => setIsOpen(false)}>Home</MenuLink>
          <MenuLink to="/remedies" onClick={() => setIsOpen(false)}>Remedies</MenuLink>
          <MenuLink to="/plants" onClick={() => setIsOpen(false)}>Plants</MenuLink>
          
          {user ? (
            <>
              <MenuLink to="/favorites" onClick={() => setIsOpen(false)}>Favorites</MenuLink>
              {user.is_admin && (
                <MenuLink to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  Admin Dashboard
                </MenuLink>
              )}
              <UserGreeting title={user.name || ''}>
                <FaUser />
                {firstName ? `Hi, ${firstName}` : 'Hi'}
              </UserGreeting>
              <LogoutMenuLink onClick={() => { handleLogout(); setIsOpen(false); }}>
                Logout
              </LogoutMenuLink>
            </>
          ) : (
            <LoginMenuLink to="/login" onClick={() => setIsOpen(false)}>
              Login
            </LoginMenuLink>
          )}
          
          <ThemeToggle />
        </Menu>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
