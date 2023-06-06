import React, { useEffect, useRef, useState } from 'react';
import {
  Input,
  Button,
  Space,
  Dropdown,
  Popconfirm,
  MenuProps,
  Row,
  InputRef,
  Form,
  message,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { Table } from 'antd';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import Highlighter from 'react-highlight-words';
import { deleteModel, getModel } from '../../hooks/model';
import ModalModel from '../../components/ModalModel';

interface DataType {
  key: React.Key;
  id: string;
  name: string;
}

type DataIndex = keyof DataType;

export default function Model() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [showModal, setShowModal] = useState(false);

  const [model, setModel] = useState([]);
  const [recordModel, setRecordModel] = useState<any>({});

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === '1') {
      setShowModal(true);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      width: '93%',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
    },
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
                    label: 'Alterar',
                    key: '1',
                    onClick: () => {
                      setRecordModel(record);
                    },
                  },
                  {
                    label: (
                      <Popconfirm
                        title="Tem certeza de que deseja desabilitar este registro de modelo ?"
                        onConfirm={() => ClickDeleteModel(record.id)}
                      >
                        Excluir
                      </Popconfirm>
                    ),
                    key: '2',
                    danger: true,
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
      width: '10%',
    },
  ];

  // LISTAGEM DE EIXOS
  useEffect(() => {
    setShowModal(false);
    loadingModelForm();
  }, []);

  useEffect(() => {
    loadingModelForm();
  }, [model]);

  async function loadingModelForm() {
    const response = await getModel('model');
    if (response !== false) {
      setModel(response.data);
    } else {
      message.error('Ocorreu um erro inesperado ao obter os modelos.');
    }
  }
  // Exclusão de modelos
  const ClickDeleteModel = async (record: any) => {
    await deleteModel(record);
    const newModel = [...model];
    newModel.splice(record, -1);
    setModel(newModel);
    loadingModelForm();
  };
  // Fechar modal
  const hideModal = (refresh: boolean) => {
    setShowModal(false);
    setRecordModel(null);
    if (refresh) setModel([]);
  };

  return (
    <>
      <Row style={{ paddingBottom: 'inherit', display: 'flow-root' }}>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ float: 'right', width: 'auto' }}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Criar novo modelo
          </Button>
        </Form.Item>
      </Row>
      <Table
        columns={columns}
        expandable={{
          rowExpandable: record => record.name !== 'Not Expandable',
        }}
        rowKey="name"
        dataSource={model}
        rowClassName={() => 'custom-table-row'} // Defina o nome da classe para o estilo personalizado
        className="custom-table"
      />

      <ModalModel
        id={recordModel?.id}
        openModal={showModal}
        closeModal={hideModal}
      />
    </>
  );
}
