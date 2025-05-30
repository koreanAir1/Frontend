import CustomCard from '../../components/card';
import styled from 'styled-components';
import { COLORS } from '../../constants';
import CustomText from '../../components/text';
import CustomButton from '../../components/button';
import { useNavigate } from 'react-router-dom';

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
                    imgUrl={'www.naver.com'}
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
                    imgUrl={'www.naver.com'}
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
        <CustomButton
          text={
            <CustomText
              text="식단 추천"
              fontFamily="Korean-Air-Sans-Regular"
              color={COLORS.BLACK}
              fontSize="14px"
            />
          }
          onClick={() => navigate('/recommend')}
          width="60px"
          height="60px"
          backgroundColor={COLORS.WHITE}
          borderRadius="50%"
          borderColor={COLORS.BOX_BORDER}
          fontWeight="bold"
          fontSize="14px"
        />
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
