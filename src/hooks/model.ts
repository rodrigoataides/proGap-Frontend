import { getConfig } from '../configs/sistemaConfig';
import { APIModel } from './baseService/baseService';
import { message } from 'antd';

interface Model {
  name: any;
}
export async function getModel(url: any) {
  try {
    const response = await APIModel.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível obter a lista de modelos, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the model list.${error}`,
    );
  }
  return false;
}

export async function postModel(model: Model) {
  try {
    await APIModel.post('/model', model, getConfig('priv'));
    message.success('modelo cadastrada com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.warning(
        'Não foi possível criar um novo modelo, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error ocourred while creating a new delivery model.${error}`,
    );
  }
}

export const updateModel = async (model: Model, id: any) => {
  try {
    await APIModel.put(`/model/${id}`, model, getConfig('priv'));
    message.success('Modelo atualizado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possivel atualizar o modelo. Tente novamente mais tarde.',
      );
    }
    console.error(
      'error',
      `An unexpected error occurred while updating the Model.${error}`,
    );
  }
};

export async function deleteModel(id: any) {
  try {
    await APIModel.delete(`model/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.error('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(`Não foi possivel deletar o modelo.\n${error}`);
    }
    console.error(error);
  }
}
