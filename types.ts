export enum WindowType {
  SLIDING_2_LEAF = 'Janela de Correr (2 Folhas)',
  SLIDING_4_LEAF = 'Janela de Correr (4 Folhas)',
  MAXIM_AR = 'Maxim-ar'
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
  hasPersiana: boolean;
  persianaControl: PersianaControl;
  glassType: 'Incolor' | 'Verde' | 'Fumê';
  quantity: number;
}

export interface CartItem extends WindowConfig {
  price: number;
}