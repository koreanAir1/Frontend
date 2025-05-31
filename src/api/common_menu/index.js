import instance from '..';

export const commonMenuApi = {
  getCommonMenuDetailApi: (weekday) => {
    return instance.get(`/common-menu/by-weekday?weekday=${weekday}`);
  },
};
