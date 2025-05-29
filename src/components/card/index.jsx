import { Card } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { addSession } from '../../hooks';

const { Meta } = Card;

const CustomCard = ({ imgUrl, title, description, pageUrl, isLiked }) => {
  const navigate = useNavigate();
  const [like, setLike] = useState(isLiked);

  const toggleLike = (e) => {
    e.stopPropagation();
    const newLike = !like;
    setLike(newLike);
    addSession('like', newLike);
  };

  return (
    <Card
      hoverable
      style={{ width: 240, position: 'relative' }}
      cover={
        <img
          alt="food"
          src={imgUrl}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      onClick={() => navigate(pageUrl)}
    >
      <Meta title={title} description={description} />
      <div
        onClick={toggleLike}
        style={{
          position: 'absolute',
          bottom: 15,
          right: 10,
          fontSize: 20,
          color: like ? 'red' : 'gray',
          cursor: 'pointer',
        }}
      >
        {like ? <HeartFilled /> : <HeartOutlined />}
      </div>
    </Card>
  );
};

export default CustomCard;
