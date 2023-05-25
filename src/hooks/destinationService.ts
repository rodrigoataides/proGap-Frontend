import { getConfig } from '../configs/sistemaConfig';
import { APIDestination } from './baseService/baseService';
import { message } from 'antd';

interface Destinations {
  name: any;
  description: string;
}

export async function getDestinations(url: any) {
  try {
    const response = await APIDestination.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível obter a lista de destinação, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the destinations list.${error}`,
    );
  }
  return false;
}

export async function postDestinations(Destinations: Destinations) {
  try {
    await APIDestination.post('/destinations', Destinations, getConfig('priv'));
    message.success('Destinação cadastrado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.warning(
        'Não foi possível criar uma nova destinação, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error ocourred while creating a new destinations.${error}`,
    );
  }
}

export const updateDestinations = async (
  Destinations: Destinations,
  id: any,
) => {
  try {
    await APIDestination.put(
      `/destinations/${id}`,
      Destinations,
      getConfig('priv'),
    );
    message.success('Destinação atualizado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possivel atualizar a destinação. Tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while updating the destinations.${error}`,
    );
  }
};

export async function deleteDestinations(id: any) {
  try {
    await APIDestination.delete(`destinations/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.error('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(`Não foi possivel deletar a destinação.\n${error}`);
    }
    console.error(error);
  }
}
