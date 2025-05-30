import { useState } from 'react';

// Details 컴포넌트: 피드백 팝업만 표시, 선택된 옵션은 콘솔에 출력
const Details = () => {
  const KA_BLUE = '#154D9E';
  const [open, setOpen] = useState(false);
  const [selections, setSelections] = useState([]);

  const toggleOption = (opt) => {
    setSelections((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  };

  const handleOk = () => {
    console.log('선택된 피드백:', selections);
    setSelections([]);
    setOpen(false);
  };

  const handleCancel = () => {
    setSelections([]);
    setOpen(false);
  };

  const feedbackOptions = [
    '짜다',
    '맵다',
    '달다',
    '양이 적다',
    '양이 많다',
    '맛있다',
  ];

  return (
    <div style={{ padding: 20, fontFamily: 'Korean Air Sans', color: '#333' }}>
      {/* 피드백 팝업 트리거 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: KA_BLUE,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          피드백 하기
        </button>
      </div>

      {/* 피드백 모달 */}
      {open && (
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
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 12,
              width: 320,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 16, color: KA_BLUE }}>
              피드백
            </h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 16,
              }}
            >
              {feedbackOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: selections.includes(opt)
                      ? `1px solid ${KA_BLUE}`
                      : `1px solid #ccc`,
                    background: selections.includes(opt) ? KA_BLUE : '#fff',
                    color: selections.includes(opt) ? '#fff' : '#333',
                    cursor: 'pointer',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            >
              <button
                onClick={handleCancel}
                style={{
                  background: '#f0f0f0',
                  color: '#666',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                onClick={handleOk}
                style={{
                  background: KA_BLUE,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
