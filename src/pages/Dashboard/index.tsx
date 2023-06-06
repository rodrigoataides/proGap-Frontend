import { useAuth } from '../../contexts/auth/AuthProvider';
import { Card, Col, Row } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useEffect } from 'react';

import { Bar, Pie } from 'react-chartjs-2';

/*-------------Grafico em barras--------------*/
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Quantidade de Materiais',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const dataBars = {
  labels,
  datasets: [
    {
      label: 'Recursos',
      data: labels.map(() => Math.random() * 1000),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Objetos',
      data: labels.map(() => Math.random() * 1000),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
/*-------------------------------------------------------*/

/*--------------------Grafico em Pizza-------------------*/
export const dataPie = {
  labels: ['Recurso', 'Objetos', 'Modelos', 'Naturezas'],
  datasets: [
    {
      label: '# of Votes',
      data: [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
/*----------------------------------------------------------*/

export default function Dashboard() {
  const auth = useAuth();

  useEffect(() => {
    //validar se o usuario tem o perfil
    //Se houver necessidade de um perfil especifico para a pagina.
    /*if (!auth?.user?.perfisSistemaAtual?.includes(perfisSistema.ADM)){
      if(!auth?.user?.perfisSistemaAtual?.includes(perfisSistema.ATENDENTE)){
        auth?.logoutSSO();
      }
    }*/
    //No meu caso aqui nao é preciso pois a tela é de acesso perfisSistema.ALL
  }, []);

  return (
    <>
      <Row>
        <Col>
          <Card style={{ width: 600 }}>
            <Bar options={options} data={dataBars} />
          </Card>
        </Col>
        <Col>
          <Card style={{ width: 600 }}>
            <Pie data={dataPie} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
