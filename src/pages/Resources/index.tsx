import React, { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Form,
  TableColumnsType,
  Space,
  Dropdown,
  Popconfirm,
  MenuProps,
  Input,
  Col,
} from 'antd';
import { Table } from 'antd';
import { DownOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';

import { message } from 'antd';
import { deleteResource, getResource } from '../../hooks/resourceService';
import {
  deleteDestinations,
  getDestinations,
} from '../../hooks/destinationService';
import {
  deleteObjectResource,
  getObjectResource,
} from '../../hooks/objectResourceService';
import ModalResource from '../../components/ModalResource';
import ModalDestiny from '../../components/ModalDestiny';
import ModalObjectResource from '../../components/ModalObjectResource';
import ModalObjectDelivery from '../../components/ModalObjectDelivery';

interface DataType {
  key: React.Key;
  id: string;
  grantor: string;
  source: string;
  type: string;
  typeExpense: string;
  axleId: string;
  resourceNumber: string;
  resourceYear: string;
  processNumber: string;
  commitmentDate: string;
  deliveryDate: string;
  settlementDate: string;
}

interface ExpandedDataType {
  key: React.Key;
  unitId: string;
  subUnitId: string;
  resources: string;
}

interface ExpandedDataTypeObject {
  key: React.Key;
  id: string;
  destination: string;
  objects: string;
  amount: string;
  unitaryValue: string;
  totalValue: string;
  status: string;
  progress: string;
  balance: string;
}

export default function Resources() {
  const [showModal, setShowModal] = useState(false);
  const [modalUnits, setModalDestinations] = useState(false);
  const [modalObjectResource, setModalObjectResourse] = useState(false);
  const [modalObjectDelivery, setModalObjectDelivery] = useState(false);

  const [resources, setResources] = useState<any[]>([]);
  const [recordResource, setRecordResource] = useState<any>({});

  const [destinations, setDestinations] = useState<any[]>([]);
  const [recordDestinations, setRecordDestinations] = useState<any>({});

  const [objectResource, setObjectResource] = useState<any[]>([]);
  const [recordObjectResource, setRecordObjectResource] = useState<any>({});

  const expandedRowRender = (record: any) => {
    //adicionar uma chave única para cada DESTINAÇÃO usando o índice
    const destinyWithKeys = destinations.map((destination, index) => ({
      ...destination,
      key: `destination_${index}`,
    }));
    // filtra os destinos vinculados com um recurso
    const filteredDestinations = destinyWithKeys.filter(
      dest => dest.resources?.id === record.id,
    );

    const columns: TableColumnsType<ExpandedDataType> = [
      { title: 'Unidade', dataIndex: 'unitId', key: 'unitId' },
      { title: 'Subunidade', dataIndex: 'subUnitId', key: 'subUnitId' },
      {
        title: 'Ação',
        key: 'operation',
        render: (record: any) => {
          return (
            <Space size="middle">
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <Popconfirm
                          title="Tem certeza de que desabilitar este unidade ?"
                          onConfirm={() => ClickDeleteDestinaions(record.id)}
                        >
                          Excluir
                        </Popconfirm>
                      ),
                      key: '1',
                      danger: true,
                    },
                    {
                      label: 'Alterar',
                      key: '2',
                      onClick: () => {
                        setRecordDestinations(record);
                      },
                    },
                    {
                      label: (
                        <Space>
                          <PlusOutlined />
                          objeto
                        </Space>
                      ),
                      key: '3',
                      onClick: () => {
                        setRecordDestinations(record);
                      },
                    },
                  ],
                  onClick: handleMenuClickUnits,
                }}
              >
                <a onClick={e => e.preventDefault()} className="option">
                  <Space>
                    Mais
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </Space>
          );
        },
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={filteredDestinations}
        pagination={false}
        expandable={{
          expandedRowRender: expandedRowRenderObject,
        }}
        rowClassName={() => 'custom-table-destiny'} // Defina o nome da classe para o estilo personalizado
      />
    );
  };

  const expandedRowRenderObject = (record: any) => {
    //adicionar uma chave única para cada objetos do recurso usando o índice
    const objectWithKeys = objectResource.map((objectResource, index) => ({
      ...objectResource,
      key: `objectResource_${index}`,
    }));
    // filtra os objetos vinculado com um destino
    const filterObjectResource = objectWithKeys.filter(
      object => object.destination?.id === record.id,
    );
    const columns: TableColumnsType<ExpandedDataTypeObject> = [
      {
        title: 'Objeto',
        dataIndex: 'objects',
        key: 'objects',
        width: '15%',
        render: objects => (objects ? objects?.name : ''),
      },
      { title: 'Quantidade', dataIndex: 'amount', key: 'amount' },
      {
        title: 'Valor Unitário',
        dataIndex: 'unitaryValue',
        key: 'unitaryValue',
      },
      { title: 'Valor Total', dataIndex: 'totalValue', key: 'totalValue' },
      { title: 'Status', dataIndex: 'status', key: 'status', width: '10%' },
      { title: 'Andamento', dataIndex: 'progress', key: 'progress' },
      { title: 'Saldo', dataIndex: 'balance', key: 'balance' },
      {
        title: 'Ação',
        key: 'operation',
        width: '10%',
        render: (record: any) => {
          return (
            <Space size="middle">
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <Popconfirm
                          title="Tem certeza de que deseja desabilitar este objeto ?"
                          onConfirm={() => ClickDeleteObjResource(record.id)}
                        >
                          Excluir
                        </Popconfirm>
                      ),
                      key: '1',
                      danger: true,
                    },
                    {
                      label: 'Alterar',
                      key: '2',
                      onClick: () => {
                        setRecordObjectResource(record);
                      },
                    },
                    {
                      label: (
                        <Space>
                          <PlusOutlined />
                          entrega
                        </Space>
                      ),
                      key: '3',
                      onClick: () => {
                        setRecordObjectResource(record);
                      },
                    },
                  ],
                  onClick: handleMenuObjetc,
                }}
              >
                <a onClick={e => e.preventDefault()} className="option">
                  <Space>
                    Mais
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </Space>
          );
        },
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={filterObjectResource}
        pagination={false}
      />
    );
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Tipo do recurso',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
    },
    {
      title: 'Concedente',
      dataIndex: 'grantor',
      key: 'grantor',
      width: '11%',
      render: (value: any) => value || '*******************',
    },
    {
      title: 'Fonte',
      dataIndex: 'source',
      key: 'source',
      width: '6%',
    },

    {
      title: 'Tipo de gasto',
      dataIndex: 'typeExpense',
      key: 'typeExpense',
      width: '9%',
    },
    {
      title: 'Eixo',
      dataIndex: 'axle',
      key: 'axle',
      width: '6%',
      render: axle => (axle ? axle?.name : '*******'),
    },

    {
      title: 'Número',
      dataIndex: 'resourceNumber',
      key: 'resourceNumber',
      width: '7%',
      render: (value: any) => value || '************',
    },
    {
      title: 'Ano',
      dataIndex: 'resourceYear',
      key: 'resourceYear',
      width: '5%',
    },
    {
      title: 'Nº processo',
      dataIndex: 'processNumber',
      key: 'processNumber',
      width: '7%',
    },
    {
      title: 'Data do empenho',
      dataIndex: 'commitmentDate',
      key: 'commitmentDate',
      width: '10%',
    },
    {
      title: 'Data da entrega',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: '10%',
    },
    {
      title: 'Data da liquidação',
      dataIndex: 'settlementDate',
      key: 'settlementDate',
      width: '10%',
      className: 'custom-column',
    },
    {
      title: 'Ação',
      key: 'operation',
      width: '7%',
      render: (record: any) => {
        return (
          <Space size="middle">
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <Popconfirm
                        title="Tem certeza de que deseja desabilitar este recurso ?"
                        onConfirm={() => ClickDeleteResources(record.id)}
                      >
                        Excluir
                      </Popconfirm>
                    ),
                    key: '1',
                    danger: true,
                  },
                  {
                    label: 'Alterar',
                    key: '2',
                    onClick: () => {
                      setRecordResource(record);
                    },
                  },
                  {
                    label: (
                      <Space style={{ color: ' rgb(0, 21, 42)' }}>
                        <PlusOutlined style={{ color: 'rgb(0, 21, 42)' }} />
                        unidade
                      </Space>
                    ),
                    key: '3',
                    onClick: () => {
                      setRecordResource(record);
                    },
                  },
                ],
                onClick: handleMenuClick,
              }}
            >
              <a onClick={e => e.preventDefault()} className="option">
                <Space>
                  Mais
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  //Parte de alteração recurso, unidades e objetos
  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === '2') {
      setShowModal(true);
    } else if (e.key === '3') {
      setModalDestinations(true);
    }
  };
  const handleMenuClickUnits: MenuProps['onClick'] = e => {
    if (e.key === '2') {
      setModalDestinations(true);
    } else if (e.key === '3') {
      setModalObjectResourse(true);
    }
  };
  const handleMenuObjetc: MenuProps['onClick'] = e => {
    if (e.key === '2') {
      setModalObjectResourse(true);
    } else if (e.key === '3') {
      setModalObjectDelivery(true);
    }
  };

  // LISTAGEM DE RECURSOS
  useEffect(() => {
    setShowModal(false);
    loadingResourceForm();
  }, []);

  useEffect(() => {
    loadingResourceForm();
  }, [resources]);

  async function loadingResourceForm() {
    const response = await getResource('resources');
    if (response !== false) {
      setResources(response.data);
    }
  }
  // Exclusão de recursos
  const ClickDeleteResources = async (record: any) => {
    await deleteResource(record);
    const newObjResource = [...resources];
    newObjResource.splice(record, -1);
    setResources(newObjResource);
    loadingResourceForm();
  };

  // LISTAGEM DE DESTINAÇÃO
  useEffect(() => {
    setShowModal(false);
    loadingDestinyForm();
  }, []);

  useEffect(() => {
    loadingDestinyForm();
  }, [destinations]);

  async function loadingDestinyForm() {
    const response = await getDestinations('destinations');
    if (response !== false) {
      setDestinations(response.data);
    } else {
      message.error('Ocorreu um erro inesperado ao obter as destinações.');
    }
  }
  // Exclusão de destinações
  const ClickDeleteDestinaions = async (record: any) => {
    await deleteDestinations(record);
    const newObjResource = [...destinations];
    newObjResource.splice(record, -1);
    setDestinations(newObjResource);
    loadingDestinyForm();
  };

  // LISTAGEM DE OBJETOS DOS RECURSO
  useEffect(() => {
    setShowModal(false);
    loadingObjectResourceForm();
  }, []);

  useEffect(() => {
    loadingObjectResourceForm();
  }, [objectResource]);

  async function loadingObjectResourceForm() {
    const response = await getObjectResource('resourceobjects');
    console.log(response);
    if (response !== false) {
      setObjectResource(response.data);
    } else {
      message.error(
        'Ocorreu um erro inesperado ao obteros objetos do recurso.',
      );
    }
  }

  // Exclusão de objetos do recurso
  const ClickDeleteObjResource = async (record: any) => {
    await deleteObjectResource(record);
    const newObjResource = [...objectResource];
    newObjResource.splice(record, -1);
    setObjectResource(newObjResource);
    loadingObjectResourceForm();
  };

  // Fechar modal recursos
  const hideModal = (refresh: boolean) => {
    setShowModal(false);
    setRecordResource(null);
    if (refresh) setResources([]);
  };
  // Fechar modal destinações
  const hideModalDestinations = (refresh: boolean) => {
    setModalDestinations(false);
    setRecordDestinations(null);
    if (refresh) setDestinations([]);
  };
  // Fechar modal objetos
  const hideModalObjectResourse = (refresh: boolean) => {
    setModalObjectResourse(false);
    setRecordObjectResource(null);
    if (refresh) setObjectResource([]);
  };
  // Fechar modal entregas
  const hideModalObjectDelivery = (refresh: boolean) => {
    setModalObjectDelivery(false);
  };
  //adiciona uma chave única para cada RECURSO usando o índice
  const resourcesWithKeys = resources.map((resource, index) => ({
    ...resource,
    key: `resource${index}`,
  }));
  return (
    <>
      <Row>
        <Col span={14}>
          <Form.Item>
            <Input />
          </Form.Item>
        </Col>
        <Button>
          <SearchOutlined name="cansulta" type="primary" />
        </Button>
      </Row>

      <Row style={{ paddingBottom: 'inherit', display: 'flow-root' }}>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              float: 'right',
              width: 'auto',
              marginBottom: '-1%',
              marginTop: '-4%',
            }}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Criar novo recurso
          </Button>
        </Form.Item>
      </Row>
      <Table
        rowKey="key"
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ['0'],
        }}
        dataSource={resourcesWithKeys}
        rowClassName={() => 'custom-table-row'} // Defina o nome da classe para o estilo personalizado
        className="custom-table" // Adicione a classe CSS personalizada à tabela
      />

      <ModalResource
        id={recordResource?.id}
        openModal={showModal}
        closeModal={hideModal}
      />
      <ModalDestiny
        id={recordDestinations?.id}
        idResource={recordResource?.id}
        openModal={modalUnits}
        closeModal={hideModalDestinations}
      />
      <ModalObjectResource
        id={recordObjectResource?.id}
        idDestination={recordDestinations?.id}
        openModal={modalObjectResource}
        closeModal={hideModalObjectResourse}
      />
      <ModalObjectDelivery
        idObjectResource={recordObjectResource?.id}
        openModal={modalObjectDelivery}
        closeModal={hideModalObjectDelivery}
      />
    </>
  );
}
