export interface ITransacoes {
  metodo_pagamento: number;
  plano: number;
  status: number; 
  data: any;
  createdAt: string;
  updatedAt: string;
}


export interface IInformacoes {
  endereco: any;
  telefone: any;
  cpf: string;
  nascimento: string;
}

export interface ISubscription {
  card_hash?: string;
  envios: number;
  plano_id: number;
  data: any;
  enviosAvulsos: number;
  subscriptionName: string;
  subscriptionType: number;
  subscriptionDate?: string | null;
  subscriptionExpr?: string | null;
}

export interface ICalenderEvents {
  _id?: string;
  title: string;
  start: any;
  end: any;
  eventProps: {
      color: string;
  };
  allDay?: boolean;
}


export interface IRecompensa {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  nivel: number;
  isActive: boolean;
}

export interface IItemObsEnem {
  section?: string | null;
  text: string;
}

export interface IObsEnem {
  color: string;
  nota: number;
  items: IItemObsEnem[]
}

export interface ICompetencias {
  _id?: string;
  title: string;
  nota: number;
  obs: string;
  obs_enem?: IObsEnem | null;
}

export interface ICorrecoes {
  _id: string;
  competencias: ICompetencias[];
  marcacoes: any[];
  msg_rejeicao: string;
  corretor: string;
  createdAt: string;
}

export interface IRedacoes {
  _id: string;
  redacao: {
      url : string;
  }
  nota_final: number;
  in_review: boolean;
  correcoes: ICorrecoes[];
  tema: {title: string};
  type?: number;
  createdAt: string;
}


export interface IUser {
  _id: string
  name: string
  password: string,
  email: string
  image?: string | null
  userType: number
  corretorType: number
  nivel: number
  recompensas: IRecompensa[]
  redacoes: IRedacoes[]
  eventos: ICalenderEvents[]
  subscription: ISubscription
  informacoes: IInformacoes
  transacoes: ITransacoes[]
  createdAt: string;
}

export interface IRecompensa {
  data: string,
  recompensa_id: string,
  isActive: boolean,
}