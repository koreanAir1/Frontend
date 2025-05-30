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

  // 전송 버튼 클릭 핸들러: 모달 닫기 전 콘솔에 선호도 로그
  const handleSend = () => {
    console.log('선호도 결과:', {
      selectedFood,
      salty,
      spicy,
      sweet,
      bland,
      other,
    });
    setIsOpen(false);
  };

  // 모달이 닫히면 페이지 작성 영역을 표시
  if (!isOpen) {
    return (
      <div
        style={{
          padding: '20px',
          fontWeight: 'bold',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        {/* 제목과 설정 아이콘 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h2
            style={{
              flex: 1,
              fontSize: '18px',
              margin: 0,
              textAlign: 'center',
            }}
          >
            추천 음식
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
            }}
            aria-label="선호도 재설정"
          >
            ⚙️
          </button>
        </div>
        <textarea
          value={pageContent}
          onChange={(e) => setPageContent(e.target.value)}
          placeholder="여기에 추천음식 AI 연동예정"
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
        {/* 입력된 선호 정보 - 한 줄로 표시 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            padding: '16px',
            background: '#f2f7ff',
            border: `1px solid ${KA_BLUE}`,
            borderRadius: '12px',
            width: '100%',
          }}
        >
          {[
            { label: '선호 음식', value: selectedFood },
            { label: '짠맛', value: salty },
            { label: '매운맛', value: spicy },
            { label: '달다', value: sweet },
            { label: '싱겁다', value: bland },
          ].map((item, idx) => (
            <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: KA_BLUE }}>
                {item.label}
              </div>
              <div style={{ fontSize: '16px' }}>{item.value}</div>
            </div>
          ))}
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
        {/* 모달 제목 및 설명 */}
        <h2
          style={{ fontSize: '18px', marginBottom: '8px', textAlign: 'center' }}
        >
          선호음식 저장
        </h2>
        <p
          style={{
            fontSize: '14px',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          선호도 조사 입력 시 AI를 활용한 메뉴 추천을 해드립니다.
        </p>

        {/* 선호 음식 선택 드롭다운 */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="food-select"
            style={{ marginRight: '12px', fontSize: '15px' }}
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
            <option value="육류">고기</option>
            <option value="해산물">고기</option>
          </select>
        </div>

        {/* 슬라이더 컴포넌트 반복 생성 */}
        {[
          { id: 'salty', label: '짠맛', value: salty, setValue: setSalty },
          { id: 'spicy', label: '매운맛', value: spicy, setValue: setSpicy },
          { id: 'sweet', label: '달다', value: sweet, setValue: setSweet },
          { id: 'bland', label: '싱겁다', value: bland, setValue: setBland },
        ].map(({ id, label, value, setValue }) => (
          <div
            key={id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <label htmlFor={id} style={{ width: '80px', fontSize: '15px' }}>
              {label}
            </label>
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
                background: `linear-gradient(to right, ${KA_BLUE} ${value}%, #ccc ${value}%)`,
              }}
            />
            <span
              style={{ width: '40px', textAlign: 'right', fontSize: '15px' }}
            >
              {value}
            </span>
          </div>
        ))}

        {/* 기타 입력 텍스트 박스 */}
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
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
