import { useMemo, useState, useEffect } from 'react';

import { Typography } from '@mui/material';

import * as S from './FloatingBatteryDescription.styles';

import { COLOR } from '@/constants';

type FloatingBatteryDescriptionProps = { isVisible: boolean };

export const FloatingBatteryDescription: React.FC<FloatingBatteryDescriptionProps> = ({
  isVisible,
}) => {
  const isFloatingDescriptionVisible = useMemo(() => isVisible, [isVisible]);
  const [opacityScore, setOpacityScore] = useState(0);

  useEffect(() => {
    if (isFloatingDescriptionVisible) {
      setTimeout(() => {
        const addOpacityInterval = setInterval(() => {
          setOpacityScore(prev => {
            if (prev < 1) return prev + 0.05;
            else {
              clearInterval(addOpacityInterval);
              return 1;
            }
          });
        }, 50);
      }, 800);
    } else {
      setTimeout(() => {
        const removeOpacityInterval = setInterval(() => {
          setOpacityScore(prev => {
            if (prev > 0) return prev - 0.05;
            else {
              clearInterval(removeOpacityInterval);
              return 0;
            }
          });
        }, 50);
      }, 800);
    }
  }, [isFloatingDescriptionVisible, opacityScore]);

  return (
    <S.FloatingBatteryDescriptionContainer
      isFloatingDescriptionVisible={isFloatingDescriptionVisible}>
      <S.BatteryDescriptionKeywordFlexContainer>
        <S.BatteryDescriptionKeyWord color={COLOR.grayScale10}>
          <Typography variant='h3' fontWeight='bold'>
            충 전 시 간
          </Typography>
        </S.BatteryDescriptionKeyWord>
        <S.BatteryDescriptionKeyWord color={COLOR.grayScale40}>
          <Typography variant='h3' fontWeight='bold'>
            주 행 거 리
          </Typography>
        </S.BatteryDescriptionKeyWord>
        <S.BatteryDescriptionKeyWord color={COLOR.grayScale60}>
          <Typography variant='h3' fontWeight='bold'>
            편 리 성
          </Typography>
        </S.BatteryDescriptionKeyWord>
      </S.BatteryDescriptionKeywordFlexContainer>
      <S.DescriptionFlexContainer>
        <S.DescriptionPart>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ marginBottom: '3rem', fontSize: '3rem' }}>
            초고속 충전
          </Typography>
          <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '1.5rem' }}>
            30분 만에 100% 충전 가능, 스테이션 불필요.
          </Typography>
          <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '1.5rem' }}>
            고압 충전 시 발열 문제를 해결하여 안전성 증가.
          </Typography>
        </S.DescriptionPart>
        <S.DescriptionPart>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ marginBottom: '3rem', fontSize: '3rem' }}>
            압도적인 주행 거리
          </Typography>
          <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '0.5rem' }}>
            1회 충전시 주행 거리 104km
          </Typography>
          <Typography variant='h5' sx={{ marginBottom: '1.5rem' }}>
            환경부 시험방법 기준 (CSV-40)
          </Typography>
          <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '0.5rem' }}>
            72V / 60Ah 배터리로 60km 정속 주행 시 158km 주행 가능
          </Typography>
          <Typography variant='h5' sx={{ marginBottom: '1.5rem' }}>
            자체 테스트 결과
          </Typography>
        </S.DescriptionPart>
      </S.DescriptionFlexContainer>
    </S.FloatingBatteryDescriptionContainer>
  );
};
