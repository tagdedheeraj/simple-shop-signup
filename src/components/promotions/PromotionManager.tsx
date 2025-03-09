
import React from 'react';
import { usePromotionService } from './PromotionService';

// This is a "headless" component that just hooks into the promotion service
const PromotionManager: React.FC = () => {
  usePromotionService();
  return null; // No UI to render
};

export default PromotionManager;
