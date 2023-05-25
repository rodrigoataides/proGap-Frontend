import axios from 'axios';
import { urlsServices } from '../../configs/urlsConfig';

export const APIResource = axios.create({
  baseURL: urlsServices.BACKENDWS,
});
export const APIAxle = axios.create({
  baseURL: urlsServices.BACKENDWS,
});

export const APIDestination = axios.create({
  baseURL: urlsServices.BACKENDWS,
});

export const APIObjectResource = axios.create({
  baseURL: urlsServices.BACKENDWS,
});

export const APIDeliveryObject = axios.create({
  baseURL: urlsServices.BACKENDWS,
});
export const APIObject = axios.create({
  baseURL: urlsServices.BACKENDWS,
});

export const APINature = axios.create({
  baseURL: urlsServices.BACKENDWS,
});

export const APIModel = axios.create({
  baseURL: urlsServices.BACKENDWS,
});
