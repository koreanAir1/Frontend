import CustomCard from '../../components/card';
import styled from 'styled-components';
import { COLORS } from '../../constants';
import CustomText from '../../components/text';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import {
  LikeOutlined,
  LoadingOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { menuApi } from '../../api/menu';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { likeInfoAtomFamily, allIdsAtom } from '../../stores/atom';
import { useSetRecoilState, useRecoilCallback } from 'recoil';
import { useEffect, useRef, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const today = new Date();
  const kst = new Date(
    today.getTime() + today.getTimezoneOffset() * 60000 + 9 * 3600000,
  );
  const dayIndex = kst.getDay(); // 0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토

  // 슬라이더 관련 상태
  const todaySliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 주간 메뉴 슬라이더 상태 - 각 날짜별로 관리
  const weeklySliderRefs = useRef({});
  const [weeklyScrollStates, setWeeklyScrollStates] = useState({});

  // 월~금만 처리 (1~5)
  const weekday = dayIndex >= 1 && dayIndex <= 5 ? days[dayIndex - 1] : null;
  const todayMenuQuery = useQuery({
    queryKey: ['todayMenu', weekday],
    queryFn: ({ queryKey }) => {
      const [, weekday] = queryKey;
      return menuApi.getTodayMenuApi(weekday);
    },
  });
  const weeklyMenuQuery = useQuery({
    queryKey: ['weeklyMenu'],
    queryFn: () => menuApi.getWeeklyMenuApi(),
    staleTime: Infinity,
  });

  const todayMenuList = todayMenuQuery.data?.data?.data;
  const weeklyMenuList = weeklyMenuQuery?.data?.data?.data || [];
  const setAllIds = useSetRecoilState(allIdsAtom);
  const initializeLikes = useRecoilCallback(
    ({ set, snapshot }) =>
      async (menus) => {
        for (const menu of menus) {
          const current = await snapshot.getLoadable(
            likeInfoAtomFamily(menu.idMenu),
          ).contents;

          const prevLiked = current?.liked ?? false; // 이전 liked 값이 있으면 유지

          set(likeInfoAtomFamily(menu.idMenu), {
            id: menu.idMenu,
            liked: prevLiked,
            count: menu.menuLiked, // 서버에서 받은 최신 count로 항상 갱신
          });
        }
      },
    [],
  );
  const isLoading = weeklyMenuQuery?.isLoading;

  // 스크롤 상태 체크 함수
  const checkScrollButtons = (element) => {
    if (element) {
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(
        element.scrollLeft < element.scrollWidth - element.clientWidth,
      );
    }
  };

  // 주간 메뉴 스크롤 상태 체크 함수
  const checkWeeklyScrollButtons = (element, dateKey) => {
    if (element) {
      setWeeklyScrollStates((prev) => ({
        ...prev,
        [dateKey]: {
          canScrollLeft: element.scrollLeft > 0,
          canScrollRight:
            element.scrollLeft < element.scrollWidth - element.clientWidth,
        },
      }));
    }
  };

  // 슬라이더 스크롤 함수
  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 300; // 스크롤할 거리
      const newScrollLeft =
        direction === 'left'
          ? ref.current.scrollLeft - scrollAmount
          : ref.current.scrollLeft + scrollAmount;

      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  // 주간 메뉴 스크롤 함수
  const scrollWeekly = (direction, dateKey) => {
    const ref = weeklySliderRefs.current[dateKey];
    if (ref) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === 'left'
          ? ref.scrollLeft - scrollAmount
          : ref.scrollLeft + scrollAmount;

      ref.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (todayMenuList && todayMenuList.length > 0) {
      // allIdsAtom 세팅
      setAllIds(todayMenuList.map((menu) => menu.idMenu));

      // 여러 atomFamily 상태 한꺼번에 세팅
      initializeLikes(todayMenuList);
    }
  }, [todayMenuList, setAllIds, initializeLikes]);

  // 오늘의 식단 스크롤 이벤트 리스너
  useEffect(() => {
    const slider = todaySliderRef.current;
    if (slider) {
      const handleScroll = () => checkScrollButtons(slider);
      slider.addEventListener('scroll', handleScroll);
      // 초기 상태 체크
      checkScrollButtons(slider);

      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, [todayMenuList]);

  // 주간 메뉴 스크롤 이벤트 리스너
  useEffect(() => {
    const refs = weeklySliderRefs.current;
    const listeners = [];

    Object.keys(refs).forEach((dateKey) => {
      const element = refs[dateKey];
      if (element) {
        const handleScroll = () => checkWeeklyScrollButtons(element, dateKey);
        element.addEventListener('scroll', handleScroll);
        listeners.push({ element, handleScroll });
        // 초기 상태 체크
        checkWeeklyScrollButtons(element, dateKey);
      }
    });

    return () => {
      listeners.forEach(({ element, handleScroll }) => {
        element.removeEventListener('scroll', handleScroll);
      });
    };
  }, [weeklyMenuList]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2vw' }}>
        <Container>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2vw',
              width: '100%',
            }}
          >
            <HeaderContainer>
              <div>
                <CustomText
                  text={'오늘의 식단'}
                  color={COLORS.BLUE}
                  fontFamily={'Korean-Air-Sans-Bold'}
                  fontSize={'1.3rem'}
                />
              </div>

              {todayMenuList && todayMenuList.length > 0 && (
                <SliderControls>
                  <SliderButton
                    onClick={() => scroll('left', todaySliderRef)}
                    disabled={!canScrollLeft}
                  >
                    <LeftOutlined />
                  </SliderButton>
                  <SliderButton
                    onClick={() => scroll('right', todaySliderRef)}
                    disabled={!canScrollRight}
                  >
                    <RightOutlined />
                  </SliderButton>
                </SliderControls>
              )}
            </HeaderContainer>

            {todayMenuQuery.isLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '200px',
                }}
              >
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
              </div>
            ) : todayMenuList && todayMenuList.length > 0 ? (
              <SliderContainer ref={todaySliderRef}>
                {todayMenuList.map((menu, index) => {
                  return (
                    <SliderItem key={menu.idMenu}>
                      <CustomCard
                        key={menu.idMenu}
                        imgUrl={menu.menuImgUrl}
                        title={menu.menuName}
                        description={
                          menu.menuLine === 'GRAB'
                            ? 'GRAB & GO'
                            : `${menu.menuLine} 라인`
                        }
                        id={menu.idMenu}
                        isRank={true}
                        rankNumber={index + 1}
                        likeNumber={menu.menuLiked}
                      />
                    </SliderItem>
                  );
                })}
              </SliderContainer>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '200px',
                  fontFamily: 'Korean-Air-Sans-Bold',
                  color: COLORS.BLUE,
                  fontSize: '1.5rem',
                }}
              >
                메뉴가 준비 중입니다.
              </div>
            )}
          </div>
        </Container>

        {isLoading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 48, color: COLORS.BLUE }}
                spin
              />
            }
            size="large"
          />
        ) : weeklyMenuList.length === 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '200px',
              fontFamily: 'Korean-Air-Sans-Bold',
              color: COLORS.BLUE,
              fontSize: '1.5rem',
            }}
          >
            메뉴가 준비 중입니다.
          </div>
        ) : (
          weeklyMenuList
            .filter((dayMenu) => {
              const menuDate = dayMenu.menus?.[0]?.menuInfo?.menuDate;
              const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
              return menuDate !== today;
            })
            .map((dayMenu, index) => {
              console.log(dayMenu);
              const dateKey =
                dayMenu.menus?.[0]?.menuInfo?.menuDate || `day-${index}`;
              const scrollState = weeklyScrollStates[dateKey] || {
                canScrollLeft: false,
                canScrollRight: false,
              };

              return (
                <Container key={index}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2vw',
                    }}
                  >
                    <HeaderContainer>
                      <div>
                        <CustomText
                          text={dayMenu.menus?.[0]?.menuInfo?.menuDate}
                          fontFamily={'Korean-Air-Sans-Bold'}
                          fontSize={'1.3rem'}
                          color={COLORS.BLACK}
                        />
                      </div>

                      {dayMenu.menus.length > 0 && (
                        <SliderControls>
                          <SliderButton
                            onClick={() => scrollWeekly('left', dateKey)}
                            disabled={!scrollState.canScrollLeft}
                          >
                            <LeftOutlined />
                          </SliderButton>
                          <SliderButton
                            onClick={() => scrollWeekly('right', dateKey)}
                            disabled={!scrollState.canScrollRight}
                          >
                            <RightOutlined />
                          </SliderButton>
                        </SliderControls>
                      )}
                    </HeaderContainer>

                    <WeeklySliderContainer
                      ref={(el) => {
                        if (el) {
                          weeklySliderRefs.current[dateKey] = el;
                        }
                      }}
                    >
                      {dayMenu.menus.length === 0 ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '200px',
                            fontFamily: 'Korean-Air-Sans-Bold',
                            color: COLORS.BLUE,
                            fontSize: '1.5rem',
                          }}
                        >
                          메뉴가 준비 중입니다.
                        </div>
                      ) : (
                        dayMenu.menus.map((menu) => {
                          const menuInfo = menu.menuInfo;
                          console.log(menuInfo);
                          return (
                            <SliderItem key={menuInfo.idMenu}>
                              <CustomCard
                                key={menuInfo.idMenu}
                                imgUrl={menuInfo.menuImgUrl}
                                title={menuInfo.menuName}
                                description={`${menu?.lines} 라인`}
                                id={menuInfo.idMenu}
                                isRank={false}
                              />
                            </SliderItem>
                          );
                        })
                      )}
                    </WeeklySliderContainer>
                  </div>
                </Container>
              );
            })
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 30, right: 70, zIndex: 1000 }}>
        <Tooltip title="식단 추천하러가기" placement="left">
          <button
            onClick={() => navigate('/recommend')}
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: COLORS.WHITE,
              border: `2px solid ${COLORS.BORDER}`,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            <LikeOutlined
              style={{
                fontSize: '24px',
                color: COLORS.BLUE,
              }}
            />
          </button>
        </Tooltip>
      </div>
    </>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 3vw;
  position: relative;

  background-color: ${COLORS.WHITE};
  box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  padding: 3vw 4vh 4vh 4vh;
  border: 1px solid ${COLORS.BOX_BORDER};
  overflow: hidden;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 75vw;
  position: relative;
`;

const SliderContainer = styled.div`
  display: flex;
  gap: 3vw;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const WeeklySliderContainer = styled.div`
  display: flex;
  gap: 3vw;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const SliderItem = styled.div`
  flex: 0 0 auto;
  min-width: 200px; /* 카드의 최소 너비 설정 */
`;

const SliderControls = styled.div`
  display: flex;
  gap: 1vw;
`;

const SliderButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${COLORS.BORDER};
  background-color: ${COLORS.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${COLORS.BLUE};
    color: white;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    font-size: 14px;
  }
`;

export default Home;
