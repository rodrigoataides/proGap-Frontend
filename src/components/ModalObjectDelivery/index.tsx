import {
  Modal,
  Form,
  Input,
  Col,
  Row,
  Table,
  TableColumnsType,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import ReactInputMask from 'react-input-mask';
import {
  deleteDeliveryObject,
  getDeliveryObject,
  postDelivery,
} from '../../hooks/deliveryObject';

interface DataType {
  key: React.Key;
  id: string;
  deliveryDate: string;
  amountDelivery: string;
  observation: string;
}

type Props = {
  idObjectResource: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};
const ModalObjectDelivery = ({
  idObjectResource,
  openModal,
  closeModal,
}: Props) => {
  const [delivery, setDelivery] = useState([]);

  const [form] = Form.useForm();

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Data entrega',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: '15%',
    },
    {
      title: 'Quantidade',
      dataIndex: 'amountDelivery',
      key: 'amountDelivery',
      width: '15%',
    },
    {
      title: 'Observação',
      dataIndex: 'observation',
      key: 'observation',
      width: '63%',
    },
    {
      title: 'Ação',
      key: 'operation',
      render: (record: any) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="Tem certeza de que deseja exluir está entrega?"
              onConfirm={() => ClickDelete(record.id)}
            >
              <DeleteOutlined
                className="icon-delete-phones"
                style={{ color: 'red' }}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  //Listagem de entregas
  useEffect(() => {
    loadingDeliveryForm();
    form.setFieldValue('resourceObjects', idObjectResource);
  }, [idObjectResource]);

  useEffect(() => {
    loadingDeliveryForm();
  }, [delivery]);

  //listando as entregas relacionadas com os objetso do recursos
  async function loadingDeliveryForm() {
    const response = await getDeliveryObject('delivery');
    if (response !== false) {
      const deliveries = response.data
        .flatMap((delivery: any) => delivery.deliveryObjects)
        .filter(
          (delivery: any) => delivery.resourceObjects.id === idObjectResource,
        );
      setDelivery(deliveries);
    } else {
      message.error('Ocorreu um erro inesperado ao obter ás entregas.');
    }
  }

  // Exclusão das entregas
  const ClickDelete = async (record: any) => {
    await deleteDeliveryObject(record);
    const newDelivery = [...delivery];
    newDelivery.splice(record, -1);
    setDelivery(newDelivery);
    loadingDeliveryForm();
  };

  // CRIAÇÃO DE entregas
  const submitCreate = async () => {
    const editingDelivery = form.getFieldsValue(true);
    await postDelivery(editingDelivery);
  };

  const handleCreateDelivery = async () => {
    await submitCreate();
  };

  return (
    <>
      <Modal
        open={openModal}
        title="Entregas"
        okText="Salvar"
        width={'68%'}
        onCancel={() => {
          form.resetFields();
          closeModal(false);
        }}
        onOk={handleCreateDelivery}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col span={5}>
              <Form.Item name={['deliveryDate']} label="Data da entrega">
                <ReactInputMask
                  className="input-mask-date"
                  placeholder="00/00/0000"
                  maskChar={null}
                  mask="99/99/9999"
                />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item name={['amountDelivery']} label="Quantidade">
                <Input />
              </Form.Item>
            </Col>

            <Col span={14}>
              <Form.Item name={['observation']} label="Observação">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['resourceObjects']} label="Objeto" hidden>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={delivery}
          className="custom-table" // Adicione a classe CSS personalizada à tabela
        />
      </Modal>
    </>
  );
};
export default ModalObjectDelivery;
