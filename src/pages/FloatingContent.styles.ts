import { styled } from '@mui/material';

import {
  FloatingBottomAndLeftPosition,
  FloatingBottomAndRightPosition,
  FloatingTopAndLeftPosition,
  FloatingTopAndRightPosition,
} from './FloatingContent';

export const FloatingTopAndRightContentContainer = styled('div')<
  {
    isVisible: boolean;
  } & FloatingTopAndRightPosition
>(({ top, right, flagPosition, isVisible }) => ({
  position: 'fixed',
  zIndex: 2,
  top: flagPosition === 'top' ? (isVisible ? top : '-100%') : top,
  right: flagPosition === 'right' ? (isVisible ? right : '-100%') : right,
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  overflow: 'hidden',
}));

export const FloatingTopAndLeftContentContainer = styled('div')<
  {
    isVisible: boolean;
  } & FloatingTopAndLeftPosition
>(({ top, left, flagPosition, isVisible }) => ({
  position: 'fixed',
  zIndex: 2,
  top: flagPosition === 'top' ? (isVisible ? top : '-100%') : top,
  left: flagPosition === 'left' ? (isVisible ? left : '-100%') : left,
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  overflow: 'hidden',
}));

export const FloatingBottomAndRightContentContainer = styled('div')<
  {
    isVisible: boolean;
  } & FloatingBottomAndRightPosition
>(({ bottom, right, flagPosition, isVisible }) => ({
  position: 'fixed',
  zIndex: 2,
  bottom: flagPosition === 'bottom' ? (isVisible ? bottom : '-100%') : bottom,
  right: flagPosition === 'right' ? (isVisible ? right : '-100%') : right,
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  overflow: 'hidden',
}));

export const FloatingBottomAndLeftContentContainer = styled('div')<
  {
    isVisible: boolean;
  } & FloatingBottomAndLeftPosition
>(({ bottom, left, flagPosition, isVisible }) => ({
  position: 'fixed',
  zIndex: 2,
  bottom: flagPosition === 'bottom' ? (isVisible ? bottom : '-100%') : bottom,
  left: flagPosition === 'left' ? (isVisible ? left : '-100%') : left,
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  overflow: 'hidden',
}));
