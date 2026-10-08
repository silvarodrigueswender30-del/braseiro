import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { HomePage } from '@/pages/HomePage';
import { ScrollToTopOnRoute } from '@/components/ScrollToTopOnRoute';

// Lazy loading da página de cardápio per Vercel Best Practices
const MenuPage = lazy(() => import('@/pages/MenuPage'));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-[#D9741C] border-t-transparent rounded-full animate-spin" />
      <span className="font-condensed font-bold uppercase tracking-widest text-xs text-[#F2B25A]">
        Carregando cardápio...
      </span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Scroll restore on route / anchor change */}
      <ScrollToTopOnRoute />

      {/* Acessibilidade: Skip Link para leitores de tela e navegação via teclado */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#D9741C] focus:text-[#05070D] focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      <div className="relative min-h-screen flex flex-col bg-[#05070D] site-bg text-[#F3E6D0] selection:bg-[#D9741C] selection:text-[#05070D]">
        {/* Elementos Decorativos Sutis nas Bordas da Tela */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 filter blur-3xl"
            style={{ background: 'radial-gradient(circle, #D9741C 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-15 filter blur-3xl"
            style={{ background: 'radial-gradient(circle, #2E9C9B 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] rounded-full opacity-15 filter blur-3xl"
            style={{ background: 'radial-gradient(circle, #B5561C 0%, transparent 70%)' }}
          />
        </div>

        {/* Header Fixo Global */}
        <Header />

        {/* Rotas */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/cardapio"
            element={
              <Suspense fallback={<PageLoader />}>
                <MenuPage />
              </Suspense>
            }
          />
          {/* Fallback de 404 redirecionando para a Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>

        {/* Rodapé Global */}
        <Footer />

        {/* Botão Flutuante de WhatsApp */}
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
};

export default App;
