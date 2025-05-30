import { useRecoilCallback, useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { likeAtomFamily } from '../../stores/atom';
import { Card } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const { Meta } = Card;

const CustomCard = ({ id, imgUrl, title, description, isRank, rankNumber }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useRecoilState(likeAtomFamily(id));

  const toggleLike = useRecoilCallback(
    ({ set }) =>
      (e) => {
        e.stopPropagation();
        for (let i = 1; i <= 4; i++) {
          set(likeAtomFamily(i), i === id);
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
        maxWidth: 320, // 최대 크기 제한 (필요 시 조절)
        margin: '0 auto', // 중앙 정렬
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
              aspectRatio: '4 / 3', // 4:3 비율 유지 (Chrome, 최신 브라우저 지원)
              overflow: 'hidden',
            }}
          >
            <img
              alt="card"
              src={imgUrl}
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
            onClick={toggleLike}
            style={{
              position: 'absolute',
              bottom: 15,
              right: 10,
              fontSize: 20,
              color: isLiked ? 'red' : 'gray',
              cursor: 'pointer',
            }}
          >
            {isLiked ? <HeartFilled /> : <HeartOutlined />}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomCard;
