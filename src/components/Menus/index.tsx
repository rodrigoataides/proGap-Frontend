import {
  DesktopOutlined,
  FolderOutlined,
  PoundOutlined,
  FileTextOutlined,
  ReadOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { perfisSistema } from '../../configs/sistemaConfig';

export const menus = [
  {
    label: 'Dashboard',
    key: '1',
    icon: <DesktopOutlined />,
    link: '/dashboard',
    perfis: [perfisSistema.ALL],
    children: [],
  },
  {
    label: 'Recursos',
    key: '2',
    icon: <FolderOutlined />,
    link: '/resources',
    perfis: [perfisSistema.ALL],
    children: [],
  },
  {
    label: 'Eixos',
    key: '3',
    icon: <PoundOutlined />,
    link: '/axles',
    perfis: [perfisSistema.ALL],
    children: [],
  },
  {
    label: 'Objetos',
    key: '4',
    icon: <GiftOutlined />,
    link: '/objects',
    perfis: [perfisSistema.ALL],
    children: [],
  },
  {
    label: 'Modelos',
    key: '5',
    icon: <FileTextOutlined />,
    link: '/model',
    perfis: [perfisSistema.ALL],
    children: [],
  },
  {
    label: 'Naturezas',
    key: '6',
    icon: <ReadOutlined />,
    link: '/nature',
    perfis: [perfisSistema.ALL],
    children: [],
  },
];
