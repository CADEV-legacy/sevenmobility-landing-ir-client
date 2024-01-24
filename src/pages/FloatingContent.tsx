import * as S from './FloatingContent.styles';

export type FloatingTopAndRightPosition = {
  top: string;
  right: string;
  flagPosition: 'top' | 'right';
};

export type FloatingTopAndLeftPosition = {
  top: string;
  left: string;
  flagPosition: 'top' | 'left';
};

export type FloatingBottomAndRightPosition = {
  bottom: string;
  right: string;
  flagPosition: 'bottom' | 'right';
};

export type FloatingBottomAndLeftPosition = {
  bottom: string;
  left: string;
  flagPosition: 'bottom' | 'left';
};

type FloatingPosition =
  | FloatingTopAndRightPosition
  | FloatingTopAndLeftPosition
  | FloatingBottomAndRightPosition
  | FloatingBottomAndLeftPosition;

type FloatingContentProps = {
  children: React.ReactNode;
  isVisible: boolean;
} & FloatingPosition;

export const FloatingContent: React.FC<FloatingContentProps> = ({
  children,
  isVisible,
  ...props
}) => {
  if (isFloatingTopAndRightPosition(props))
    return (
      <S.FloatingTopAndRightContentContainer isVisible={isVisible} {...props}>
        {children}
      </S.FloatingTopAndRightContentContainer>
    );

  if (isFloatingTopAndLeftPosition(props))
    return (
      <S.FloatingTopAndLeftContentContainer isVisible={isVisible} {...props}>
        {children}
      </S.FloatingTopAndLeftContentContainer>
    );

  if (isFloatingBottomAndRightPosition(props))
    return (
      <S.FloatingBottomAndRightContentContainer isVisible={isVisible} {...props}>
        {children}
      </S.FloatingBottomAndRightContentContainer>
    );

  return (
    <S.FloatingBottomAndLeftContentContainer isVisible={isVisible} {...props}>
      {children}
    </S.FloatingBottomAndLeftContentContainer>
  );
};

export const isFloatingTopAndRightPosition = (
  position: FloatingPosition
): position is FloatingTopAndRightPosition => {
  return 'top' in position && 'right' in position;
};

export const isFloatingTopAndLeftPosition = (
  position: FloatingPosition
): position is FloatingTopAndLeftPosition => {
  return 'top' in position && 'left' in position;
};

export const isFloatingBottomAndRightPosition = (
  position: FloatingPosition
): position is FloatingBottomAndRightPosition => {
  return 'bottom' in position && 'right' in position;
};

export const isFloatingBottomAndLeftPosition = (
  position: FloatingPosition
): position is FloatingBottomAndLeftPosition => {
  return 'bottom' in position && 'left' in position;
};
