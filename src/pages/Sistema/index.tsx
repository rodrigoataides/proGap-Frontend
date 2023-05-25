import {
  PoweroffOutlined,
  EyeOutlined,
  QuestionCircleFilled,
  EyeInvisibleOutlined,
  StarFilled,
} from '@ant-design/icons';
import {
  MenuProps,
  Breadcrumb,
  Layout,
  Menu,
  Space,
  Avatar,
  theme,
  Row,
  ConfigProvider,
  Button,
  Col,
  Popover,
  Modal,
  List,
  Drawer,
  Divider,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Dashboard from '../Dashboard';
import { AuthProvider, useAuth } from '../../contexts/auth/AuthProvider';
import { sistemaDescricao, sistemaNameSSO } from '../../configs/sistemaConfig';
import ptBR from 'antd/lib/locale/pt_BR';
import Title from 'antd/es/typography/Title';
import { menus } from '../../components/Menus';
import { removeParameterUrl } from '../../utils/UtilsSistema';
import Resources from '../Resources';
import Axle from '../Axles';
import Objects from '../Objects';
import Nature from '../Nature';
import Model from '../Model';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const Sistema: React.FC = () => {
  const auth = useAuth();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [unidades, setUnidades] = useState([{ nome: '', codigo: 0 }]);
  const [openModalUnidade, setOpenModalUnidade] = useState(false);
  const [unidade, setUnidade] = useState<{
    nome: string;
    codigo: number;
  } | null>(null);
  const [itemsMenu, setItemsMenu] = useState<MenuItem[]>([]);
  const [visibleSensive, setVisibleSensive] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const [chave, setChave] = useState('1');
  const rotas = (item: any) => {
    setChave(item.key);
  };

  const MontaMenu = () => {
    const items: MenuItem[] = [];
    const rootMenu: string[] = [];
    menus.map(menu => {
      //loop para ver se o perfil do usuario tem permissão para o menu
      let autorizado = false;
      if (auth?.user?.perfisSistemaAtual?.includes('ADM')) {
        autorizado = true;
      } else if (menu.perfis.includes('QUALQUER_PERFIL')) {
        autorizado = true;
      } else {
        auth?.user?.perfisSistemaAtual?.map((perfil: any) => {
          menu.perfis.map(menuPerf => {
            if (perfil == menuPerf) {
              autorizado = true;
            }
          });
        });
      }

      if (autorizado) {
        const itemsChildren: MenuItem[] = [];
        if (menu.children.length > 0) {
          const menuChildren: MenuItem[] = [];
          menu.children.map((child: any) => {
            menuChildren.push(getItem(child.label, child.key, child.icon));
          });
          items.push(getItem(menu.label, menu.key, menu.icon, menuChildren));
        } else {
          items.push(getItem(menu.label, menu.key, menu.icon));
        }
        rootMenu.push(menu.key);
      }
    });
    setItemsMenu(items);
  };

  const getUnidades = () => {
    const unidadex = auth?.user?.unidade;
    const unidadesx = auth?.user?.unidadesDeTrabalho;
    const unidadeN: any = [];
    unidadeN.push({ nome: unidadex?.nome, codigo: unidadex?.id });
    unidadesx?.map((item: any) => {
      if (unidadex?.id !== item.unidadeId) {
        unidadeN.push({ nome: item.unidadeNome, codigo: item.unidadeId });
      }
    });
    setUnidades(unidadeN);

    if (
      localStorage.getItem('localId') &&
      localStorage.getItem('localId') !== '0' &&
      localStorage.getItem('localId') !== ''
    ) {
      setUnidade({
        nome: localStorage.getItem('localNome')!,
        codigo: parseInt(localStorage.getItem('localId')!),
      });
    } else {
      if (unidadex !== undefined) {
        localStorage.setItem('localId', unidadex!.id!.toString());
        localStorage.setItem('localNome', unidadex!.nome!);
        setUnidade({ codigo: unidadex!.id!, nome: unidadex!.nome! });
      } else {
        localStorage.setItem('localId', '0');
        localStorage.setItem('localNome', 'Clique aqui e selecione.');
        /*setUnidade({
          codigo: 0,
          nome: "Clique aqui e selecione.",
        });*/
      }
    }
  };

  const openModalSelectUnidade = () => {
    setOpenModalUnidade(true);
  };

  const onCloseSelectUnidade = () => {
    setOpenModalUnidade(false);
  };

  const setUnidadeClick = (unidade: { nome: string; codigo: number }) => {
    localStorage.setItem('localId', unidade.codigo.toString());
    localStorage.setItem('localNome', unidade.nome);
    setUnidade(unidade);
    setOpenModalUnidade(false);
    window.location.reload();
  };

  const actionDrawer = () => {
    //setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    document.title = sistemaNameSSO;
    getUnidades();
    MontaMenu();
    removeParameterUrl('access_token');
    //setMigalhas([{ title: window.location.pathname }]);
    /*if (window.location.pathname === "/") {
      navitate("/dashboard");
    }*/
  }, [auth]);

  return (
    <ConfigProvider locale={ptBR}>
      <Layout style={{ height: '100vh', width: '100%' }}>
        <Sider
          collapsible
          breakpoint="lg"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
          style={{ backgroundColor: colorBgContainer, height: '100%' }}
        >
          <div className="logo" />
          <Row
            style={{
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'center',
              marginTop: '6px',
              marginBottom: '16px',
            }}
          >
            PCGO
          </Row>
          <Menu
            theme="light"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={itemsMenu}
            onSelect={rotas}
            style={{ height: '83.5%' }}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: 5,
              background: colorBgContainer,
              borderRadius: '0px 0px 10px 10px',
              marginInline: 10,
            }}
          >
            <Row
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <Col span={6}>
                <Row>
                  <Title
                    style={{
                      fontSize: 24,
                      marginTop: -15,
                      fontWeight: 700,
                    }}
                  >
                    {sistemaNameSSO}
                  </Title>
                </Row>
                <Row
                  style={{
                    fontSize: 14,
                    color: '#00000080',
                    marginTop: -10,
                  }}
                >
                  {sistemaDescricao}
                </Row>
              </Col>
              <Col span={10}>
                <Row
                  style={{
                    fontSize: 14,
                    color: '#00000080',
                    paddingLeft: 15,
                  }}
                >
                  Unidade&nbsp;
                  <Popover title="Clique no nome abaixo para trocar de unidade.">
                    <QuestionCircleFilled />
                  </Popover>
                </Row>
                <Row>
                  <Title style={{ fontSize: 18 }}>
                    <Button
                      style={{ color: '#000000', fontWeight: 600 }}
                      type="link"
                      onClick={() => openModalSelectUnidade()}
                    >
                      {unidade?.nome}
                    </Button>
                  </Title>
                </Row>
              </Col>
              <Col
                span={8}
                style={{ display: 'flex', justifyContent: 'right' }}
              >
                <Space>
                  <Avatar
                    src={auth?.user?.icon}
                    style={{ marginRight: 5, marginTop: '-10px' }}
                  >
                    {auth?.user?.nome} - {auth?.user?.funcao}
                  </Avatar>
                  <Col>
                    <Row onClick={() => actionDrawer()} className="click">
                      <strong style={{ marginRight: 5 }}>
                        {auth?.user?.nome}
                      </strong>
                    </Row>
                    {visibleSensive ? (
                      <Row>
                        <Col style={{ fontSize: 12, color: '#00000080' }}>
                          {auth?.user?.cpf} - {auth?.user?.funcao}
                        </Col>
                        <Col style={{ marginTop: -2, paddingLeft: 5 }}>
                          <EyeInvisibleOutlined
                            onClick={() => setVisibleSensive(!visibleSensive)}
                            className="click"
                          />
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col style={{ fontSize: 12, color: '#00000080' }}>
                          *********** - ****************
                        </Col>
                        <Col style={{ marginTop: -2, paddingLeft: 5 }}>
                          <EyeOutlined
                            onClick={() => setVisibleSensive(!visibleSensive)}
                            className="click"
                          />
                        </Col>
                      </Row>
                    )}
                  </Col>
                  <Button
                    shape="circle"
                    icon={
                      <PoweroffOutlined
                        style={{ color: 'red' }}
                        title={'Sair'}
                      />
                    }
                    onClick={auth?.logoutSSO}
                  />
                </Space>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              margin: '5px',
              padding: '10px',
              backgroundColor: 'rgb(255, 255, 255)',
              borderRadius: '10px 10px 0px 0px',
              overflowY: 'auto',
            }}
          >
            <Breadcrumb style={{ margin: '16px 0', color: ' black' }}>
              <Breadcrumb.Item className="menu">
                {
                  {
                    '1': <span>Dashboard</span>,
                    '2': <span>Recursos</span>,
                    '3': <span>Eixos</span>,
                    '4': <span>Objetos</span>,
                    '5': <span>Modelos</span>,
                    '6': <span>Natureza</span>,
                  }[chave]
                }
              </Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 15, minHeight: 360 }}
            >
              <AuthProvider>
                <>
                  {
                    {
                      '1': <Dashboard />,
                      '2': <Resources />,
                      '3': <Axle />,
                      '4': <Objects />,
                      '5': <Model />,
                      '6': <Nature />,
                    }[chave]
                  }
                </>
              </AuthProvider>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            {sistemaNameSSO} ©2023 Divisão de Inovação e Tecnologia
          </Footer>
        </Layout>
      </Layout>
      <Modal
        title={'Escolha uma unidade'}
        open={openModalUnidade}
        footer
        width={600}
        onCancel={onCloseSelectUnidade}
      >
        <List>
          {unidades.map((item, index) => {
            return (
              <List.Item key={index} className="star">
                <Button
                  type="link"
                  onClick={() => setUnidadeClick(item)}
                  style={{ color: '#000000' }}
                >
                  <StarFilled />
                  {item.nome}
                </Button>
              </List.Item>
            );
          })}
        </List>
      </Modal>
      <Drawer
        title="Dados do Usuário"
        placement="right"
        onClose={actionDrawer}
        //open={openDrawer}
      >
        <p style={{ fontSize: 18, fontWeight: 700 }}>{auth?.user?.nome}</p>
        <p>
          {auth?.user?.corporacaoAtual ? auth?.user?.corporacaoAtual.nome : ''}{' '}
          - {auth?.user?.funcao}
        </p>
        <Divider>Unidades</Divider>
        <p>Unidade:</p>
        <p>{auth?.user?.unidade.nome}</p>
        <Divider />
        <p>Unidades de Trabalho:</p>
        <p>&nbsp;</p>
        {auth?.user?.unidadesDeTrabalho.map((unidade: any) => {
          return <p>- {unidade.unidadeNome}</p>;
        })}
        <Divider>Sistemas</Divider>
        <p>
          <strong>Sistema / Perfil</strong>
        </p>
        <p>&nbsp;</p>
        {auth?.user?.perfis.map((perfil: any) => {
          let sistema: JSX.Element | null = null;
          if (perfil.sistema.descricao == sistemaNameSSO) {
            sistema = (
              <p>
                <strong>
                  {perfil.sistema.descricao.toUpperCase()} / {perfil.descricao}
                </strong>
              </p>
            );
          } else {
            sistema = (
              <p>
                {perfil.sistema.descricao.toUpperCase()} / {perfil.descricao}
              </p>
            );
          }
          return sistema;
        })}
      </Drawer>
    </ConfigProvider>
  );
};

export default Sistema;
