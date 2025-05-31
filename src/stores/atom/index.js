import { atom, atomFamily } from 'recoil';
export const likeInfoAtomFamily = atomFamily({
  key: 'likeInfoAtomFamily',
  default: (id) => ({
    id: id,
    liked: false,
    count: 0,
  }),
});

export const allIdsAtom = atom({
  key: 'allIdsAtom',
  default: [],
});

export const feedbackDoneAtom = atom({
  key: 'feedbackDoneAtom',
  default: false,
});
