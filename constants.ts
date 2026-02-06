import { WindowType } from './types';

export const PROFILE_FINISHES = [
  "Aço Corten",
  "Anod. Brilhante",
  "Anod. Bronze 1001",
  "Anod. Bronze 1002",
  "Anod. Bronze 1003",
  "Anod. Bronze 1004",
  "Anod. Champagne",
  "Anod. Fosco 1000",
  "Anod. Inox",
  "Anod. Perita",
  "Anod. Preto 3005",
  "Anod. Vinho",
  "Azul Noturno RAL5022",
  "Branco Brilhante RAL9003",
  "Branco Fosco RAL9003",
  "Branco Fosco RAL9010",
  "Cinza Grafite RAL7024",
  "Cinza Prata RAL7001",
  "Cinza Quartzo RAL7039",
  "Cinza RAL 9007",
  "Cinza Sinalização RAL7043",
  "Madeira",
  "Marrom Chocolate RAL8017",
  "Marrom Escuro RAL8022",
  "Marrom Fosco RAL8014",
  "Natural",
  "Pintura Bronze 1002",
  "Pintura Bronze 1003",
  "Pintura Cerejeira",
  "Pintura Perita",
  "Preto Fosco RAL9005F",
  "Preto Grafite RAL9011",
  "Preto RAL9005",
  "Preto Sinal Ral9004",
  "Texturizado"
];

// Mapping names to HEX colors for preview
export const FINISH_COLORS_MAP: Record<string, { fill: string; stroke: string; code: string }> = {
  "Aço Corten": { fill: "#8D5B3E", stroke: "#5D3A29", code: "#8D5B3E" },
  "Anod. Brilhante": { fill: "#E8E8E8", stroke: "#B0B0B0", code: "#E8E8E8" },
  "Anod. Bronze 1001": { fill: "#CD7F32", stroke: "#8B4513", code: "#CD7F32" },
  "Anod. Bronze 1002": { fill: "#B87333", stroke: "#8B4513", code: "#B87333" },
  "Anod. Bronze 1003": { fill: "#A0522D", stroke: "#5D3A1A", code: "#A0522D" },
  "Anod. Bronze 1004": { fill: "#5D4037", stroke: "#3E2723", code: "#5D4037" },
  "Anod. Champagne": { fill: "#F7E7CE", stroke: "#D2B48C", code: "#F7E7CE" },
  "Anod. Fosco 1000": { fill: "#C0C0C0", stroke: "#808080", code: "#C0C0C0" },
  "Anod. Inox": { fill: "#E0E0E0", stroke: "#999999", code: "#E0E0E0" },
  "Anod. Perita": { fill: "#DCDCDC", stroke: "#A9A9A9", code: "#DCDCDC" },
  "Anod. Preto 3005": { fill: "#1A1A1A", stroke: "#000000", code: "#1A1A1A" },
  "Anod. Vinho": { fill: "#800000", stroke: "#4B0000", code: "#800000" },
  "Azul Noturno RAL5022": { fill: "#24294F", stroke: "#121427", code: "#24294F" },
  "Branco Brilhante RAL9003": { fill: "#FFFFFF", stroke: "#D4D4D4", code: "#FFFFFF" },
  "Branco Fosco RAL9003": { fill: "#FAFAFA", stroke: "#CCCCCC", code: "#FAFAFA" },
  "Branco Fosco RAL9010": { fill: "#FDFDFD", stroke: "#D1D1D1", code: "#FDFDFD" },
  "Cinza Grafite RAL7024": { fill: "#464B50", stroke: "#2C3034", code: "#464B50" },
  "Cinza Prata RAL7001": { fill: "#8F979D", stroke: "#61686D", code: "#8F979D" },
  "Cinza Quartzo RAL7039": { fill: "#6C6960", stroke: "#47453F", code: "#6C6960" },
  "Cinza RAL 9007": { fill: "#878581", stroke: "#595754", code: "#878581" },
  "Cinza Sinalização RAL7043": { fill: "#4E5452", stroke: "#323634", code: "#4E5452" },
  "Madeira": { fill: "#855E42", stroke: "#5C4033", code: "#855E42" },
  "Marrom Chocolate RAL8017": { fill: "#44322D", stroke: "#2B1F1C", code: "#44322D" },
  "Marrom Escuro RAL8022": { fill: "#1B1815", stroke: "#000000", code: "#1B1815" },
  "Marrom Fosco RAL8014": { fill: "#6F4E37", stroke: "#4B3621", code: "#6F4E37" },
  "Natural": { fill: "#D3D3D3", stroke: "#A9A9A9", code: "#D3D3D3" },
  "Pintura Bronze 1002": { fill: "#A0522D", stroke: "#5D3A1A", code: "#A0522D" },
  "Pintura Bronze 1003": { fill: "#8B4513", stroke: "#4A2509", code: "#8B4513" },
  "Pintura Cerejeira": { fill: "#954535", stroke: "#652F24", code: "#954535" },
  "Pintura Perita": { fill: "#DCDCDC", stroke: "#A9A9A9", code: "#DCDCDC" },
  "Preto Fosco RAL9005F": { fill: "#222222", stroke: "#000000", code: "#222222" },
  "Preto Grafite RAL9011": { fill: "#1C1C1C", stroke: "#000000", code: "#1C1C1C" },
  "Preto RAL9005": { fill: "#0A0A0A", stroke: "#000000", code: "#0A0A0A" },
  "Preto Sinal Ral9004": { fill: "#282828", stroke: "#111111", code: "#282828" },
  "Texturizado": { fill: "#666666", stroke: "#444444", code: "#666666" }
};

export const GLASS_COLORS = {
  'Incolor': 'rgba(200, 230, 255, 0.4)',
  'Verde': 'rgba(100, 200, 150, 0.4)',
  'Fumê': 'rgba(50, 50, 50, 0.4)',
};

export const MIN_WIDTH = 400;
export const MAX_WIDTH = 6000; // Increased for large sliding doors
export const MIN_HEIGHT = 400;
export const MAX_HEIGHT = 3000; // Increased for tall doors

export const DEFAULT_CONFIG = {
  productLine: 'Suprema' as const,
  width: 1500,
  height: 1200,
  finish: "Preto RAL9005",
  accessoryColor: "Preto" as const,
  type: WindowType.SLIDING_2_LEAF,
  hasContramarco: false,
  gap: 5,
  hasVeneziana: false,
  hasPersiana: false,
  persianaControl: "Manual" as const,
  glassType: 'Incolor' as const,
  quantity: 1
};

// Simplified pricing logic for estimation
export const calculatePrice = (config: { width: number, height: number, hasVeneziana: boolean, hasPersiana: boolean, persianaControl?: string, hasContramarco: boolean, type: WindowType, productLine: string }) => {
  const area = (config.width * config.height) / 1000000; // m2
  
  // Base Price Logic
  let basePricePerM2 = config.productLine === 'Gold' ? 1200 : 800; // Gold is approx 50% more
  
  const isDoor = config.type.toLowerCase().includes('porta');

  // Doors generally have more robust profiles, adding to cost
  if (isDoor) {
    basePricePerM2 += config.productLine === 'Gold' ? 300 : 150;
  }

  if (config.type === WindowType.MAXIM_AR) basePricePerM2 += 150;
  // 4 Leaf systems (Windows or Doors) are more complex
  if (config.type.includes('4 Folhas')) basePricePerM2 += 300;
  // Hinge doors have specific hardware costs
  if (config.type === WindowType.DOOR_HINGE_1_LEAF) basePricePerM2 += 100;
  if (config.type === WindowType.DOOR_HINGE_2_LEAF) basePricePerM2 += 180;

  let total = area * basePricePerM2;

  // Veneziana Logic (Cost of extra profiles/slats)
  if (config.hasVeneziana) {
      const venezianaCost = config.productLine === 'Gold' ? 500 : 350; // Extra per m2
      total += (area * venezianaCost);
  }

  // Persiana Logic
  if (config.hasPersiana) {
    const persianaCost = config.productLine === 'Gold' ? 1600 : 1200; // Gold components are more expensive
    total += persianaCost * (config.width / 1000); // Cost per linear meter of width
    
    // Add cost for motorization
    if (config.persianaControl === 'Controle Remoto') {
        total += 750;
    } else if (config.persianaControl === 'Interruptor') {
        total += 550;
    }
  }

  // Contramarco Logic
  if (config.hasContramarco) {
    const perimeter = ((config.width + config.height) * 2) / 1000;
    const contramarcoCost = config.productLine === 'Gold' ? 80 : 50;
    total += perimeter * contramarcoCost; 
  }

  return Math.round(total);
};