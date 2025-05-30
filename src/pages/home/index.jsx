import CustomCard from '../../components/card';
import styled from 'styled-components';
import { COLORS } from '../../constants';
import CustomText from '../../components/text';
import CustomButton from '../../components/button';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { LikeOutlined } from '@ant-design/icons';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2vw' }}>
        <Container>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2vw' }}>
            <CustomText
              text={'오늘의 식단'}
              color={COLORS.BLUE}
              fontFamily={'Korean-Air-Sans-Bold'}
              fontSize={'1.3rem'}
            />
            <div style={{ display: 'flex', gap: '3vw' }}>
              {[1, 2, 3, 4, 5].map((id, index) => {
                return (
                  <CustomCard
                    key={id}
                    imgUrl={
                      'data:image/jpeg;base64,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'
                    }
                    title={'안유진'}
                    description={'양재혁'}
                    id={id}
                    isRank={true}
                    rankNumber={index + 1}
                    likeNumber={100}
                  />
                );
              })}
            </div>
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
  justify-content: flex-start;
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
