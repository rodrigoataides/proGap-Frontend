import { message } from 'antd';

import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import {
  getResource,
  postResource,
  updateResource,
} from '../../hooks/resourceService';
import { getAxles } from '../../hooks/axleService';

require('./index.css');
type AxlesResponse = {
  id: string;
  name: string;
};
type Props = {
  id: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalResource = ({ id, openModal, closeModal }: Props) => {
  const [axles, setAxles] = useState<AxlesResponse[]>([]);
  const [selectAxlesId, setSelectedAxlesId] = useState('');

  const [form] = Form.useForm();

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

  //Listagem, se tiver id set no formulário
  useEffect(() => {
    loadingResources();
  }, [id]);

  async function loadingResources() {
    await getResource(`resources/${id}`).then(response => {
      if (response !== false) {
        form.setFieldsValue({
          id: response.data?.id,
          axle: response.data?.axle ? response.data.axle.id : null,
          grantor: response.data?.grantor,
          source: response.data?.source,
          type: response.data?.type,
          typeExpense: response.data?.typeExpense,
          resourceNumber: response.data?.resourceNumber,
          processNumber: response.data?.processNumber,
          resourceYear: response.data?.resourceYear,
          commitmentDate: response.data?.commitmentDate,
          deliveryDate: response.data?.deliveryDate,
          settlementDate: response.data?.settlementDate,
        });
      }
    });
  }

  //ATUALIZAÇÃO DE USUARIOS************
  const submitUpdate = async () => {
    const editingResource = form.getFieldsValue(true);
    await updateResource(editingResource, id);
  };

  // CRIAÇÃO DE USUARIOS
  const submitCreate = async () => {
    const editingResource = form.getFieldsValue(true);
    await postResource(editingResource);
  };

  //carregando os eixos
  useEffect(() => {
    loadingAxlesForm();
  }, []);

  async function loadingAxlesForm() {
    const response = await getAxles('axles');
    if (response !== false) {
      setAxles(response.data);
    }
  }
  //selec do id de modelo e natureza
  function handleSelectAxle(value: any) {
    setSelectedAxlesId(value); // Atualiza o estado com o ID selecionado
  }

  return (
    <Modal
      open={openModal}
      title="Recursos"
      width={'66%'}
      okText="Salvar"
      onCancel={() => {
        form.resetFields();
        closeModal(false);
      }}
      onOk={handleOk}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={24}>
          <Col style={{ width: '33.3%' }}>
            <Form.Item name={['type']} label="Tipo">
              <Select
                showSearch
                placeholder={'Selecione o tipo'}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: 'FDD', label: 'FDD' },
                  { value: 'Convênio', label: 'Convênio' },
                  { value: 'Fundo a Fundo', label: 'Fundo a Fundo' },
                  { value: 'Emenda Estadual', label: 'Emenda Estadual' },
                  { value: 'Tesouro Estadual', label: 'Tesouro Estadual' },
                ]}
              />
            </Form.Item>
          </Col>
          {form.getFieldValue(['type']) === 'Fundo a Fundo' && (
            <Col span={8}>
              <Form.Item name={['axle']} label="Eixo">
                <Select
                  showSearch
                  placeholder={'Selecione o tipo'}
                  onChange={value => handleSelectAxle(value)}
                  value={selectAxlesId}
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={axles.map(axle => ({
                    label: axle.name,
                    value: axle.id,
                  }))}
                />
              </Form.Item>
            </Col>
          )}

          {form.getFieldValue(['type']) !== 'Fundo a Fundo' && (
            <Col span={8}>
              <Form.Item name={['grantor']} label="Concedente">
                <Input />
              </Form.Item>
            </Col>
          )}

          <Col span={8}>
            <Form.Item name={['source']} label="Fonte" hasFeedback>
              <Select
                options={[
                  { value: 'Federal', label: 'Federal' },
                  { value: 'Estadual', label: 'Estadual' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name={['typeExpense']} label="Tipo de gasto">
              <Select
                showSearch
                placeholder={'Selecione o tipo'}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: 'Custeio', label: 'Custeio' },
                  { value: 'Investimento', label: 'Investimento' },
                ]}
              />
            </Form.Item>
          </Col>
          {form.getFieldValue(['type']) !== 'Fundo a Fundo' ? (
            <Col span={8}>
              <Form.Item name={['resourceNumber']} label="Número do recurso">
                <Input />
              </Form.Item>
            </Col>
          ) : null}

          <Col span={8}>
            <Form.Item name={['resourceYear']} label="Ano">
              <Input />
            </Form.Item>
          </Col>
          <Col span={form.getFieldValue(['type']) !== 'Fundo a Fundo' ? 6 : 8}>
            <Form.Item
              name={['processNumber']}
              label="Nº processo"
              dependencies={['resourceNumber']}
              style={{ width: '100%' }}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={form.getFieldValue(['type']) !== 'Fundo a Fundo' ? 6 : 8}>
            <Form.Item name={['commitmentDate']} label="Data do empenho">
              <ReactInputMask
                className="input-mask-date"
                placeholder="00/00/0000"
                maskChar={null}
                mask="99/99/9999"
              />
            </Form.Item>
          </Col>
          <Col span={form.getFieldValue(['type']) !== 'Fundo a Fundo' ? 6 : 8}>
            <Form.Item name={['deliveryDate']} label="Data da entrega">
              <ReactInputMask
                className="input-mask-date"
                placeholder="00/00/0000"
                maskChar={null}
                mask="99/99/9999"
              />
            </Form.Item>
          </Col>
          <Col span={form.getFieldValue(['type']) !== 'Fundo a Fundo' ? 6 : 8}>
            <Form.Item name={['settlementDate']} label="Data da liquidação">
              <ReactInputMask
                className="input-mask-date"
                placeholder="00/00/0000"
                maskChar={null}
                mask="99/99/9999"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalResource;
