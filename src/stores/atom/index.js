import { atom, atomFamily } from 'recoil';

// 좋아요 상태 (true/false)
export const likeAtomFamily = atomFamily({
  key: 'likeAtomFamily',
  default: false,
});

// 좋아요 개수 (단순화된 키 사용)
export const likeCountAtomFamily = atomFamily({
  key: 'likeCountAtomFamily',
  default: 0, // 초기값은 컴포넌트에서 설정
});
