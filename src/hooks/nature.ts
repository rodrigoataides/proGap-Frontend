import { getConfig } from '../configs/sistemaConfig';
import { APINature } from './baseService/baseService';
import { message, notification } from 'antd';

interface Nature {
  name: any;
}
export async function getNature(url: any) {
  try {
    const response = await APINature.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível obter a lista de naturezas, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the nature list.${error}`,
    );
  }
  return false;
}

export async function postNature(nature: Nature) {
  try {
    await APINature.post('/nature', nature, getConfig('priv'));
    message.success('natureza cadastrada com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.warning(
        'Não foi possível criar uma nova natureza, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error ocourred while creating a new delivery nature.${error}`,
    );
  }
}

export const updateNature = async (nature: Nature, id: any) => {
  try {
    await APINature.put(`/nature/${id}`, nature, getConfig('priv'));
    message.success('Natureza atualizado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possivel atualizar a natureza. Tente novamente mais tarde.',
      );
    }
    console.error(
      'error',
      `An unexpected error occurred while updating the Nature.${error}`,
    );
  }
};

export async function deleteNature(id: any) {
  try {
    await APINature.delete(`nature/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.error('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(`Não foi possivel deletar o objeto.\n${error}`);
    }
    console.error(error);
  }
}
