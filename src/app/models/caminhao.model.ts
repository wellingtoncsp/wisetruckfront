export interface Caminhao {
  id?: number;
  modelo: string;
  placa: string;
  dataFabricacao: Date | string;
  status: 'Disponível' | 'Em Viagem' | 'Em Manutenção';
}

export interface CaminhaoFiltro {
  modelo?: string;
  placa?: string;
  status?: string;
}

export interface CaminhaoPayload {
  id?: number;
  modelo: string;
  placa: string;
  dataFabricacao: string; // Formato YYYY-MM-DD
  status: 'Disponível' | 'Em Viagem' | 'Em Manutenção';
} 