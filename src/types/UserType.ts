export type UserType = {
  funcao: string;
  cidade: {
    nome: string;
    id: number;
  };
  unidadesLogadas: [];
  dtExtincao: string;
  unidade: {
    sigla: string;
    corporacaoId: number;
    nome: string;
    id: number;
    corporacao: string;
  };
  login: string;
  deviceId: number;
  tokenIp: string;
  corporacaoOrigem: {
    nome: string;
    id: number;
  };
  unidadesDeTrabalho: [
    {
      corporacaoNome: string;
      unidadeSigla: string;
      funcoes: [
        {
          nome: string;
          id: number;
        },
      ];
      corporacaoSigla: string;
      unidadeNome: string;
      restrita: boolean;
      origem: string;
      unidadeId: number;
      corregedoria: boolean;
      corporacaoId: number;
      ordemMissao: boolean;
    },
  ];
  corporacaoAtual: {
    nome: string;
    id: number;
  };
  cpf: string;
  id: number;
  email: string;
  servidor: {
    cpf: string;
    nome: string;
    id: number;
  };
  administrador: boolean;
  unidadesResponsaveis: [];
  dtCadastro: string;
  nome: string;
  corporacao: string;
  token: string;
  perfis: [
    {
      sistema: {
        id: number;
        descricao: string;
      };
      id: number;
      descricao: string;
    },
  ];
  semPerfilThisSistema: boolean;
  perfisSistemaAtual: string[] | null;
  dtExpiracaoSenha: string;
  tokenCriptografado: boolean;
  departamento: {
    nome: string;
    id: number;
  };
  icon: string;
};
