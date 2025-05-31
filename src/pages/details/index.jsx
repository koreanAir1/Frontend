import { useState, useEffect } from 'react';
import { Image, Spin } from 'antd';
import { HeartFilled, HeartOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilCallback } from 'recoil';
import { likeInfoAtomFamily } from '../../stores/atom';
import CustomText from '../../components/text';
import { COLORS } from '../../constants';
import ReactWordcloud from 'react-wordcloud';
import { feedbackDoneAtom } from '../../stores/atom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { menuApi } from '../../api/menu';

const Details = () => {
  const { id } = useParams();
  const cardId = parseInt(id, 10);
  const [liked, setLiked] = useRecoilState(likeInfoAtomFamily(cardId));
  const [showWordcloud, setShowWordcloud] = useState(true);
  const [feedbackDone, setFeedbackDone] = useRecoilState(feedbackDoneAtom);
  console.log('cardId:', cardId, 'liked:', liked);
  const menuDetailQuery = useQuery({
    queryKey: ['menuDetail', id],
    queryFn: () => menuApi.getMenuDetailApi(id),
  });

  // 좋아요 API 호출 뮤테이션
  const likeMutation = useMutation({
    mutationFn: async (data) => {
      try {
        await menuApi.postLikeApi(data);
      } catch (error) {
        throw new error('error');
      }
    },
  });

  // 좋아요 취소 API 호출 뮤테이션
  const dislikeMutation = useMutation({
    mutationFn: async (data) => {
      try {
        await menuApi.postDislikeApi(data);
      } catch (error) {
        throw new error('error');
      }
    },
  });

  // 로딩 및 에러 상태 처리
  const { data: menuData, isLoading, error } = menuDetailQuery;

  // 워드클라우드 데이터 - API 데이터에서 동적으로 생성하거나 기본값 사용
  const wordcloudData = menuData?.wordcloud || [
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
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0]; // "2025-05-31" 형식

  // API에서 받은 데이터 사용 또는 기본값
  const imageUrl =
    menuData?.data?.data?.menuImgUrl ||
    'http://k.kakaocdn.net/dn/h5kvR/btsOi8a81Kh/ySgKbU4DHVp12d0Qb7Upj1/img_xl.jpg';
  const dateText = menuData?.data?.data?.menuDate;
  const menuTitle = menuData?.data?.data?.menuName;
  const menuDescription = menuData?.description || [
    '잡채',
    '오이소박이',
    '메밀 전병',
  ];

  const parseNutrition = (nutrilString) => {
    if (typeof nutrilString !== 'string') {
      return {
        carbs: '0g',
        protein: '0g',
        fat: '0g',
      };
    }

    const [carbs, protein, fat] = nutrilString.split(':');
    return {
      carbs: `${carbs || '0'}g`,
      protein: `${protein || '0'}g`,
      fat: `${fat || '0'}g`,
    };
  };

  const nutritionData = parseNutrition(menuData?.data?.data?.menuNutri);
  const menuInfo = {
    line: `${menuData?.data?.data?.menuLine} 라인`,
    calories: `${menuData?.data?.data?.menuKcal} kcal`,
    nutrition: nutritionData,
  };

  // 현재 날짜와 일치하는지 확인
  const isToday = dateText === todayISO;
  const shouldShowFeedbackButton = isToday;

  // 3초 후 워드클라우드 숨기기
  useEffect(() => {
    if (!shouldShowFeedbackButton) {
      setShowWordcloud(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowWordcloud(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [shouldShowFeedbackButton]);

  const toggleLike = useRecoilCallback(
    ({ set, snapshot }) =>
      async (e) => {
        e.stopPropagation();

        const prevInfo = await snapshot.getPromise(likeInfoAtomFamily(cardId));
        const newLiked = !prevInfo.liked;
        const newCount = newLiked
          ? prevInfo.count + 1
          : Math.max(0, prevInfo.count - 1);

        set(likeInfoAtomFamily(cardId), {
          ...prevInfo,
          liked: newLiked,
          count: newCount,
        });

        // 좋아요 or 좋아요 취소 API 호출
        if (newLiked) {
          likeMutation.mutate(cardId);
        } else {
          dislikeMutation.mutate(cardId);
        }
      },
    [cardId, likeMutation, dislikeMutation],
  );

  // 피드백 관련 상태
  const [open, setOpen] = useState(false);
  const [selections, setSelections] = useState([]);

  const toggleOption = (opt) => {
    setSelections((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  };

  const handleOk = () => {
    console.log('선택된 피드백:', selections);
    setSelections([]);
    setFeedbackDone(true);
    setOpen(false);
  };

  const handleCancel = () => {
    setSelections([]);
    setOpen(false);
  };

  const feedbackOptions = [
    '짜다',
    '맵다',
    '달다',
    '양이 적다',
    '양이 많다',
    '맛있다',
  ];

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 48,
                  color: COLORS.BLUE,
                }}
                spin
              />
            }
            size="large"
          />
          <LoadingText>
            <CustomText
              text={'메뉴 정보를 불러오는 중...'}
              fontFamily={'Korean-Air-Sans-Regular'}
              fontSize={'1.2rem'}
              color={COLORS.GRAY}
            />
          </LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <ErrorContainer>
        <ErrorContent>
          <CustomText
            text={'메뉴 정보를 불러올 수 없습니다'}
            fontFamily={'Korean-Air-Sans-Bold'}
            fontSize={'1.5rem'}
            color={COLORS.GRAY}
          />
          <CustomText
            text={'잠시 후 다시 시도해주세요'}
            fontFamily={'Korean-Air-Sans-Regular'}
            fontSize={'1rem'}
            color={COLORS.GRAY}
          />
        </ErrorContent>
      </ErrorContainer>
    );
  }

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
              {liked.count}
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
            text={menuTitle}
            fontFamily={'Korean-Air-Sans-Bold'}
            fontSize={'2.2rem'}
            color={COLORS.BLUE}
          />
          <TitleDivider />
        </TitleSection>

        {/* 설명 섹션 */}
        <DescriptionSection>
          {menuDescription.map((item, index) => (
            <DescriptionItem key={index}>
              <CustomText
                text={item}
                fontFamily={'Korean-Air-Sans-Regular'}
                fontSize={'1.1rem'}
                color={COLORS.BLACK}
              />
            </DescriptionItem>
          ))}
        </DescriptionSection>

        {/* 정보 섹션 */}
        <InfoSection>
          <InfoCard>
            <InfoLabel>배식 라인</InfoLabel>
            <InfoValue>{menuInfo.line}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>칼로리</InfoLabel>
            <InfoValue>{menuInfo.calories}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>영양성분</InfoLabel>
            <NutritionContainer>
              <NutritionItem color="#FF6B6B">
                탄 {menuInfo.nutrition.carbs}
              </NutritionItem>
              <NutritionItem color="#4ECDC4">
                단 {menuInfo.nutrition.protein}
              </NutritionItem>
              <NutritionItem color="#45B7D1">
                지 {menuInfo.nutrition.fat}
              </NutritionItem>
            </NutritionContainer>
          </InfoCard>
        </InfoSection>

        {/* 피드백 버튼 - 조건부 렌더링 */}
        {shouldShowFeedbackButton ? (
          feedbackDone ? (
            <DisabledFeedbackButton>
              <CustomText
                text={'이미 피드백을 완료했어요'}
                fontFamily={'Korean-Air-Sans-Regular'}
                fontSize={'1rem'}
                color={COLORS.GRAY}
              />
            </DisabledFeedbackButton>
          ) : (
            <FeedbackButton onClick={() => setOpen(true)}>
              <CustomText
                text={'피드백 남기기'}
                fontFamily={'Korean-Air-Sans-Bold'}
                fontSize={'1rem'}
                color={COLORS.WHITE}
              />
            </FeedbackButton>
          )
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

      {/* 피드백 모달 */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '500px',
              background: '#fff',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
          >
            {/* 제목 */}
            <h3
              style={{
                margin: 0,
                marginBottom: '24px',
                color: COLORS.BLUE,
                fontFamily: 'Korean-Air-Sans-Bold',
                fontSize: '1.5rem',
                textAlign: 'left',
              }}
            >
              피드백
            </h3>

            {/* 옵션 버튼들 */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '32px',
                justifyContent: 'flex-start',
              }}
            >
              {feedbackOptions.map((opt) => {
                const isSelected = selections.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleOption(opt)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      border: isSelected
                        ? `1px solid ${COLORS.BLUE}`
                        : '1px solid #ddd',
                      background: isSelected ? COLORS.BLUE : '#fff',
                      color: isSelected ? '#fff' : COLORS.BLACK,
                      fontFamily: 'Korean-Air-Sans-Regular',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* 버튼 영역 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  background: COLORS.WHITE,
                  color: COLORS.BLACK,
                  border: `1px solid ${COLORS.BTN_BORDER}`,
                  borderRadius: '24px',
                  padding: '12px 24px',
                  fontFamily: 'Korean-Air-Sans-Regular',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                취소
              </button>
              <button
                onClick={handleOk}
                style={{
                  background: COLORS.BLUE,
                  color: '#fff',
                  border: `1px solid ${COLORS.BOX_BORDER}`,
                  borderRadius: '24px',
                  padding: '12px 24px',
                  fontFamily: 'Korean-Air-Sans-Bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 로딩 관련 스타일
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: ${COLORS.WHITE};
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem;
  background-color: ${COLORS.WHITE};
  border-radius: 24px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid ${COLORS.BOX_BORDER};
`;

const LoadingText = styled.div`
  text-align: center;
`;

// 에러 관련 스타일
const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: ${COLORS.WHITE};
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  background-color: ${COLORS.WHITE};
  border-radius: 24px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid ${COLORS.BOX_BORDER};
`;

// 기존 스타일들...
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
