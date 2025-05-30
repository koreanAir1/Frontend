import { useState } from 'react';

// Recommend 컴포넌트를 정의하는 함수형 컴포넌트
const Recommend = () => {
  // 모달 오픈 상태
  const [isOpen, setIsOpen] = useState(true);
  // 페이지 작성 내용
  const [pageContent, setPageContent] = useState('');

  // 상태 훅: 선택된 음식
  const [selectedFood, setSelectedFood] = useState('밥');
  // 상태 훅: 맛 선호도 (0~100)
  const [salty, setSalty] = useState(50);
  const [spicy, setSpicy] = useState(50);
  const [sweet, setSweet] = useState(50);
  const [bland, setBland] = useState(50);
  // 기타 입력값
  const [other, setOther] = useState('');

  // 브랜드 블루: Korean Air Yale Blue
  const KA_BLUE = '#154D9E';

  // 전송 버튼 클릭 핸들러: 모달 닫기
  const handleSend = () => {
    setIsOpen(false);
  };

  // 모달이 닫히면 페이지 작성 영역을 표시
  if (!isOpen) {
    return (
      <div style={{ padding: '20px', fontWeight: 'bold' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>추천 식당</h2>
        <textarea
          value={pageContent}
          onChange={(e) => setPageContent(e.target.value)}
          placeholder="여기에 추천식당 AI 연동예정"
          style={{
            width: '100%',
            height: '200px',
            fontSize: '15px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '12px',
            fontWeight: 'bold',
          }}
        />
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
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontWeight: 'bold',
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '500px',
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
        }}
      >
        {/* 선호 음식 선택 드롭다운 */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="food-select"
            style={{ marginRight: '25px', fontSize: '15px' }}
          >
            선호 음식
          </label>
          <select
            id="food-select"
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            style={{
              fontSize: '15px',
              padding: '8px',
              borderRadius: '12px',
              border: '1px solid #ccc',
              fontWeight: 'bold',
            }}
          >
            <option value="밥">밥</option>
            <option value="면">면</option>
            <option value="고기">고기</option>
          </select>
        </div>

        {/* 짠맛 슬라이더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <label htmlFor="salty" style={{ width: '80px', fontSize: '15px' }}>
            짠맛
          </label>
          <input
            type="range"
            id="salty"
            min="0"
            max="100"
            value={salty}
            onChange={(e) => setSalty(Number(e.target.value))}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              appearance: 'none',
              background: `linear-gradient(to right, ${KA_BLUE} ${salty}%, #ccc ${salty}%)`,
            }}
          />
          <span style={{ width: '40px', textAlign: 'right', fontSize: '15px' }}>
            {salty}
          </span>
        </div>

        {/* 매운맛 슬라이더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <label htmlFor="spicy" style={{ width: '80px', fontSize: '15px' }}>
            매운맛
          </label>
          <input
            type="range"
            id="spicy"
            min="0"
            max="100"
            value={spicy}
            onChange={(e) => setSpicy(Number(e.target.value))}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              appearance: 'none',
              background: `linear-gradient(to right, ${KA_BLUE} ${spicy}%, #ccc ${spicy}%)`,
            }}
          />
          <span style={{ width: '40px', textAlign: 'right', fontSize: '15px' }}>
            {spicy}
          </span>
        </div>

        {/* 달다 슬라이더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <label htmlFor="sweet" style={{ width: '80px', fontSize: '15px' }}>
            달다
          </label>
          <input
            type="range"
            id="sweet"
            min="0"
            max="100"
            value={sweet}
            onChange={(e) => setSweet(Number(e.target.value))}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              appearance: 'none',
              background: `linear-gradient(to right, ${KA_BLUE} ${sweet}%, #ccc ${sweet}%)`,
            }}
          />
          <span style={{ width: '40px', textAlign: 'right', fontSize: '15px' }}>
            {sweet}
          </span>
        </div>

        {/* 싱겁다 슬라이더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <label htmlFor="bland" style={{ width: '80px', fontSize: '15px' }}>
            싱겁다
          </label>
          <input
            type="range"
            id="bland"
            min="0"
            max="100"
            value={bland}
            onChange={(e) => setBland(Number(e.target.value))}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              appearance: 'none',
              background: `linear-gradient(to right, ${KA_BLUE} ${bland}%, #ccc ${bland}%)`,
            }}
          />
          <span style={{ width: '40px', textAlign: 'right', fontSize: '15px' }}>
            {bland}
          </span>
        </div>

        {/* 기타 입력 텍스트 박스 및 입력 버튼 */}
        <div
          style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}
        >
          <label htmlFor="other" style={{ width: '80px', fontSize: '15px' }}>
            기타사항
          </label>
          <input
            type="text"
            id="other"
            placeholder="추가하고 싶은 선호를 입력하세요"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            style={{
              fontSize: '15px',
              padding: '8px',
              borderRadius: '12px',
              border: '1px solid #ccc',
              flex: 1,
            }}
          />
          <button
            type="button"
            style={{
              marginLeft: '8px',
              fontSize: '15px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
            onClick={() => console.log('기타 입력:', other)}
          >
            입력
          </button>
        </div>

        {/* 전송 버튼: 모달 닫기 */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            style={{
              fontSize: '15px',
              padding: '12px 24px',
              borderRadius: '24px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
            onClick={handleSend}
          >
            결재작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
