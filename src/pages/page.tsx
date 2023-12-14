import { useEffect, useRef } from 'react';

import * as S from './page.styles';

import { MotorcycleIIIDM } from '@/3ds';

const Page: React.FC = () => {
  const motorcycleIIIDMRef = useRef<MotorcycleIIIDM>();
  // const cubeIIIDMRef = useRef<MotorcycleIIIDM>();
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motorcycleIIIDM = new MotorcycleIIIDM(undefined);

    console.info(motorcycleIIIDM);

    if (!canvasWrapperRef.current) throw new Error('Canvas not rendered.');

    motorcycleIIIDM.appendCanvasTo(canvasWrapperRef.current);

    motorcycleIIIDM.activate();

    window.addEventListener('resize', () => motorcycleIIIDM.onResize());

    motorcycleIIIDMRef.current = motorcycleIIIDM;

    setTimeout(() => {
      motorcycleIIIDM.ohhh();
    }, 2000);

    return () => {
      window.removeEventListener('resize', motorcycleIIIDM.onResize);
    };
  }, []);

  return (
    <S.Container>
      <S.CanvasWrapper ref={canvasWrapperRef} />
    </S.Container>
  );
};

export default Page;
