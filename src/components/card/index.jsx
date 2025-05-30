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
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {isRank && rankNumber && getMedalOrRank(rankNumber) && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: -10,
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
        style={{ width: 240, position: 'relative' }}
        cover={
          <img
            alt="card"
            src={imgUrl}
            style={{ height: 200, objectFit: 'cover', width: '100%' }}
          />
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
