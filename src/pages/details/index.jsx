import { useState, useEffect } from 'react';
import { Image } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilCallback } from 'recoil';
import { likeAtomFamily, likeCountAtomFamily } from '../../stores/atom';
import CustomText from '../../components/text';
import CustomModal from '../../components/modal';
import { COLORS } from '../../constants';
import ReactWordcloud from 'react-wordcloud';

const Details = () => {
  const { id } = useParams();
  const cardId = parseInt(id, 10);

  const [liked, setLiked] = useRecoilState(likeAtomFamily(cardId));
  const [likeCount, setLikeCount] = useRecoilState(likeCountAtomFamily(cardId));
  const [showWordcloud, setShowWordcloud] = useState(true);

  // 워드클라우드 데이터
  const wordcloudData = [
    { text: '불고기', value: 80 },
    { text: '덮밥', value: 70 },
    { text: '맛있는', value: 60 },
    { text: '한식', value: 50 },
    { text: '점심', value: 45 },
    { text: '잡채', value: 40 },
    { text: '오이소박이', value: 35 },
    { text: '메밀전병', value: 30 },
    { text: '영양', value: 25 },
    { text: '건강', value: 20 },
  ];

  // 워드클라우드 옵션
  const wordcloudOptions = {
    colors: [
      COLORS.BLUE,
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA726',
      '#AB47BC',
    ],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'Korean-Air-Sans-Bold',
    fontSizes: [20, 80],
    fontStyle: 'normal',
    fontWeight: 'bold',
    padding: 5,
    rotations: 2,
    rotationAngles: [0, 90],
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
  };

  // 오늘 날짜 생성 (YYYY년 MM월 DD일 형식)
  const today = new Date();
  const todayText = `${today.getFullYear()}년 ${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일`;

  const now = new Date();
  // 이미지 URL과 날짜 확인
  const imageUrl =
    'http://k.kakaocdn.net/dn/h5kvR/btsOi8a81Kh/ySgKbU4DHVp12d0Qb7Upj1/img_xl.jpg';
  const dateText = '2025년 05월 31일';
  // 현재 날짜와 일치하는지 확인
  const isToday = dateText === todayText;
  const shouldShowFeedbackButton = isToday;

  // 3초 후 워드클라우드 숨기기
  useEffect(() => {
    if (!shouldShowFeedbackButton) {
      // 오늘이 아니면 즉시 워드클라우드 숨기기
      setShowWordcloud(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowWordcloud(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const toggleLike = useRecoilCallback(
    ({ set, snapshot }) =>
      async (e) => {
        e.stopPropagation();

        for (let i = 0; i <= 5; i++) {
          const isCurrent = i === cardId;

          if (isCurrent) {
            const prevLiked = await snapshot.getPromise(likeAtomFamily(i));
            const prevCount = await snapshot.getPromise(likeCountAtomFamily(i));

            const newLiked = !prevLiked;
            set(likeAtomFamily(i), newLiked);
            set(
              likeCountAtomFamily(i),
              newLiked ? prevCount + 1 : prevCount - 1,
            );
          } else {
            const prevLiked = await snapshot.getPromise(likeAtomFamily(i));
            if (prevLiked) {
              const prevCount = await snapshot.getPromise(
                likeCountAtomFamily(i),
              );
              set(likeAtomFamily(i), false);
              set(likeCountAtomFamily(i), Math.max(0, prevCount - 1));
            }
          }
        }
      },
    [cardId],
  );

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  return (
    <>
      {/* 워드클라우드 오버레이 */}
      {showWordcloud && shouldShowFeedbackButton && (
        <WordcloudOverlay>
          <WordcloudContainer>
            <ReactWordcloud words={wordcloudData} options={wordcloudOptions} />
          </WordcloudContainer>
        </WordcloudOverlay>
      )}

      <Container style={{ opacity: showWordcloud ? 0.3 : 1 }}>
        {/* 날짜 헤더 */}
        <DateHeader>
          <CustomText
            text={dateText}
            fontFamily={'Korean-Air-Sans-Regular'}
            fontSize={'0.9rem'}
            color={COLORS.GRAY}
          />
        </DateHeader>

        {/* 이미지 섹션 */}
        <ImageContainer>
          <StyledImage
            width="100%"
            height="100%"
            src={imageUrl}
            preview={false}
          />
          <ImageOverlay />
        </ImageContainer>

        {/* 좋아요 섹션 */}
        <LikeSection>
          <LikeContainer
            onClick={isToday ? toggleLike : undefined}
            role="button"
            aria-pressed={liked}
            disabled={!isToday}
          >
            <HeartIcon liked={liked} disabled={!isToday}>
              {liked ? <HeartFilled /> : <HeartOutlined />}
            </HeartIcon>
            <LikeText liked={liked} disabled={!isToday}>
              {likeCount}
            </LikeText>
          </LikeContainer>
          {!isToday && (
            <DisabledMessage>
              <CustomText
                text={'오늘 메뉴만 좋아요를 누를 수 있어요'}
                fontFamily={'Korean-Air-Sans-Regular'}
                fontSize={'0.8rem'}
                color={COLORS.GRAY}
              />
            </DisabledMessage>
          )}
        </LikeSection>

        {/* 제목 섹션 */}
        <TitleSection>
          <CustomText
            text={'불고기 덮밥'}
            fontFamily={'Korean-Air-Sans-Bold'}
            fontSize={'2.2rem'}
            color={COLORS.BLUE}
          />
          <TitleDivider />
        </TitleSection>

        {/* 설명 섹션 */}
        <DescriptionSection>
          <DescriptionItem>
            <CustomText
              text={'잡채'}
              fontFamily={'Korean-Air-Sans-Regular'}
              fontSize={'1.1rem'}
              color={COLORS.BLACK}
            />
          </DescriptionItem>
          <DescriptionItem>
            <CustomText
              text={'오이소박이'}
              fontFamily={'Korean-Air-Sans-Regular'}
              fontSize={'1.1rem'}
              color={COLORS.BLACK}
            />
          </DescriptionItem>
          <DescriptionItem>
            <CustomText
              text={'메밀 전병'}
              fontFamily={'Korean-Air-Sans-Regular'}
              fontSize={'1.1rem'}
              color={COLORS.BLACK}
            />
          </DescriptionItem>
        </DescriptionSection>

        {/* 정보 섹션 */}
        <InfoSection>
          <InfoCard>
            <InfoLabel>배식 라인</InfoLabel>
            <InfoValue>A 라인</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>칼로리</InfoLabel>
            <InfoValue>350 kcal</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>영양성분</InfoLabel>
            <NutritionContainer>
              <NutritionItem color="#FF6B6B">탄 40g</NutritionItem>
              <NutritionItem color="#4ECDC4">단 25g</NutritionItem>
              <NutritionItem color="#45B7D1">지 10g</NutritionItem>
            </NutritionContainer>
          </InfoCard>
        </InfoSection>

        {/* 피드백 버튼 - 조건부 렌더링 */}
        {shouldShowFeedbackButton ? (
          <FeedbackButton onClick={showModal}>
            <CustomText
              text={'피드백 남기기'}
              fontFamily={'Korean-Air-Sans-Bold'}
              fontSize={'1rem'}
              color={COLORS.WHITE}
            />
          </FeedbackButton>
        ) : (
          <DisabledFeedbackButton>
            <CustomText
              text={'오늘 메뉴만 피드백할 수 있어요'}
              fontFamily={'Korean-Air-Sans-Regular'}
              fontSize={'1rem'}
              color={COLORS.GRAY}
            />
          </DisabledFeedbackButton>
        )}
      </Container>

      <CustomModal
        title={
          <CustomText
            text={'피드백 하기'}
            color={COLORS.BLUE}
            fontFamily={'Korean Air Sans Bold'}
            fontSize={'1.2rem'}
          />
        }
        open={open}
        setOpen={setOpen}
        contents={'안녕'}
      />
    </>
  );
};

// 워드클라우드 관련 스타일
const WordcloudOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const WordcloudContainer = styled.div`
  width: 80vw;
  height: 60vh;
  max-width: 800px;
  max-height: 600px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0px 16px 64px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  animation: scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes scaleIn {
    from {
      transform: scale(0.3);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2vh 5vw;
  background-color: ${COLORS.WHITE};
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.08);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid ${COLORS.BOX_BORDER};
  position: relative;
  transition: opacity 0.5s ease-in-out;
`;

const DateHeader = styled.div`
  padding: 3vh 4vh 2vh 4vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e9ecef;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 70%;
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
  pointer-events: none;
`;

const LikeSection = styled.div`
  padding: 2vh 4vh 1vh 4vh;
  background-color: #fafbfc;
`;

const LikeContainer = styled.div`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 1vh 1.5vh;
  border-radius: 20px;
  background-color: ${({ disabled }) => (disabled ? '#f5f5f5' : COLORS.WHITE)};
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  width: fit-content;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-2px)')};
    box-shadow: ${({ disabled }) =>
      disabled
        ? '0px 2px 8px rgba(0, 0, 0, 0.06)'
        : '0px 4px 16px rgba(0, 0, 0, 0.12)'};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(0px)')};
  }
`;

const HeartIcon = styled.div`
  font-size: 20px;
  color: ${({ liked, disabled }) =>
    disabled ? '#D1D5DB' : liked ? '#FF6B6B' : '#9CA3AF'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(1.1)')};
  }
`;

const LikeText = styled.span`
  color: ${({ liked, disabled }) =>
    disabled ? '#D1D5DB' : liked ? COLORS.BLUE : '#6B7280'};
  font-weight: ${({ liked }) => (liked ? '700' : '500')};
  font-size: 0.95rem;
  transition: color 0.3s ease;
`;

const DisabledMessage = styled.div`
  margin-top: 1vh;
  text-align: center;
`;

const TitleSection = styled.div`
  padding: 2vh 4vh 1vh 4vh;
  position: relative;
`;

const TitleDivider = styled.div`
  width: 60px;
  height: 4px;
  background: ${COLORS.BLUE};
  border-radius: 2px;
  margin-top: 1vh;
`;

const DescriptionSection = styled.div`
  padding: 1vh 4vh 2vh 4vh;
  display: flex;
  flex-direction: column;
  gap: 1.2vh;
`;

const DescriptionItem = styled.div`
  padding: 1vh 0;
  border-left: 3px solid #e5e7eb;
  padding-left: 2vh;
  transition: border-color 0.3s ease;

  &:hover {
    border-left-color: ${COLORS.BLUE};
  }
`;

const InfoSection = styled.div`
  padding: 2vh 4vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;

const InfoCard = styled.div`
  background-color: ${COLORS.WHITE};
  padding: 2vh;
  border-radius: 16px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const InfoLabel = styled.div`
  font-family: 'Korean-Air-Sans-Bold';
  font-size: 1rem;
  color: #6b7280;
  font-weight: 600;
`;

const InfoValue = styled.div`
  font-family: 'Korean-Air-Sans-Bold';
  font-size: 1.1rem;
  color: ${COLORS.BLACK};
  font-weight: 700;
`;

const NutritionContainer = styled.div`
  display: flex;
  gap: 1vh;
`;

const NutritionItem = styled.div`
  background-color: ${(props) => props.color};
  color: white;
  padding: 0.5vh 1vh;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Korean-Air-Sans-Bold';
`;

const FeedbackButton = styled.div`
  margin: 2vh 4vh 4vh 4vh;
  background: ${COLORS.BLUE};
  color: white;
  padding: 2vh;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 16px rgba(0, 123, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 24px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const DisabledFeedbackButton = styled.div`
  margin: 2vh 4vh 4vh 4vh;
  background: #f5f5f5;
  border: 2px dashed #d1d5db;
  padding: 2vh;
  border-radius: 16px;
  text-align: center;
  cursor: not-allowed;
  opacity: 0.6;
`;

export default Details;
