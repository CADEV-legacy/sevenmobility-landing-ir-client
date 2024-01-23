import * as S from './FloatingTitle.styles';

type FloatingTitleProps = {
  text: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  isVisible: boolean;
};

export const FloatingTitle: React.FC<FloatingTitleProps> = ({
  text,
  top,
  right,
  bottom,
  left,
  isVisible,
}) => {
  return (
    <S.FloatingTitleContainer
      top={top}
      right={right}
      bottom={bottom}
      left={left}
      isFloatingDescriptionVisible={isVisible}>
      {text}
    </S.FloatingTitleContainer>
  );
};
