import { getConfig } from '../configs/sistemaConfig';
import { APIAxle } from './baseService/baseService';
import { message } from 'antd';

interface Axle {
  name: any;
  description: string;
}

export async function getAxles(url: any) {
  try {
    const response = await APIAxle.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível obter a lista de eixos, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the axle list.${error}`,
    );
  }
  return false;
}

export async function postAxles(axles: Axle) {
  try {
    await APIAxle.post('/axles', axles, getConfig('priv'));
    message.success('Eixos cadastrado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.warning(
        'Não foi possível criar um novo eixo, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error ocourred while creating a new axle.${error}`,
    );
  }
}

export const updateAxles = async (axles: Axle, id: any) => {
  try {
    await APIAxle.put(`/axles/${id}`, axles, getConfig('priv'));
    message.success('Eixo atualizado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possivel atualizar o eixo. Tente novamente mais tarde.',
      );
    }
    console.error(
      'error',
      `An unexpected error occurred while updating the axle.${error}`,
    );
  }
};

export async function deleteaxles(id: any) {
  try {
    await APIAxle.delete(`axles/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.error('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(`Não foi possivel deletar o eixos.\n${error}`);
    }
    console.error(error);
  }
}
