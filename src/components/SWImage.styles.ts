import { Skeleton, styled } from '@mui/material';

import { CustomSkeletonProps, ObjectFit } from './SWImage';

export const RelativeSkeleton = styled(Skeleton)({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100% !important',
  height: '100% !important',
});

export const RelativeImg = styled('img')<{
  objectFit?: ObjectFit[];
  variant: CustomSkeletonProps['variant'];
}>(({ objectFit, variant }) => ({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100% !important',
  height: '100% !important',
  borderRadius: variant === 'circular' ? '50%' : '0',
  objectFit: objectFit,
}));
