import React, { useState, useMemo } from 'react';
import { WindowConfig, CartItem } from './types';
import { DEFAULT_CONFIG, calculatePrice } from './constants';
import WindowPreview from './components/WindowPreview';
import Configurator from './components/Configurator';
import { ShoppingCart, X, Trash2, Phone, Mail, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [currentConfig, setCurrentConfig] = useState<WindowConfig>({
    ...DEFAULT_CONFIG,
    id: 'temp-1'
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const currentPrice = useMemo(() => calculatePrice(currentConfig), [currentConfig]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      ...currentConfig,
      id: Date.now().toString(),
      price: currentPrice
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // Construct WhatsApp Message
    let message = "📋 *NOVO PEDIDO - UNIÃO ESQUADRIAS*\n\n";
    
    cart.forEach((item, index) => {
      message += `*Esquadria ${index + 1}:*\n`;
      message += `- Linha: ${item.productLine}\n`;
      message += `- Modelo: ${item.type}\n`;
      message += `- Dimensões: ${item.height}mm (altura) × ${item.width}mm (largura)\n`;
      message += `- Acabamento: ${item.finish}\n`;
      message += `- Vidro: ${item.glassType}\n`;
      message += `- Acessórios: ${item.accessoryColor}\n`;
      
      if (item.hasVeneziana) {
        message += `- Tipo: *Com Veneziana*\n`;
      }

      if (item.hasPersiana) {
         message += `- Persiana: Sim (${item.persianaControl})\n`;
      } else {
         message += `- Persiana: Não\n`;
      }
      
      if (item.hasContramarco) {
        message += `- Contramarco: Sim\n`;
      }
      
      message += `- Valor: R$ ${item.price.toLocaleString('pt-BR')}\n\n`;
    });
    
    message += `-----------------------------------\n`;
    message += `*💰 TOTAL ESTIMADO: R$ ${cartTotal.toLocaleString('pt-BR')}*`;

    const phoneNumber = "553123420005";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    if (typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion(url, cartTotal);
    } else {
      window.open(url, '_blank');
    }

    setIsCartOpen(false);
    setShowOrderSuccess(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-6">
             {/* Logo União Esquadrias Oficial */}
             <div className="relative flex-shrink-0">
                <img 
                  src="https://www.uniaoesquadrias.com.br/assets/logo.png" 
                  alt="União Esquadrias" 
                  className="h-12 w-auto object-contain"
                />
             </div>
             
             {/* Divider & Subtitle */}
             <div className="hidden sm:flex items-center gap-6">
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="flex flex-col justify-center">
                    <span className="text-sm font-bold text-gray-900 leading-none">Orçamento Online</span>
                    <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${currentConfig.productLine === 'Gold' ? 'text-yellow-600' : 'text-blue-600'}`}>
                        Linha {currentConfig.productLine}
                    </p>
                </div>
             </div>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <ShoppingCart className="w-7 h-7 group-hover:text-blue-600 transition-colors" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Preview Area - Sticky on Desktop */}
          <div className="lg:col-span-8 flex flex-col lg:sticky lg:top-24">
             <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
                 <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentConfig.productLine === 'Gold' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                    Visualização em Tempo Real
                 </h3>
                 <div className="text-xs text-gray-400 font-medium">Escala Automática</div>
             </div>
             <div className="flex-1 bg-gray-100 border border-gray-200 rounded-b-xl overflow-hidden relative shadow-inner min-h-[400px] lg:min-h-[500px]">
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                  <WindowPreview config={currentConfig} />
                </div>
             </div>
             
             {/* Specs Summary Bar */}
             <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <div className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm flex flex-col justify-center">
                     <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">Linha</span>
                     <span className={`block font-bold text-sm ${currentConfig.productLine === 'Gold' ? 'text-yellow-600' : 'text-blue-600'}`}>
                        {currentConfig.productLine}
                     </span>
                 </div>
                 <div className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm flex flex-col justify-center">
                     <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">Dimensões</span>
                     <span className="block font-bold text-gray-900 text-sm">{currentConfig.width} x {currentConfig.height}</span>
                 </div>
                 <div className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm flex flex-col justify-center overflow-hidden">
                     <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">Acabamento</span>
                     <span className="block w-full font-bold text-gray-900 text-sm truncate" title={currentConfig.finish}>
                        {currentConfig.finish}
                     </span>
                 </div>
                 <div className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm flex flex-col justify-center overflow-hidden">
                     <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">Modelo</span>
                     <span className="block w-full font-bold text-gray-900 text-sm truncate" title={currentConfig.type}>
                        {currentConfig.type.split('(')[0].trim()}
                     </span>
                 </div>
             </div>
          </div>

          {/* Right: Configurator */}
          <div className="lg:col-span-4 w-full">
            <Configurator 
              config={currentConfig} 
              onChange={setCurrentConfig}
              onAddToCart={handleAddToCart}
              price={currentPrice}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto z-10 relative">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start">
               <span className="text-lg font-bold text-gray-900">União Esquadrias</span>
               <p className="text-sm text-gray-500 mt-1">Soluções premium em alumínio e vidro.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600">
               <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  <span>(31) 2342-0005</span>
               </div>
               <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <span>contato@uniaoesquadrias.com.br</span>
               </div>
               <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  <span>Minas Gerais</span>
               </div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-6 pt-6 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} União Esquadrias. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Cart Sidebar Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="relative w-full bg-white shadow-2xl flex flex-col h-full animate-slide-in">
               
               {/* Cart Header */}
               <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                      <ShoppingCart className="text-blue-600 w-5 h-5" />
                      <h2 className="text-lg font-bold text-gray-900">Seu Orçamento</h2>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
               </div>

               {/* Cart Items */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                 {cart.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400">
                     <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                     <p className="font-medium">Seu carrinho está vazio.</p>
                     <p className="text-sm">Adicione esquadrias para começar.</p>
                   </div>
                 ) : (
                   cart.map((item) => (
                     <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col">
                             <h4 className="font-bold text-gray-900">{item.type}</h4>
                             <span className={`text-xs font-bold uppercase ${item.productLine === 'Gold' ? 'text-yellow-600' : 'text-blue-600'}`}>Linha {item.productLine}</span>
                          </div>
                          <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-sm">R$ {item.price.toLocaleString('pt-BR')}</span>
                       </div>
                       <div className="text-sm text-gray-600 space-y-1 mb-3 mt-2">
                         <div className="flex justify-between">
                            <span>Dimensões:</span>
                            <span className="font-medium">{item.width} x {item.height}mm</span>
                         </div>
                         <div className="flex justify-between">
                            <span>Perfil:</span>
                            <span className="font-medium truncate max-w-[150px]" title={item.finish}>{item.finish}</span>
                         </div>
                         <div className="flex justify-between">
                            <span>Acessórios:</span>
                            <span className="font-medium">{item.accessoryColor}</span>
                         </div>
                         <div className="flex gap-2 flex-wrap mt-2 pt-2 border-t border-gray-100">
                            {item.hasVeneziana && (
                              <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded border border-green-200">
                                Com Veneziana
                              </span>
                            )}
                            {item.hasPersiana && (
                              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-200">
                                Persiana {item.persianaControl}
                              </span>
                            )}
                            {item.hasContramarco && (
                              <span className="text-xs font-semibold bg-gray-100 text-gray-800 px-2 py-1 rounded border border-gray-200">
                                C/ Contramarco
                              </span>
                            )}
                         </div>
                       </div>
                       <button 
                         onClick={() => handleRemoveFromCart(item.id)}
                         className="self-end text-red-500 hover:text-red-700 text-xs font-medium flex items-center space-x-1 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                       >
                         <Trash2 size={14} />
                         <span>Remover Item</span>
                       </button>
                     </div>
                   ))
                 )}
               </div>

               {/* Cart Footer */}
               <div className="border-t border-gray-200 p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                 <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-1">
                   <p>Total Estimado</p>
                   <p className="text-2xl text-blue-700">R$ {cartTotal.toLocaleString('pt-BR')}</p>
                 </div>
                 <p className="text-xs text-gray-400 mb-6 text-right">
                    * Valores sujeitos a alteração sem aviso prévio.
                 </p>
                 <button
                   onClick={handleCheckout}
                   disabled={cart.length === 0}
                   className={`w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white transition-all transform hover:-translate-y-0.5 ${cart.length === 0 ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200'}`}
                 >
                   Solicitar Fabricação via WhatsApp
                 </button>
               </div>

            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showOrderSuccess && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={() => setShowOrderSuccess(false)}></div>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 text-center shadow-2xl transform transition-all scale-100">
               <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Redirecionando...</h3>
               <p className="text-gray-600 mb-8 leading-relaxed">
                   Seu pedido foi gerado no WhatsApp! <br/>
                   Caso a janela não abra, verifique o bloqueador de pop-ups.
               </p>
               <button 
                 onClick={() => setShowOrderSuccess(false)}
                 className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200"
               >
                 Criar Novo Projeto
               </button>
            </div>
         </div>
      )}

    </div>
  );
};

export default App;