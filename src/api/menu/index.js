import instance from '..';

export const menuApi = {
  getTodayMenuApi: (weekday) => {
    return instance.get(`/menu/today?weekday=${weekday}`);
  },
  getWeeklyMenuApi: () => {
    return instance.get('/menu/weekly');
  },
  postLikeApi: (menuId) => {
    return instance.post('/menu/like', { menuId: menuId });
  },
  postDislikeApi: (menuId) => {
    return instance.post('/menu/dislike', { menuId: menuId });
  },
  getMenuDetailApi: (menuId) => {
    return instance.get(`/menu/${menuId}`);
  },
};
