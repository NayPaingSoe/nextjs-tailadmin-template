import axios, { AxiosResponse } from 'axios';
import { store } from '../redux/store';
import { clearToken } from './features/AuthSlice';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setCookie,getCookie } from '@/utils/cookie';

const http = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`,
});

http.interceptors.request.use(
  (config: any) => {
    const state = store.getState();
    const token = state.auth.token;
    console.log("token",token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "multipart/form-data";
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  response => response,
  error => {
    console.log(error);
    if (error.response && error.response.status === 422) {
      return error.response;
    }
    return Promise.reject(error);
  }
);

const ensureToken = async () => {
  const res = await getCookie('userInfo');
  const response = res ? JSON.parse(res) : null;
  if (response?.status === 200) {
    const userInfo = response.data.userData;
    const token = userInfo.token;

    if (!token) {
      throw new Error('Token not available');
    }
    return token;
  } else {
    throw new Error('Token not available');
  }
};

export const login = async (uri: string, data: any) => {
  try {
    const response: AxiosResponse<any> = await http.post(uri, data);
    const apiFormData = new FormData();
    const admin = response.data.admin;
    apiFormData.append('token', response.data.token);
    apiFormData.append('id', admin.id);
    apiFormData.append('name', admin.name);
    apiFormData.append('email', admin.email);

    setCookie('userInfo', apiFormData);
    return response;
  } catch (error: any) {
    if (error.status === 422) {
      return error;
    }
    throw error;
  }
};

export const fetchDataWithToken = async (uri: string) => {
  try {
    // await ensureToken();
    const response = await http.get(uri);
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data;
  }
};

export const postDataWithToken = async (uri: string,  data: any) => {
  try {
    await ensureToken();
    const response = await http.post(uri,data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await http.post('/admin/logout');
      dispatch(clearToken());
      router.push('/login');
    } catch (error: any) {
      console.error('Logout failed', error);
    }
  };

  return logout;
};

export default { http, login, fetchDataWithToken, postDataWithToken };
