import { sistemaNameSSO } from '../configs/sistemaConfig';
import { urlsServices } from '../configs/urlsConfig';

export const getParameterUrl = (qParm: string) => {
  return window.location.href.split(qParm)[1]
    ? decodeURIComponent(window.location.href.split(qParm)[1])
        .replace('=', '')
        .replace('&', '')
        .split(`/?${qParm}`)[0]
    : false;
};

export const removeParameterUrl = (qParm: string) => {
  let url = window.location.href;
  const urlparts = url.split('?');
  if (urlparts.length >= 2) {
    const urlBase = urlparts.shift();
    const queryString = urlparts.join('?');
    const prefix = encodeURIComponent(qParm) + '=';
    const pars = queryString.split(/[&;]/g);
    for (let i = pars.length; i-- > 0; )
      if (pars[i].lastIndexOf(prefix, 0) !== -1) pars.splice(i, 1);
    url = urlBase + '?' + pars.join('&');
    if (url.slice(-1) === '?') url = url.substr(0, url.length - 1);
    window.history.replaceState({}, '', url);
  }
};

const utf8_to_b64 = (str: string) => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

const b64_to_utf8 = (str: string) => {
  return decodeURIComponent(escape(window.atob(str)));
};

const reverseString = (str = '') => {
  return str.split('').reverse().join('');
};

export const getEncodeAvatarUsuario = function (
  cpf: string,
  size: string | null,
) {
  return reverseString(
    utf8_to_b64(
      reverseString(
        utf8_to_b64(cpf + '_' + new Date().getTime() + (size ? size : '_80')),
      ),
    ),
  );
};

export const getUrlLogin = () => {
  return `${
    urlsServices.SSOWS
  }auth?response_type=token_only&client_id=${sistemaNameSSO}&redirect_uri=${encodeURIComponent(
    window.location.href.replace('#', '|'),
  )}`;
};
