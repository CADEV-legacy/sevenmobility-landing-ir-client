import { useEffect, useState } from 'react';

import { SkeletonProps } from '@mui/material';

import * as S from './SWImage.styles';

export type ObjectFit = 'contain' | 'cover' | 'fill';

type Loading = 'eager' | 'lazy';

export type CustomSkeletonProps = Pick<SkeletonProps, 'animation' | 'variant'>;

type SWImageProps = {
  alt: string;
  src?: string;
  hoverSrc?: string;
  loading?: Loading;
  objectFit?: ObjectFit[];
  isCaptureBlocked?: boolean;
} & CustomSkeletonProps;

export const SWImage: React.FC<SWImageProps> = ({
  alt,
  src,
  hoverSrc,
  animation = 'wave',
  variant = 'rounded',
  loading = 'lazy',
  objectFit = ['cover'],
  isCaptureBlocked = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    setIsHovered(false);
  }, [src]);

  if (!src) return <S.RelativeSkeleton animation={animation} variant={variant} />;

  return (
    <S.RelativeImg
      src={isHovered && hoverSrc ? hoverSrc : src}
      loading={loading}
      alt={alt}
      variant={variant}
      objectFit={objectFit}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onContextMenu={isCaptureBlocked ? onContextMenu : undefined}
    />
  );
};
