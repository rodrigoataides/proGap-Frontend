import { Modal, Form, Input, Col, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { getModel } from '../../hooks/model';
import { getObject, postObject, updateObject } from '../../hooks/object';

type Props = {
  id: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

type NatureResponse = {
  id: string;
  name: string;
};
type ModelResponse = {
  id: string;
  name: string;
};

const ModalObject = ({ id, openModal, closeModal }: Props) => {
  const [form] = Form.useForm();

  const [models, setModels] = useState<ModelResponse[]>([]);
  const [selectModelId, setSelectedModelId] = useState('');

  const [natures, setNatures] = useState<NatureResponse[]>([]);
  const [selectNature, setSelectedNatureId] = useState('');

  //carregando os modelos
  useEffect(() => {
    loadingModelForm();
  }, []);

  async function loadingModelForm() {
    const response = await getModel('model');
    if (response !== false) {
      setModels(response.data);
    } else {
      message.error('Ocorreu um erro inesperado ao obter os modelos.');
    }
  }

  //carregando as naturezas
  useEffect(() => {
    loadingNatureForm();
  }, []);

  async function loadingNatureForm() {
    const response = await getModel('nature');
    if (response !== false) {
      setNatures(response.data);
    } else {
      message.error('Ocorreu um erro inesperado ao obter as naturezas.');
    }
  }
  //selec do id de modelo e natureza
  function handleSelectModel(value: any) {
    setSelectedModelId(value); // Atualiza o estado com o ID selecionado
  }
  function handleSelectNature(value: any) {
    setSelectedNatureId(value); // Atualiza o estado com o ID selecionado
  }

  //Listagem, se tiver id set no formulário
  useEffect(() => {
    loadingObjects();
  }, [id]);

  async function loadingObjects() {
    if (id) {
      await getObject(`objects/${id}`).then(response => {
        if (response !== false) {
          form.setFieldsValue({
            id: response.data.id,
            name: response.data.name,
            model: response.data.model.id,
            nature: response.data.nature.id,
          });
        } else {
          message.error('Ocorreu um erro inesperado ao obter os objetos.');
        }
      });
    }
  }
  //ATUALIZAÇÃO DE OBJETOS************
  const submitUpdate = async () => {
    const editingObjects = form.getFieldsValue(true);
    await updateObject(editingObjects, id);
  };

  // CRIAÇÃO DE USUARIOS
  const submitCreate = async () => {
    const editingObjects = form.getFieldsValue(true);
    await postObject(editingObjects);
  };
  const handleOk = (e: any) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        if (id) {
          submitUpdate();
        } else {
          submitCreate();
        }
        form.resetFields();
        closeModal(true);
      })
      .catch(errorInfo => message.error('Erro no preenchimento dos campos.'));
  };

  return (
    <>
      <Modal
        open={openModal}
        title="Objetos"
        okText="Salvar"
        onCancel={() => {
          form.resetFields();
          closeModal(false);
        }}
        onOk={handleOk}
      >
        <Form layout="vertical" form={form}>
          <Col offset={1} span={22}>
            <Form.Item
              name={['name']}
              label="Nome"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o nome do objeto',
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
          </Col>
          <Col offset={1} span={22}>
            <Form.Item
              name={['model']}
              label="Modelo"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o nome do modelo do objeto',
                },
              ]}
              hasFeedback
            >
              <Select
                showSearch
                placeholder="Selecione o modelo"
                onChange={value => handleSelectModel(value)}
                value={selectModelId} // Define o valor do Select com o estado atual de selectTraining
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={models.map(model => ({
                  label: model.name,
                  value: model.id, // Define o ID do treinamento como valor da opção
                }))}
              />
            </Form.Item>
          </Col>
          <Col offset={1} span={22}>
            <Form.Item
              name={['nature']}
              label="Natureza"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o nome da natureza do objeto',
                },
              ]}
              hasFeedback
            >
              <Select
                showSearch
                placeholder="Selecione a natureza"
                onChange={value => handleSelectNature(value)}
                value={selectNature} // Define o valor do Select com o estado atual de selectTraining
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={natures.map(nature => ({
                  label: nature.name,
                  value: nature.id, // Define o ID do treinamento como valor da opção
                }))}
              />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  );
};
export default ModalObject;
