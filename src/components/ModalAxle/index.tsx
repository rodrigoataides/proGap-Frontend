import { Modal, Form, Input, Col, message } from 'antd';
import { useEffect } from 'react';
import { getAxles, postAxles, updateAxles } from '../../hooks/axleService';

type Props = {
  id: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalAxle = ({ id, openModal, closeModal }: Props) => {
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
    loadingAxles();
  }, [id]);

  async function loadingAxles() {
    if (id) {
      await getAxles(`axles/${id}`).then(response => {
        if (response !== false) {
          form.setFieldsValue({
            id: response.data.id,
            name: response.data.name,
            description: response.data.description,
          });
        } else {
          message.error('Ocorreu um erro inesperado ao obter os eixos.');
        }
      });
    }
  }
  //ATUALIZAÇÃO DE USUARIOS************
  const submitUpdate = async () => {
    const editingAxle = form.getFieldsValue(true);
    await updateAxles(editingAxle, id);
  };

  // CRIAÇÃO DE USUARIOS
  const submitCreate = async () => {
    const editingAxle = form.getFieldsValue(true);
    await postAxles(editingAxle);
  };
  return (
    <>
      <Modal
        open={openModal}
        title="Eixos"
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
          <Col offset={1} span={22}>
            <Form.Item
              name={['description']}
              label="Descrição"
              rules={[
                {
                  required: true,
                  message: 'Por favor, uma descrição',
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
export default ModalAxle;
