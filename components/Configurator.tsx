import React from 'react';
import { WindowConfig, WindowType } from '../types';
import { MIN_WIDTH, MAX_WIDTH, MIN_HEIGHT, MAX_HEIGHT, PROFILE_FINISHES, GLASS_COLORS, FINISH_COLORS_MAP } from '../constants';
import { Info, Crown, Layers } from 'lucide-react';

interface ConfiguratorProps {
  config: WindowConfig;
  onChange: (newConfig: WindowConfig) => void;
  onAddToCart: () => void;
  price: number;
}

const Configurator: React.FC<ConfiguratorProps> = ({ config, onChange, onAddToCart, price }) => {

  const handleChange = (field: keyof WindowConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Customização</h2>
        <p className="text-sm text-gray-500">Configure sua esquadria ideal</p>
      </div>

      <div className="space-y-6">

        {/* Product Line Selection */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Linha do Perfil</label>
           <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChange('productLine', 'Suprema')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                  config.productLine === 'Suprema'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                 <Layers size={20} className="mb-1" />
                 <span className="font-bold text-sm">Linha Suprema</span>
                 <span className="text-[10px] opacity-70">25mm - Padrão</span>
              </button>
              
              <button
                onClick={() => handleChange('productLine', 'Gold')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                  config.productLine === 'Gold'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-800 ring-1 ring-yellow-500'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                 <Crown size={20} className="mb-1 text-yellow-600" />
                 <span className="font-bold text-sm">Linha Gold</span>
                 <span className="text-[10px] opacity-70">32mm - Premium</span>
              </button>
           </div>
        </div>
        
        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Largura (mm)</label>
            <input
              type="number"
              min={MIN_WIDTH}
              max={MAX_WIDTH}
              value={config.width}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
            />
            <span className="text-xs text-gray-500">Min: {MIN_WIDTH} / Max: {MAX_WIDTH}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (mm)</label>
            <input
              type="number"
              min={MIN_HEIGHT}
              max={MAX_HEIGHT}
              value={config.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
            />
            <span className="text-xs text-gray-500">Min: {MIN_HEIGHT} / Max: {MAX_HEIGHT}</span>
          </div>
        </div>

        {/* Model Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(WindowType).map((type) => (
              <button
                key={type}
                onClick={() => handleChange('type', type)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  config.type === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-500'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Finishes - Dropdown due to large number of options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Acabamento do Perfil</label>
          <div className="relative">
            <select
                value={config.finish}
                onChange={(e) => handleChange('finish', e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
            >
                {PROFILE_FINISHES.map((finish) => (
                    <option key={finish} value={finish} className="text-gray-900 bg-white">{finish}</option>
                ))}
            </select>
            {/* Color preview circle inside the select box */}
            <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: FINISH_COLORS_MAP[config.finish]?.code || '#FFF' }}
            ></div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Accessories Color - New Attribute */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Cor (Acessórios e Detalhes)</label>
           <div className="flex space-x-4">
              {['Preto', 'Branco'].map((color) => (
                 <label key={color} className={`flex-1 flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-all ${config.accessoryColor === color ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="accessoryColor" 
                      value={color}
                      checked={config.accessoryColor === color}
                      onChange={() => handleChange('accessoryColor', color)}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full border ${color === 'Branco' ? 'bg-white border-gray-300' : 'bg-black border-black'}`}></div>
                        <span className="font-medium text-gray-900">{color}</span>
                    </div>
                 </label>
              ))}
           </div>
        </div>

        {/* Glass Type */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Vidro</label>
           <select 
             className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
             value={config.glassType}
             onChange={(e) => handleChange('glassType', e.target.value)}
            >
               {Object.keys(GLASS_COLORS).map(g => (
                   <option key={g} value={g} className="text-gray-900 bg-white">{g}</option>
               ))}
           </select>
        </div>

        {/* Extras Toggle Section */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
            
            {/* Persiana with Sub-options */}
            <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <label className="flex items-center justify-between cursor-pointer mb-2">
                    <div className="flex items-center space-x-3">
                         <div className={`w-5 h-5 rounded flex items-center justify-center border ${config.hasPersiana ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                            {config.hasPersiana && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                        <span className="font-medium text-gray-700">Persiana Integrada</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={config.hasPersiana}
                        onChange={(e) => handleChange('hasPersiana', e.target.checked)}
                        className="hidden"
                    />
                </label>
                
                {config.hasPersiana && (
                    <div className="ml-8 mt-2 space-y-2">
                         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Acionamento</div>
                         <div className="grid grid-cols-1 gap-2">
                            {(['Manual', 'Controle Remoto', 'Interruptor'] as const).map((opt) => (
                                <label key={opt} className={`flex items-center p-2 rounded border cursor-pointer ${config.persianaControl === opt ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-200 text-gray-600'}`}>
                                    <input 
                                        type="radio" 
                                        name="persianaControl"
                                        value={opt}
                                        checked={config.persianaControl === opt}
                                        onChange={() => handleChange('persianaControl', opt)}
                                        className="hidden"
                                    />
                                    <span className="text-sm font-medium">{opt}</span>
                                </label>
                            ))}
                         </div>
                    </div>
                )}
            </div>

            {/* Contramarco */}
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${config.hasContramarco ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                        {config.hasContramarco && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <span className="font-medium text-gray-700">Incluir Contramarco</span>
                </div>
                <input
                    type="checkbox"
                    checked={config.hasContramarco}
                    onChange={(e) => handleChange('hasContramarco', e.target.checked)}
                    className="hidden"
                />
            </label>
        </div>
        
        {/* Technical Details */}
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
           <div className="flex items-center justify-between mb-2">
               <span>Folga de Instalação:</span>
               <div className="flex items-center space-x-2">
                   <input 
                     type="number" 
                     className="w-16 p-1 text-right border rounded bg-white text-gray-900" 
                     value={config.gap}
                     onChange={(e) => handleChange('gap', Number(e.target.value))}
                   />
                   <span>mm</span>
               </div>
           </div>
           <p className="text-xs text-gray-400 mt-1 flex items-start gap-1">
               <Info size={12} className="mt-0.5" />
               A folga é descontada do tamanho total do vão para fabricação.
           </p>
        </div>

      </div>

      {/* Footer Price & Action */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-end mb-4">
            <span className="text-gray-500 text-sm">Valor estimado</span>
            <span className="text-3xl font-bold text-gray-900">R$ {price.toLocaleString('pt-BR')}</span>
        </div>
        <button
            onClick={onAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <span>Adicionar ao Carrinho</span>
        </button>
      </div>
    </div>
  );
};

export default Configurator;