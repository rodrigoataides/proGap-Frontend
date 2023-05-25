import { Modal, Form, Input, Col, message } from 'antd';
import { useEffect } from 'react';
import { getNature, postNature, updateNature } from '../../hooks/nature';

type Props = {
  id: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalNature = ({ id, openModal, closeModal }: Props) => {
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
    loadingNature();
  }, [id]);

  async function loadingNature() {
    if (id) {
      await getNature(`nature/${id}`).then(response => {
        if (response !== false) {
          form.setFieldsValue({
            id: response.data.id,
            name: response.data.name,
          });
        } else {
          message.error('Ocorreu um erro inesperado ao obter as naturezas.');
        }
      });
    }
  }
  //ATUALIZAÇÃO DE USUARIOS************
  const submitUpdate = async () => {
    const editingNature = form.getFieldsValue(true);
    await updateNature(editingNature, id);
  };

  // CRIAÇÃO DE USUARIOS
  const submitCreate = async () => {
    const editingNature = form.getFieldsValue(true);
    await postNature(editingNature);
  };
  return (
    <>
      <Modal
        open={openModal}
        title="Natureza"
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
                  message: 'Por favor, insira o nome do curso',
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  );
};
export default ModalNature;
