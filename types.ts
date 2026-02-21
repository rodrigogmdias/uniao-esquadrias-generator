export enum WindowType {
  // Janelas
  SLIDING_2_LEAF = 'Janela de Correr (2 Folhas)',
  SLIDING_4_LEAF = 'Janela de Correr (4 Folhas)',
  MAXIM_AR = 'Janela Maxim-ar',
  
  // Portas
  DOOR_SLIDING_2_LEAF = 'Porta de Correr (2 Folhas)',
  DOOR_SLIDING_4_LEAF = 'Porta de Correr (4 Folhas)',
  DOOR_HINGE_1_LEAF = 'Porta de Giro (1 Folha)',
  DOOR_HINGE_2_LEAF = 'Porta de Giro (2 Folhas)'
}

export type AccessoryColor = 'Preto' | 'Branco';
export type PersianaControl = 'Manual' | 'Controle Remoto' | 'Interruptor';
export type ProductLine = 'Suprema' | 'Gold';

export interface WindowConfig {
  id: string;
  productLine: ProductLine; // New attribute
  width: number; // in mm
  height: number; // in mm
  finish: string; // Now a string from the long list
  accessoryColor: AccessoryColor; // New attribute
  type: WindowType;
  hasContramarco: boolean;
  gap: number; // folga in mm
  hasVeneziana: boolean; // New attribute
  hasPersiana: boolean;
  persianaControl: PersianaControl;
  glassType: 'Incolor' | 'Verde' | 'Fumê';
  quantity: number;
}

export interface CartItem extends WindowConfig {
  price: number;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    gtag_report_conversion: (url: string) => boolean;
  }
}
