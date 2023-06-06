import { getConfig } from '../configs/sistemaConfig';
import { APIResource } from './baseService/baseService';
import { message, notification } from 'antd';

interface Resource {
  grantor: any;
  source: any;
  type: any;
  typeExpense: any;
  resourceNumber: any;
  resourceYear: any;
  commitmentDate: any;
  deliveryDate: any;
  settlementDate: any;
}

export async function getResource(url: any) {
  try {
    const response = await APIResource.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar o recurso, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the resource list.${error}`,
    );
  }
  return false;
}

export async function postResource(resource: Resource) {
  try {
    await APIResource.post('resources', resource, getConfig('priv'));
    message.success('Recurso cadastrado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.warning('Recurso já cadastrado.');
      console.error(
        `Ocorreu um erro inesperado ao registrar um novo recurso.${error}`,
      );
    }
  }
}

export const updateResource = async (resource: Resource, id: any) => {
  try {
    await APIResource.put(`resources/${id}`, resource, getConfig('priv'));
    message.success('Recurso atualizado com sucesso!');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possivel atualizar o recurso. Tente novamente mais tarde.',
      );
    }
    console.error(
      'error',
      `An unexpected error occurred while updating the resource data.${error}`,
    );
  }
};

export async function deleteResource(id: any) {
  try {
    await APIResource.delete(`resources/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.error('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(`Não foi possivel deletar o usuário.\n${error}`);
    }
    console.error(error);
  }
}
