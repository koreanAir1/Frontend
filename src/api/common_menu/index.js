import instance from '..';

export const commonMenuApi = {
  getCommonMenuByWeekdayApi: (today) => {
    return instance.get(`/common-menu/by-weekday?weekday=${today}`);
  },
  getCommonMenuApi: () => {
    return instance.get('/common-menu');
  },
  getCommonMenuDetailApi: (commonMenuId) => {
    return instance.get(`/common-menu/${commonMenuId}`);
  },
};
