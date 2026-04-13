import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';
import styled from 'styled-components';

const SpinnerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  z-index: 9999;
`;

const SpinnerContainer = styled(motion.div)`
  text-align: center;
`;

const LeafIcon = styled(motion.div)`
  font-size: 4rem;
  color: var(--primary-green);
  margin-bottom: 20px;
`;

const LoadingText = styled(motion.p)`
  color: var(--primary-green);
  font-size: 1.2rem;
  font-family: 'Playfair Display', serif;
`;

const LoadingSpinner = () => {
  return (
    <SpinnerWrapper>
      <SpinnerContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LeafIcon
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaLeaf />
        </LeafIcon>
        <LoadingText
          animate={{ 
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity
          }}
        >
          NatureVeda
        </LoadingText>
      </SpinnerContainer>
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
