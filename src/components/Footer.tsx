import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { siteConfig } from '@/config';
import {
  Flame,
  Clock,
  MapPin,
  Phone,
  ArrowUp,
  MessageSquare,
  Send,
  CheckCircle,
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer: React.FC = () => {
  const [newsPhone, setNewsPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsappSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsPhone.trim()) return;
    const msg = `Oi! Gostaria de receber o cardápio atualizado e as novidades do Braseiro Caiçara no WhatsApp (meu número: ${newsPhone}).`;
    window.open(
      `https://wa.me/${siteConfig.phoneRaw}?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
    setSubmitted(true);
  };

  return (
    <footer id="contato" className="relative pt-16 pb-12 overflow-hidden bg-[#05070D]">
      {/* Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 900px 500px at 50% 10%, rgba(217, 116, 28, 0.15), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card Central Delici */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card variant="double" className="text-center">
            <div className="flex flex-col items-center max-w-2xl mx-auto py-2">
              {/* Logo / Nome do Restaurante */}
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-[#D9741C]" />
                <span className="font-condensed font-bold uppercase text-3xl sm:text-4xl tracking-wider text-[#F3E6D0]">
                  {siteConfig.name}
                </span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F2B25A]">
                {siteConfig.tagline}
              </p>

              <div className="my-6 w-full max-w-xs">
                <Divider variant="flame" />
              </div>

              {/* Informações Principais de Contato */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center py-4 border-y border-[#F3E6D0]/10 mb-8">
                {/* Horário */}
                <div className="flex flex-col items-center space-y-1">
                  <Clock className="w-5 h-5 text-[#F2B25A] mb-1" />
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#F2B25A]/80">
                    Horário
                  </span>
                  <p className="text-sm text-[#F3E6D0] font-medium">
                    {siteConfig.hoursShort}
                  </p>
                </div>

                {/* Endereço */}
                <div className="flex flex-col items-center space-y-1">
                  <MapPin className="w-5 h-5 text-[#D9741C] mb-1" />
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#F2B25A]/80">
                    Localização
                  </span>
                  <p className="text-sm text-[#F3E6D0] font-medium">
                    {siteConfig.addressFull}
                  </p>
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col items-center space-y-1">
                  <Phone className="w-5 h-5 text-[#2E9C9B] mb-1" />
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#F2B25A]/80">
                    Atendimento
                  </span>
                  <p className="text-sm text-[#F3E6D0] font-medium">
                    {siteConfig.phoneDisplay}
                  </p>
                </div>
              </div>

              {/* Bloco "Receba o cardápio e novidades no WhatsApp" (Substituto da Newsletter) */}
              <div className="w-full max-w-lg bg-[rgba(5,7,13,0.7)] p-5 sm:p-6 rounded-xl border border-[#F2B25A]/25 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#F2B25A]">
                  <MessageSquare className="w-4 h-4 text-[#2E9C9B]" />
                  <h3 className="font-condensed font-bold uppercase text-lg sm:text-xl tracking-wide text-[#F3E6D0]">
                    Cardápio do Dia & Novidades no WhatsApp
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#F3E6D0]/80 mb-4">
                  Deixe seu número ou clique abaixo para receber peixes do dia, cortes especiais e promoções sazonais direto no seu celular.
                </p>

                {submitted ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-[#2E9C9B] bg-[#2E9C9B]/10 py-3 rounded-lg border border-[#2E9C9B]/30">
                    <CheckCircle className="w-4 h-4" />
                    <span>Abrindo WhatsApp com sua solicitação... Obrigado!</span>
                  </div>
                ) : (
                  <form onSubmit={handleWhatsappSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      placeholder="Seu DDD + WhatsApp (ex: 12 99999-9999)"
                      value={newsPhone}
                      onChange={(e) => setNewsPhone(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[#1A1411] border border-[#F3E6D0]/20 text-[#F3E6D0] placeholder-[#F3E6D0]/40 text-sm focus:outline-none focus:border-[#F2B25A] transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#D9741C] hover:bg-[#F2B25A] text-[#05070D] font-condensed font-bold uppercase text-sm tracking-wider transition-colors inline-flex items-center justify-center gap-2 shadow-md shrink-0 cursor-pointer"
                    >
                      <span>Receber</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Links de Navegação e Redes Sociais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-[#F3E6D0]/10 items-center text-center md:text-left">
          {/* Navegação Rápida */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F2B25A]/70 block mb-3">
              Navegação
            </span>
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-[#F3E6D0]/80">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-[#F2B25A] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F2B25A]/70 block mb-3">
              Conecte-se Conosco
            </span>
            <div className="inline-flex items-center gap-4">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1A1411] border border-[#F3E6D0]/20 flex items-center justify-center text-[#F2B25A] hover:bg-[#D9741C] hover:text-[#05070D] hover:border-[#D9741C] transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1A1411] border border-[#F3E6D0]/20 flex items-center justify-center text-[#D9741C] hover:bg-[#D9741C] hover:text-[#05070D] hover:border-[#D9741C] transition-all duration-300 shadow-sm"
                aria-label="Google Maps"
              >
                <MapPin className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1A1411] border border-[#F3E6D0]/20 flex items-center justify-center text-[#2E9C9B] hover:bg-[#2E9C9B] hover:text-[#05070D] hover:border-[#2E9C9B] transition-all duration-300 shadow-sm"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-2 text-xs text-[#F3E6D0]/60">
              {siteConfig.instagramHandle}
            </p>
          </div>

          {/* Botão Voltar ao Topo */}
          <div className="flex justify-center md:justify-end items-center">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1411] border border-[#F2B25A]/35 text-[#F2B25A] hover:bg-[#F2B25A] hover:text-[#05070D] transition-all duration-300 text-xs font-condensed font-bold uppercase tracking-wider shadow-lg cursor-pointer group"
              title="Voltar ao início da página"
            >
              <span>Voltar ao topo</span>
              <div className="w-6 h-6 rounded-full bg-[#D9741C] text-[#05070D] flex items-center justify-center group-hover:bg-[#05070D] group-hover:text-[#F2B25A] transition-colors">
                <ArrowUp className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Linha Final de Direitos */}
        <div className="pt-6 border-t border-[#F3E6D0]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F3E6D0]/50 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados. Parrilla & Frutos do Mar em Ubatuba, SP.</p>
          <p className="font-serif italic text-[#F2B25A]/70 text-sm">
            “Acende o fogo, senta à mesa.”
          </p>
        </div>
      </div>
    </footer>
  );
};
