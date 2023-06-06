import { sistemaNameSSO } from '../../configs/sistemaConfig';
import { urlsServices } from '../../configs/urlsConfig';
import { useAxiosSSO } from '../../hooks/useAxiosSSO';
import { UserType } from '../../types/UserType';
import { getParameterUrl } from '../../utils/UtilsSistema';

import { createContext, useContext, useState } from 'react';
import AuthUtils from './AuthUtils';
import { message } from 'antd';

export type AuthContextType = {
  user: UserType | null;
  validado: boolean;
  setUserSSO: (us: UserType) => void;
  logoutSSO: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const apiAxios = useAxiosSSO();
  const [user, setUser] = useState<UserType | null>(null);
  const [validado, setValidado] = useState<boolean>(false);

  const validaToken = async (token: string) => {
    await apiAxios
      .validaTokenSSO(token)
      .then((res: { data: any }) => {
        const userValidation = AuthUtils.prepareDataUser(res.data);
        localStorage.setItem('token_sso', userValidation.token);
        setUser(userValidation);
        setValidado(true);
      })
      .catch((err: any) => {
        setUser(null);
        setValidado(false);
        localStorage.removeItem('token_sso');
        message
          .error({
            content:
              'Erro ao tentar validar seu token! Você será redirecionado.',
            duration: 5,
          })
          .then(() => {
            window.location.href = `${
              urlsServices.SSOWS
            }auth?response_type=token_only&client_id=${sistemaNameSSO}&redirect_uri=${encodeURIComponent(
              window.location.href.replace('#', '|').split('/?access_token')[0],
            )}`;
          });
      });
  };

  const setUserSSO = (us: UserType | null) => {
    setUser(us);
  };

  const logoutSSO = async () => {
    await apiAxios.logoutSSO().then((res: any) => {
      setUser(null);
      setValidado(false);
      localStorage.removeItem('token_sso');
    });
  };

  const tokenParam = getParameterUrl('access_token');

  if (
    localStorage.getItem('token_sso') &&
    localStorage.getItem('token_sso') !== '' &&
    localStorage.getItem('token_sso') !== null &&
    localStorage.getItem('token_sso') !== undefined
  ) {
    if (user?.token !== localStorage.getItem('token_sso')!) {
      //validar
      validaToken(localStorage.getItem('token_sso')!);
    }
  } else if (tokenParam) {
    //validar
    validaToken(tokenParam);
  } else {
    window.location.href = `${
      urlsServices.SSOWS
    }auth?response_type=token_only&client_id=${sistemaNameSSO}&redirect_uri=${encodeURIComponent(
      window.location.href.replace('#', '|').split('/?access_token')[0],
    )}`;
  }

  return (
    <AuthContext.Provider value={{ user, validado, setUserSSO, logoutSSO }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
