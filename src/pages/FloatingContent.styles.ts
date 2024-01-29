import { styled } from '@mui/material';

import {
  FloatingBottomAndLeftPosition,
  FloatingBottomAndRightPosition,
  FloatingTopAndLeftPosition,
  FloatingTopAndRightPosition,
} from './FloatingContent';

const multipleStringPosition = (stringPercentage: string) => {
  return `${parseInt(stringPercentage.replace('%', '')) * 2}%`;
};

export const FloatingTopAndRightContentContainer = styled('div')<
  {
    isVisible: boolean;
    isCentered?: boolean;
  } & FloatingTopAndRightPosition
>(({ top, right, flagPosition, isVisible, isCentered }) => ({
  position: 'fixed',
  zIndex: 2,
  top: flagPosition === 'top' ? (isVisible ? top : '-100%') : top,
  right: flagPosition === 'right' ? (isVisible ? right : '-100%') : right,
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  overflow: 'hidden',
  ...(isCentered && {
    display: 'flex',
    justifyContent: 'center',
    width: `calc(100% - ${multipleStringPosition(right)})`,
  }),
}));

export const FloatingTopAndLeftContentContainer = styled('div')<
  {
    isVisible: boolean;
    isCentered?: boolean;
  } & FloatingTopAndLeftPosition
>(({ top, left, flagPosition, isVisible, isCentered }) => ({
  position: 'fixed',
  zIndex: 2,
  top: flagPosition === 'top' ? (isVisible ? top : '-100%') : top,
  left: flagPosition === 'left' ? (isVisible ? left : '-100%') : left,
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  overflow: 'hidden',
  ...(isCentered && {
    display: 'flex',
    justifyContent: 'center',
    width: `calc(100% - ${multipleStringPosition(left)})`,
  }),
}));

export const FloatingBottomAndRightContentContainer = styled('div')<
  {
    isVisible: boolean;
    isCentered?: boolean;
  } & FloatingBottomAndRightPosition
>(({ bottom, right, flagPosition, isVisible, isCentered }) => ({
  position: 'fixed',
  zIndex: 2,
  bottom: flagPosition === 'bottom' ? (isVisible ? bottom : '-100%') : bottom,
  right: flagPosition === 'right' ? (isVisible ? right : '-100%') : right,
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  overflow: 'hidden',
  ...(isCentered && {
    display: 'flex',
    justifyContent: 'center',
    width: `calc(100% - ${multipleStringPosition(right)})`,
  }),
}));

export const FloatingBottomAndLeftContentContainer = styled('div')<
  {
    isVisible: boolean;
    isCentered?: boolean;
  } & FloatingBottomAndLeftPosition
>(({ bottom, left, flagPosition, isVisible, isCentered }) => ({
  position: 'fixed',
  zIndex: 2,
  bottom: flagPosition === 'bottom' ? (isVisible ? bottom : '-100%') : bottom,
  left: flagPosition === 'left' ? (isVisible ? left : '-100%') : left,
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  overflow: 'hidden',
  ...(isCentered && {
    display: 'flex',
    justifyContent: 'center',
    width: `calc(100% - ${multipleStringPosition(left)})`,
  }),
}));
