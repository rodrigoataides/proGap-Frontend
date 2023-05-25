import React from 'react';
import './App.css';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import { AuthProvider } from './contexts/auth/AuthProvider';
import MyRoutes from './components/MyRoutes';

function App() {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: 'rgb(0, 21, 42)',
          colorLink: '#white',
          colorLinkHover: ' rgb(134, 142, 151)',
          borderRadius: 3,
          colorTextHeading: 'rgb(0, 21, 42)',
        },
      }}
    >
      <AuthProvider>
        <MyRoutes />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
