import instance from '..';
export const recommendApi = {
  postRecommendApi: (data) => {
    return instance.post('/diet-recommendation', data);
  },
};
