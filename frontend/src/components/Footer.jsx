import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterWrapper = styled.footer`
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--olive-green) 100%);
  color: white;
  padding: 60px 0 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,80 Q40,60 50,80 T80,80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/></svg>');
    background-size: 200px 200px;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
  position: relative;
`;

const FooterSection = styled.div`
  h3 {
    color: white;
    margin-bottom: 20px;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      font-size: 1.5rem;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.8;
    margin-bottom: 10px;
  }
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
  transition: var(--transition);

  &:hover {
    color: white;
    transform: translateX(5px);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);

  svg {
    font-size: 1.2rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialIcon = styled(motion.a)`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  transition: var(--transition);
  text-decoration: none;

  &:hover {
    background: white;
    color: var(--primary-green);
    transform: translateY(-3px);
  }
`;

const Disclaimer = styled.div`
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  position: relative;
`;

const Copyright = styled.p`
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <h3>
              <FaLeaf />
              About NatureVeda
            </h3>
            <p>
              Discover the ancient wisdom of Ayurveda combined with modern understanding. 
              We provide natural, herbal solutions for everyday health and wellness.
            </p>
            <p>
              Our remedies are based on traditional knowledge passed down through generations.
            </p>
          </FooterSection>

          <FooterSection>
            <h3>Quick Links</h3>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/remedies">Remedies</FooterLink>
            <FooterLink to="/plants">Medicinal Plants</FooterLink>
            <FooterLink to="/beauty-care">Beauty Care</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
          </FooterSection>

          <FooterSection>
            <h3>Contact Us</h3>
            <ContactItem>
              <FaEnvelope />
              <span>hello@natureveda.com</span>
            </ContactItem>
            <ContactItem>
              <FaPhone />
              <span>+91 12345 67890</span>
            </ContactItem>
            <ContactItem>
              <FaMapMarkerAlt />
              <span>Kerala, India</span>
            </ContactItem>
            <SocialLinks>
              <SocialIcon 
                href="#" 
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook />
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram />
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter />
              </SocialIcon>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Newsletter</h3>
            <p>Subscribe to receive updates about new remedies and health tips.</p>
            <div style={{ marginTop: '20px' }}>
              <input 
                type="email" 
                placeholder="Your email"
                style={{
                  padding: '10px 15px',
                  borderRadius: '25px',
                  border: 'none',
                  width: '100%',
                  marginBottom: '10px'
                }}
              />
              <button 
                style={{
                  padding: '10px 25px',
                  borderRadius: '25px',
                  border: 'none',
                  background: 'white',
                  color: 'var(--primary-green)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Subscribe
              </button>
            </div>
          </FooterSection>
        </FooterContent>

        <Disclaimer>
          <p>
            ⚕️ <strong>Disclaimer:</strong> The information provided on NatureVeda is for educational purposes only. 
            For serious health issues, please consult a medical professional. 
            These remedies are based on traditional knowledge and should not replace professional medical advice.
          </p>
          <Copyright>
            © {new Date().getFullYear()} NatureVeda. All rights reserved. 
            Made with ❤️ for natural wellness.
          </Copyright>
        </Disclaimer>
      </div>
    </FooterWrapper>
  );
};

export default Footer;
