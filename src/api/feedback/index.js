import instance from '..';

export const feedbackApi = {
  postFeedbackApi: (menuId) => {
    return instance.post('/feedback', { menuId: menuId });
  },
  getFeedbackApi: (menuId) => {
    return instance.get(`/api/feedback/${menuId}`);
  },
};
