import { getConfig } from '../configs/sistemaConfig';
import { APIObject } from './baseService/baseService';
import { message } from 'antd';

interface Objects {
  name: any;
}
export async function getObject(url: any) {
  try {
    const response = await APIObject.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível obter a lista de objetos, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the object list.${error}`,
    );
  }
  return false;
}

export async function postObject(object: Objects) {
  try {
    await APIObject.post('/objects', object, getConfig('priv'));
    message.success('objeto cadastrada com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.warning(
        'Não foi possível criar um novo eixo, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error ocourred while creating a new objects object.${error}`,
    );
  }
}

export const updateObject = async (object: Objects, id: any) => {
  try {
    await APIObject.put(`/objects/${id}`, object, getConfig('priv'));
    message.success('Objeto atualizado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possivel atualizar a entrega. Tente novamente mais tarde.',
      );
    }
    console.error(
      'error',
      `An unexpected error occurred while updating the objects.${error}`,
    );
  }
};

export async function deleteObject(id: any) {
  try {
    await APIObject.delete(`objects/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.error('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(`Não foi possivel deletar o objeto.\n${error}`);
    }
    console.error(error);
  }
}
