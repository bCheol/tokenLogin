import axios from 'axios';
import { userStateStore } from '@/lib/userStateStore';

const api = axios.create({});
  
export default api;

api.interceptors.request.use((request) =>
  {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken != null)
      request.headers.Authorization = 'Bearer ' + accessToken;

    return request;
  }
);

let validation:any = null;

api.interceptors.response.use((response) =>
  {
    return response;
  },
  async (error) => {
    const orgConfig = error.config;

    if (!orgConfig || orgConfig._retry)
      return Promise.reject(error);

    if (error.response?.status !== 401)
      return Promise.reject(error);

    orgConfig._retry = true;

    try {
      if (!validation) {
        validation = axios.post('/api/validation', null, { withCredentials: true })
        .then((response) => {
          const res = response.data;
          if (res.result) {
            localStorage.setItem('accessToken', res.data.accessToken);
            userStateStore.getState().saveState(res.data.accountId, res.data.role, res.data.nickName);
          }
        })
        .finally(() => {
          validation = null;
        });
      }
      await validation;
    } catch (validationError) {
      return Promise.reject(validationError);
    }

    orgConfig.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    return api(orgConfig);
  }
);