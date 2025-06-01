import { useState } from 'react';
import CustomText from '../../components/text';
import { COLORS } from '../../constants';
import { useMutation } from '@tanstack/react-query';
import { recommendApi } from '../../api/recommend';
// Recommend 컴포넌트를 정의하는 함수형 컴포넌트
const Recommend = () => {
  // 추천 전송 API 호출 뮤테이션
  const recommendMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await recommendApi.postRecommendApi(data);
        return response;
      } catch (error) {
        throw new error('error');
      }
    },
    onSuccess: (data) => {
      setThisMenu(data?.data?.data?.menu);
      setResult(data?.data?.data?.description);
    },
  });
  // 모달 오픈 상태
  const [isOpen, setIsOpen] = useState(true);

  // 상태 훅: 선택된 음식
  const [foodType, setFoodType] = useState('밥');
  // 상태 훅: 맛 선호도 (0~100)
  const [salty, setSalty] = useState(50);
  const [spicy, setSpicy] = useState(50);
  const [sweet, setSweet] = useState(50);
  const [bland, setBland] = useState(50);
  // 기타 입력값
  const [comment, setComment] = useState('');

  const [result, setResult] = useState('');
  const [thisMenu, setThisMenu] = useState('');
  const today = new Date();
  const kst = new Date(
    today.getTime() + today.getTimezoneOffset() * 60000 + 9 * 3600000,
  );
  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, '0');
  const day = String(kst.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  // 전송 버튼 클릭 핸들러: 모달 닫기 전 콘솔에 선호도 로그
  const handleSend = () => {
    // console.log('선호도 결과:', {
    //   foodType,
    //   salty,
    //   spicy,
    //   sweet,
    //   bland,
    //   comment,
    //   dateString,
    // });
    const data = {
      foodType,
      salty,
      spicy,
      sweet,
      bland,
      comment,
      menuDate: dateString,
    };
    recommendMutation.mutate(data);
    setIsOpen(false);
  };

  // 모달이 닫히면 페이지 작성 영역을 표시
  if (!isOpen) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2vw' }}>
        {/* 추천 음식 메인 컨테이너 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '3vw',
            position: 'relative',
            backgroundColor: COLORS.WHITE,
            boxShadow: '0px 0px 25px 0px rgba(0, 0, 0, 0.04)',
            borderRadius: '16px',
            padding: '3vw 4vh 4vh 4vh',
            border: `1px solid ${COLORS.BOX_BORDER}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2vw',
              width: '100%',
            }}
          >
            {/* 제목과 설정 아이콘 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <CustomText
                text="추천 음식"
                color={COLORS.BLUE}
                fontFamily="Korean-Air-Sans-Bold"
                fontSize="1.3rem"
              />
              <button
                type="button"
                onClick={() => {
                  setResult('');
                  setThisMenu('');
                  setIsOpen(true);
                }}
                style={{
                  background: COLORS.BLUE,
                  color: '#fff',
                  border: `1px solid ${COLORS.BOX_BORDER}`,
                  borderRadius: '24px',
                  padding: '12px 24px',
                  fontFamily: 'Korean-Air-Sans-Bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                aria-label="선호도 재설정"
              >
                설정
              </button>
            </div>

            {/* 추천 음식 텍스트 영역 */}
            <textarea
              value={
                result === ''
                  ? '입력 중...'
                  : thisMenu
                  ? `🍽️ 추천 메뉴: ${thisMenu}\n\n${result}`
                  : result
              }
              style={{
                width: 'calc(100% - 24px)',
                height: '200px',
                fontSize: '15px',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '12px',
                fontFamily: 'Korean-Air-Sans-Regular',
                backgroundColor: '#f9f9f9',
                resize: 'none',
                outline: 'none',
              }}
              readOnly
            />
          </div>
        </div>

        {/* 입력된 선호 정보 컨테이너 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '3vw',
            position: 'relative',
            backgroundColor: COLORS.WHITE,
            boxShadow: '0px 0px 25px 0px rgba(0, 0, 0, 0.04)',
            borderRadius: '16px',
            padding: '3vw 4vh 4vh 4vh',
            border: `1px solid ${COLORS.BOX_BORDER}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2vw',
              width: '100%',
            }}
          >
            <CustomText
              text="현재 선호도 설정"
              fontFamily="Korean-Air-Sans-Bold"
              fontSize="1.3rem"
              color={COLORS.BLACK}
            />

            <div
              style={{
                padding: '20px',
                background: '#f2f7ff',
                border: `1px solid ${COLORS.BLUE}`,
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {[
                  { label: '선호 음식', value: foodType },
                  { label: '짠맛', value: salty },
                  { label: '매운맛', value: spicy },
                  { label: '달다', value: sweet },
                  { label: '싱겁다', value: bland },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      minWidth: 0,
                    }}
                  >
                    <CustomText
                      text={item.label}
                      fontSize="13px"
                      color={COLORS.BLUE}
                      fontFamily="Korean-Air-Sans-Regular"
                      style={{ marginBottom: '4px' }}
                    />
                    <CustomText
                      text={item.value}
                      fontSize="15px"
                      fontFamily="Korean-Air-Sans-Bold"
                      color={COLORS.BLACK}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 모달 오픈 상태 렌더링
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '460px',
          background: '#ffffff',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* 제목 & 설명 */}
        <div style={{ marginBottom: '28px' }}>
          <CustomText
            text="선호음식 저장"
            color={COLORS.BLUE}
            fontFamily="Korean-Air-Sans-Bold"
            fontSize="1.5rem"
          />
          <CustomText
            text="선호도 조사 입력 시 AI를 활용한 메뉴 추천을 해드립니다."
            color={COLORS.BLACK}
            fontFamily="Korean-Air-Sans-Regular"
            fontSize="0.9rem"
            style={{ marginTop: '8px', lineHeight: '1.4' }}
          />
        </div>

        {/* 선호 음식 선택 */}
        <div style={{ marginBottom: '24px' }}>
          <CustomText
            text="선호 음식"
            color={COLORS.BLACK}
            fontSize="15px"
            fontFamily="Korean-Air-Sans-Regular"
            style={{ marginBottom: '8px' }}
          />
          <select
            id="food-select"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            style={{
              fontSize: '15px',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              width: '100%',
              backgroundColor: '#f9f9f9',
              outline: 'none',
            }}
          >
            <option value="밥">밥</option>
            <option value="면">면</option>
            <option value="육류">고기</option>
          </select>
        </div>

        {/* 슬라이더 입력 */}
        <div style={{ marginBottom: '24px' }}>
          {[
            { id: 'salty', label: '짠맛', value: salty, setValue: setSalty },
            { id: 'spicy', label: '매운맛', value: spicy, setValue: setSpicy },
            { id: 'sweet', label: '단맛', value: sweet, setValue: setSweet },
            { id: 'bland', label: '싱거움', value: bland, setValue: setBland },
          ].map(({ id, label, value, setValue }) => (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '18px',
                gap: '12px',
              }}
            >
              <CustomText
                text={label}
                color={COLORS.BLACK}
                fontSize="15px"
                fontFamily="Korean-Air-Sans-Regular"
                style={{ width: '70px', textAlign: 'left' }}
              />
              <input
                type="range"
                id={id}
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  appearance: 'none',
                  background: `linear-gradient(to right, ${COLORS.BLUE} ${value}%, #eee ${value}%)`,
                  cursor: 'pointer',
                }}
              />
              <CustomText
                text={`${value}`}
                color={COLORS.BLACK}
                fontSize="14px"
                fontFamily="Korean-Air-Sans-Regular"
                style={{ width: '32px', textAlign: 'right' }}
              />
            </div>
          ))}
        </div>

        {/* 기타 사항 입력 */}
        <div style={{ marginBottom: '32px' }}>
          <CustomText
            text="기타사항"
            color={COLORS.BLACK}
            fontSize="15px"
            fontFamily="Korean-Air-Sans-Regular"
            style={{ marginBottom: '8px' }}
          />
          <input
            type="text"
            id="other"
            placeholder="추가하고 싶은 선호를 입력하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              fontSize: '15px',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              width: 'calc(100% - 24px)',
              backgroundColor: '#f9f9f9',
              outline: 'none',
            }}
          />
        </div>

        {/* 전송 버튼 */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleSend}
            style={{
              background: COLORS.WHITE,
              color: COLORS.BLACK,
              fontSize: '15px',
              fontFamily: 'Korean-Air-Sans-Bold',
              padding: '12px 32px',
              borderRadius: '24px',
              border: `1px solid ${COLORS.BOX_BORDER}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
