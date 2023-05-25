import { Modal, Form, Col, Input, message } from 'antd';
import { useEffect } from 'react';
import {
  getDestinations,
  postDestinations,
  updateDestinations,
} from '../../hooks/destinationService';

type Props = {
  id: string;
  idResource: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalDestiny = ({ id, idResource, openModal, closeModal }: Props) => {
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
  //Setando id de recusrso no formulario para criação de destinos
  useEffect(() => {
    form.setFieldValue('resources', idResource);
  }, [idResource]);

  //Listagem, se tiver id set no formulário
  useEffect(() => {
    loadingResources();
  }, [id]);

  async function loadingResources() {
    if (id) {
      await getDestinations(`destinations/${id}`).then(response => {
        if (response !== false) {
          console.log(response.data);
          form.setFieldsValue({
            id: response.data.id,
            resources: response.data.resources.id,
            unitId: response.data.unitId,
            subUnitId: response.data.subUnitId,
          });
        } else {
          message.error('Ocorreu um erro inesperado ao obter os destinos.');
        }
      });
    }
  }
  //ATUALIZAÇÃO DE Destinos************
  const submitUpdate = async () => {
    const editingDestinations = form.getFieldsValue(true);
    await updateDestinations(editingDestinations, id);
  };

  // CRIAÇÃO DE Destinos
  const submitCreate = async () => {
    const editingDestinations = form.getFieldsValue(true);
    await postDestinations(editingDestinations);
  };

  return (
    <>
      <Modal
        open={openModal}
        title="Destinos"
        okText="Salvar"
        onCancel={() => {
          form.resetFields();
          closeModal(false);
        }}
        onOk={handleOk}
      >
        <Form layout="vertical" form={form}>
          <Col offset={1} span={16}>
            <Form.Item name={['resources']} label="Recurso" hidden>
              <Input />
            </Form.Item>
          </Col>
          <Col offset={1} span={22}>
            <Form.Item name={['unitId']} label="Unidade">
              <Input />
            </Form.Item>
          </Col>
          <Col offset={1} span={22}>
            <Form.Item name={['subUnitId']} label="Subunidade">
              <Input />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  );
};
export default ModalDestiny;
