import { getConfig } from '../configs/sistemaConfig';
import { urlsServices } from '../configs/urlsConfig';
import axios from 'axios';

const api = axios.create({
  baseURL: urlsServices.SSOWS,
  //withCredentials: true,
});

export const useAxiosSSO = () => ({
  validaTokenSSO: async (token: string) => {
    const response = await api.get(`validate?token=${token}`, getConfig('pub'));
    return response;
  },
  logoutSSO: async () => {
    const response = await api.get(
      `/logout?token=${localStorage.getItem('token_sso')}`,
      getConfig('pub'),
    );
    return response;
  },
});
