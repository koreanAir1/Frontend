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
  const todayMenuQuery = useQuery({
    queryKey: ['todayMenu'],
    queryFn: () => menuApi.getTodayMenuApi(),
  });
  const todayMenuList = todayMenuQuery.data?.data?.data;
  const setAllIds = useSetRecoilState(allIdsAtom);
  const initializeLikes = useRecoilCallback(
    ({ set }) =>
      (menus) => {
        menus.forEach((menu) => {
          set(likeInfoAtomFamily(menu.idMenu), {
            id: menu.idMenu,
            liked: false,
            count: menu.menuLiked,
          });
        });
      },
    [],
  );

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
                {todayMenuList.map((menu, index) => (
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
                ))}
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

        {[1, 2, 3, 4, 5, 6].map((containerId) => (
          <Container key={containerId}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2vw' }}
            >
              <CustomText
                text={'2025년 5월 30일'}
                fontFamily={'Korean-Air-Sans-Bold'}
                fontSize={'1.3rem'}
                color={COLORS.BLACK}
              />
              <div style={{ display: 'flex', gap: '3vw' }}>
                {[1, 2, 3, 4, 5].map((id) => (
                  <CustomCard
                    key={id}
                    imgUrl={''}
                    title={'안유진'}
                    description={'양재혁'}
                    id={id}
                    isRank={false}
                  />
                ))}
              </div>
            </div>
          </Container>
        ))}
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
