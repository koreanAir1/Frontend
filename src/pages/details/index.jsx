import { useState } from 'react';
import { Image } from 'antd';
import styled from 'styled-components';
import CustomText from '../../components/text';
import CustomModal from '../../components/modal';
import { COLORS } from '../../constants';

const Details = () => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(123);

  const toggleLike = (e) => {
    e.stopPropagation();
    if (liked) {
      setLikeCount((count) => Math.max(count - 1, 0));
      setLiked(false);
    } else {
      setLikeCount((count) => count + 1);
      setLiked(true);
    }
  };

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  return (
    <>
      <Container>
        <div style={{ width: '100%', height: '70%' }}>
          <Image
            width="100%"
            height="100%"
            src="http://k.kakaocdn.net/dn/h5kvR/btsOi8a81Kh/ySgKbU4DHVp12d0Qb7Upj1/img_xl.jpg"
            preview={false}
          />
        </div>

        <CustomText text={'배식 라인: A 라인'} />
        <CustomText text={'칼로리: 350 kcal'} />
        <CustomText text={'탄단지: 탄 40g, 단 25g, 지 10g'} />
        <CustomText text={'메뉴 명: 불고기 덮밥'} />
        <CustomText text={'요일: 월요일'} />

        <LikeContainer onClick={toggleLike} role="button" aria-pressed={liked}>
          <LikeText liked={liked}>👍 좋아요 {likeCount}</LikeText>
        </LikeContainer>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 0 5vw 0 5vw;
  gap: 3vw;
  position: relative;

  background-color: ${COLORS.WHITE};
  box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  padding: 0 4vh 4vh 4vh;
  border: 1px solid ${COLORS.BOX_BORDER};
  overflow: hidden;
`;

const LikeContainer = styled.div`
  cursor: pointer;
  user-select: none;
`;

const LikeText = styled.span`
  color: ${({ liked }) => (liked ? COLORS.BLUE : COLORS.DARK_GRAY)};
  font-weight: ${({ liked }) => (liked ? '700' : '400')};
  font-size: 1.1rem;
  transition: color 0.3s;
`;

export default Details;
