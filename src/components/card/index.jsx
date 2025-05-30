import { useRecoilCallback, useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { likeAtomFamily, likeCountAtomFamily } from '../../stores/atom';
import { Card } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const { Meta } = Card;

const CustomCard = ({
  id,
  imgUrl,
  title,
  description,
  isRank,
  rankNumber,
  likeNumber,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useRecoilState(likeAtomFamily(id));

  const isEmptyImage = !imgUrl || imgUrl.trim() === '';
  const displayImageUrl = isEmptyImage
    ? 'https://www.naver.com/favicon.ico'
    : imgUrl;

  // 단순화된 atom 키 사용 (id만 사용)
  const [likeCount, setLikeCount] = useRecoilState(likeCountAtomFamily(id));

  // 초기값 설정 - 컴포넌트 마운트 시 한 번만
  useEffect(() => {
    setLikeCount((prevCount) => {
      // 이미 설정된 값이 있으면 유지, 없으면 초기값 설정
      return prevCount === 0 ? likeNumber : prevCount;
    });
  }, [likeNumber, setLikeCount]);

  const toggleLike = useRecoilCallback(
    ({ set, snapshot }) =>
      async (e) => {
        e.stopPropagation();

        // 현재 카드만 토글하고, 다른 카드들의 좋아요는 해제하면서 숫자도 -1
        for (let i = 0; i <= 5; i++) {
          const isCurrent = i === id;

          if (isCurrent) {
            // 현재 카드의 좋아요 토글
            const prevLiked = await snapshot.getPromise(likeAtomFamily(i));
            const prevCount = await snapshot.getPromise(likeCountAtomFamily(i));

            const newLiked = !prevLiked;
            set(likeAtomFamily(i), newLiked);
            set(
              likeCountAtomFamily(i),
              newLiked ? prevCount + 1 : prevCount - 1,
            );
          } else {
            // 다른 카드들의 좋아요 해제
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
    [id],
  );

  const getMedalOrRank = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      case 4:
      case 5:
        return rank;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '13vw',
        maxWidth: 320,
        margin: '0 auto',
      }}
    >
      {isRank && rankNumber && getMedalOrRank(rankNumber) && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            fontSize: 20,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 2,
          }}
        >
          {getMedalOrRank(rankNumber)}
        </div>
      )}

      <Card
        hoverable
        style={{ width: '100%', position: 'relative' }}
        cover={
          <div
            style={{
              width: '100%',
              aspectRatio: '4 / 3',
              overflow: 'hidden',
            }}
          >
            <img
              alt="card"
              src={displayImageUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        }
        onClick={() => navigate(`/details/${id}`)}
      >
        <Meta title={title} description={description} />
        {isRank && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div
              onClick={toggleLike}
              style={{
                fontSize: 20,
                color: isLiked ? 'red' : 'gray',
                cursor: 'pointer',
              }}
            >
              {isLiked ? <HeartFilled /> : <HeartOutlined />}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#666',
                fontWeight: 'bold',
              }}
            >
              {likeCount}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomCard;
