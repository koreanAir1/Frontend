import CustomCard from '../../components/card';
import styled from 'styled-components';
import { COLORS } from '../../constants';
import CustomText from '../../components/text';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { LikeOutlined, LoadingOutlined } from '@ant-design/icons';
import { menuApi } from '../../api/menu';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { likeInfoAtomFamily, allIdsAtom } from '../../stores/atom';
import { useSetRecoilState, useRecoilCallback } from 'recoil';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const today = new Date();
  const kst = new Date(
    today.getTime() + today.getTimezoneOffset() * 60000 + 9 * 3600000,
  );
  const dayIndex = kst.getDay(); // 0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토

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
  useEffect(() => {
    if (todayMenuList && todayMenuList.length > 0) {
      // allIdsAtom 세팅
      setAllIds(todayMenuList.map((menu) => menu.idMenu));

      // 여러 atomFamily 상태 한꺼번에 세팅
      initializeLikes(todayMenuList);
    }
  }, [todayMenuList, setAllIds, initializeLikes]);

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
            <CustomText
              text={'오늘의 식단'}
              color={COLORS.BLUE}
              fontFamily={'Korean-Air-Sans-Bold'}
              fontSize={'1.3rem'}
            />

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
              <div>
                {todayMenuList.map((menu, index) => {
                  return (
                    <div
                      key={menu.idMenu}
                      style={{ display: 'inline-block', marginRight: '3vw' }}
                    >
                      <CustomCard
                        key={menu.idMenu}
                        imgUrl={menu.menuImgUrl}
                        title={menu.menuName}
                        description={`${menu.menuLine} 라인`}
                        id={menu.idMenu}
                        isRank={true}
                        rankNumber={index + 1}
                        likeNumber={menu.menuLiked}
                      />
                    </div>
                  );
                })}
              </div>
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
          weeklyMenuList.map((dayMenu, index) => {
            console.log(dayMenu);
            return (
              <Container key={index}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2vw',
                  }}
                >
                  <CustomText
                    text={dayMenu.menus?.[0]?.menuInfo?.menuDate}
                    fontFamily={'Korean-Air-Sans-Bold'}
                    fontSize={'1.3rem'}
                    color={COLORS.BLACK}
                  />
                  <div style={{ display: 'flex', gap: '3vw' }}>
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
                          <CustomCard
                            key={menuInfo.idMenu}
                            imgUrl={menuInfo.menuImgUrl}
                            title={menuInfo.menuName}
                            description={`${menu?.lines} 라인`}
                            id={menuInfo.idMenu}
                            isRank={false}
                          />
                        );
                      })
                    )}
                  </div>
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

export default Home;
