import instance from '..';

export const feedbackApi = {
  postFeedbackApi: ({ feedbackType, menuId }) => {
    return instance.post('/feedback', {
      feedbackType,
      menuId,
    });
  },
  getFeedbackApi: (menuId) => {
    return instance.get(`/feedback/${menuId}`);
  },
};
