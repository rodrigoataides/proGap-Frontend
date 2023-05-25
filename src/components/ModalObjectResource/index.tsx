import { Modal, Form, Input, Col, Select, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  getObjectResource,
  postObjectResource,
  updateObjectResource,
} from '../../hooks/objectResourceService';
import { getObject } from '../../hooks/object';
import { getDestinations } from '../../hooks/destinationService';

type Props = {
  id: string;
  idDestination: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};
type ModelObjects = {
  id: string;
  name: string;
};
type ModelDestination = {
  id: string;
  unitId: string;
};
const ModalObjectResource = ({
  id,
  idDestination,
  openModal,
  closeModal,
}: Props) => {
  const [objects, setObjects] = useState<ModelObjects[]>([]);
  const [selectModelId, setSelectedObjectId] = useState('');

  const [destinations, setDestination] = useState<ModelDestination[]>([]);

  const [form] = Form.useForm();
  //Setando id de destinação no formulario para criação de objetos
  useEffect(() => {
    form.setFieldValue('destination', idDestination);
  }, [idDestination]);

  useEffect(() => {
    loadingObjectsResource();
  }, [id]);

  async function loadingObjectsResource() {
    if (id) {
      await getObjectResource(`resourceobjects/${id}`).then(response => {
        if (response !== false) {
          form.setFieldsValue({
            id: response.data.id,
            destination: response.data.destination.unitId,
            objects: response.data.objects.id,
            amount: response.data.amount,
            unitaryValue: response.data.unitaryValue,
            totalValue: response.data.totalValue,
            status: response.data.status,
            progress: response.data.progress,
            balance: response.data.balance,
          });
        } else {
          message.error(
            'Ocorreu um erro inesperado ao obter os objetos do recurso.',
          );
        }
      });
    }
  }

  // listando objeto e destinações
  useEffect(() => {
    loadingObjects();
  }, [objects]);

  async function loadingObjects() {
    const response = await getObject('objects');
    if (response !== false) {
      setObjects(response.data);
    } else {
      message.error('Ocorreu um erro inesperado ao obter os objetos.');
    }
  }

  useEffect(() => {
    loadingObjcResource();
  }, [destinations]);

  async function loadingObjcResource() {
    const response = await getDestinations('destinations');
    if (response !== false) {
      setDestination(response.data);
    } else {
      message.error('Ocorreu um erro inesperado ao obter as destinações.');
    }
  }

  //selec do id de objeto e destino
  function handleSelectObject(value: any) {
    setSelectedObjectId(value); // Atualiza o estado com o ID selecionado
  }

  //ATUALIZAÇÃO DE USUARIOS************
  const submitUpdate = async () => {
    const editingObjectsResource = form.getFieldsValue(true);
    await updateObjectResource(editingObjectsResource, id);
  };

  // CRIAÇÃO DE USUARIOS
  const submitCreate = async () => {
    const editingObjectsResource = form.getFieldsValue(true);
    await postObjectResource(editingObjectsResource);
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
        width={'60%'}
        onCancel={() => {
          form.resetFields();
          closeModal(false);
        }}
        onOk={handleOk}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col span={9}>
              <Form.Item name={['objects']} label="Objeto">
                <Select
                  showSearch
                  placeholder="Selecione o objeto"
                  onChange={value => handleSelectObject(value)}
                  value={selectModelId} // Define o valor do Select com o estado atual de selectTraining
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={objects.map(objects => ({
                    label: objects.name,
                    value: objects.id, // Define o ID do treinamento como valor da opção
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item name={['amount']} label="Quantidade">
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name={['unitaryValue']} label="Valor unitario">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['totalValue']} label="Valor total">
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name={['status']} label="Status">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['progress']} label="Andamento">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['balance']} label="Saldo">
                <Input />
              </Form.Item>
            </Col>
            <Col span={15}>
              <Form.Item name={['destination']} label="Destinação" hidden>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalObjectResource;
