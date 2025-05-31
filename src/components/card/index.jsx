import { useRecoilCallback, useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { menuApi } from '../../api/menu';
import { likeInfoAtomFamily, allIdsAtom } from '../../stores/atom';
import { useState } from 'react';

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
  const [likeInfo, setLikeInfo] = useRecoilState(likeInfoAtomFamily(id));
  // likeInfo 구조: { liked: boolean, count: number, id: number }
  console.log('cardId:', id, 'liked:', likeInfo);
  // 좋아요 API 호출 뮤테이션
  const likeMutation = useMutation({
    mutationFn: async (data) => {
      try {
        await menuApi.postLikeApi(data);
      } catch (error) {
        throw new error('error');
      }
    },
  });

  // 좋아요 취소 API 호출 뮤테이션
  const dislikeMutation = useMutation({
    mutationFn: async (data) => {
      try {
        await menuApi.postDislikeApi(data);
      } catch (error) {
        throw new error('error');
      }
    },
  });
  const displayImageUrl =
    !imgUrl || imgUrl.length === 0 ? '/images/defaultImage.png' : imgUrl;
  const [imageSrc, setImageSrc] = useState(displayImageUrl);
  // 좋아요 토글 함수 (Recoil 상태 변경 및 API 호출)
  const toggleLike = useRecoilCallback(
    ({ set, snapshot }) =>
      async (e, currentId) => {
        e.stopPropagation();

        const allIds = await snapshot.getPromise(allIdsAtom);

        for (const menuId of allIds) {
          const info = await snapshot.getPromise(likeInfoAtomFamily(menuId));

          if (menuId === currentId) {
            const newLiked = !info.liked;
            const newCount = newLiked
              ? info.count + 1
              : Math.max(0, info.count - 1);

            set(likeInfoAtomFamily(menuId), {
              ...info,
              liked: newLiked,
              count: newCount,
            });

            // API 호출
            if (newLiked) {
              likeMutation.mutate(currentId);
            } else {
              dislikeMutation.mutate(currentId);
            }
          } else {
            // 다른 카드 좋아요 해제 및 카운트 조정
            if (info.liked) {
              set(likeInfoAtomFamily(menuId), {
                ...info,
                liked: false,
                count: Math.max(0, info.count - 1),
              });
            }
          }
        }
      },
    [likeMutation, dislikeMutation],
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
              src={imageSrc}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={() => {
                setImageSrc('/assets/images/defaultImage.png'); // state 업데이트
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
              onClick={(e) => toggleLike(e, id)}
              style={{
                fontSize: 20,
                color: likeInfo.liked ? 'red' : 'gray',
                cursor: 'pointer',
              }}
            >
              {likeInfo.liked ? <HeartFilled /> : <HeartOutlined />}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#666',
                fontWeight: 'bold',
              }}
            >
              {likeInfo.count}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomCard;
