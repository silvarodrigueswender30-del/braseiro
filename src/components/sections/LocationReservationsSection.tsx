import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config';
import {
  MapPin,
  Clock,
  Phone,
  Car,
  Send,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const LocationReservationsSection: React.FC = () => {
  // Estado do formulário de reserva
  const [form, setForm] = useState({
    nome: '',
    data: '',
    horario: '',
    pessoas: '2',
    tipo: 'Mesa comum',
    observacoes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nome.trim()) errs.nome = 'Por favor, informe seu nome completo.';
    if (!form.data) errs.data = 'Selecione uma data para a sua reserva.';
    if (!form.horario) errs.horario = 'Selecione o horário desejado.';
    if (!form.pessoas || Number(form.pessoas) < 1) errs.pessoas = 'Informe o número de pessoas.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const [ano, mes, dia] = form.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    let msg = `Olá! Meu nome é ${form.nome.trim()}, quero reservar para ${form.pessoas} pessoa(s) em ${dataFormatada} às ${form.horario}.`;
    msg += `\nTipo de reserva: ${form.tipo}.`;
    if (form.observacoes.trim()) {
      msg += `\nObservações: ${form.observacoes.trim()}`;
    }

    const url = `https://wa.me/${siteConfig.phoneRaw}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contato-reservas" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Tinta de Seção: Calor Âmbar e Madeira */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 900px 500px at 50% 40%, rgba(217, 116, 28, 0.16), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <SectionLabel>ONDE ESTAMOS & RESERVAS</SectionLabel>
          <h2 className="mt-2 font-condensed font-bold uppercase text-3xl sm:text-5xl text-[#F3E6D0] tracking-wide leading-tight">
            Como chegar e reservas
          </h2>
          <div className="my-4">
            <Divider variant="flame" />
          </div>
          <p className="font-serif italic text-xl sm:text-2xl text-[#F2B25A] font-medium leading-relaxed">
            “Avise antes para prepararmos a melhor mesa ou venha direto sentir o cheiro da lenha.”
          </p>
        </div>

        {/* Grid Principal: Informações + Mapa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-14">
          {/* Coluna Esquerda: Card de Moldura Dupla */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="flex flex-col h-full"
          >
            <Card variant="double" className="h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#D9741C]">
                    LOCALIZAÇÃO & CONTATO
                  </span>
                  <h3 className="mt-1 font-condensed font-bold uppercase text-2xl sm:text-3xl text-[#F3E6D0]">
                    Braseiro Caiçara em Ubatuba
                  </h3>
                </div>

                {/* Lista de Informações Práticas */}
                <div className="space-y-4 pt-2">
                  {/* Endereço */}
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#D9741C] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase font-semibold tracking-wider text-[#F2B25A]/80">
                        Endereço
                      </p>
                      <p className="text-sm font-medium text-[#F3E6D0] mt-0.5">
                        {siteConfig.addressFull}
                      </p>
                    </div>
                  </div>

                  {/* Horário */}
                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-[#F2B25A] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase font-semibold tracking-wider text-[#F2B25A]/80">
                        Horário de Atendimento
                      </p>
                      <p className="text-sm font-medium text-[#F3E6D0] mt-0.5">
                        {siteConfig.hoursShort}
                      </p>
                      <p className="text-xs text-[#F3E6D0]/70 mt-0.5">
                        {siteConfig.hoursDetail.kitchen}
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-[#2E9C9B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase font-semibold tracking-wider text-[#F2B25A]/80">
                        WhatsApp Oficial
                      </p>
                      <p className="text-sm font-medium text-[#F3E6D0] mt-0.5">
                        {siteConfig.phoneDisplay}
                      </p>
                    </div>
                  </div>

                  {/* Estacionamento */}
                  <div className="flex items-start gap-3.5">
                    <Car className="w-5 h-5 text-[#B78A4A] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase font-semibold tracking-wider text-[#F2B25A]/80">
                        Estacionamento & Acesso
                      </p>
                      <p className="text-sm font-medium text-[#F3E6D0] mt-0.5">
                        {siteConfig.parkingInfo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Imediata */}
              <div className="mt-8 pt-6 border-t border-[#F3E6D0]/10 flex flex-col sm:flex-row gap-3">
                <Button
                  as="a"
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="md"
                  className="w-full sm:flex-1 uppercase font-condensed tracking-wider text-sm justify-center"
                >
                  <MapPin className="w-4 h-4 mr-1.5" />
                  <span>Abrir no Maps</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>

                <Button
                  as="a"
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="md"
                  className="w-full sm:flex-1 uppercase font-condensed tracking-wider text-sm justify-center shadow-md"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  <span>Chamar no WhatsApp</span>
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Coluna Direita: Mapa Google Maps em Iframe Estilizado */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="flex flex-col h-full min-h-[380px]"
          >
            <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-[#F2B25A]/30 shadow-2xl bg-[#1A1411]">
              {/* Moldura Interna Delici */}
              <div className="absolute inset-2 rounded-xl border border-[#F2B25A]/20 pointer-events-none z-10" />

              {/* Google Maps Iframe com busca segura e lazy load */}
              {/* NOTA: Substituir a query pelo place ID oficial do Meu Negócio quando o cliente fornecer */}
              <iframe
                title="Localização do Restaurante Braseiro Caiçara no mapa de Ubatuba"
                src="https://maps.google.com/maps?q=Braseiro%20Cai%C3%A7ara%20Ubatuba&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[380px] border-0 grayscale-[40%] contrast-[110%] invert-[90%] hue-rotate-[180deg]"
              />

              <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                <span className="inline-block text-[11px] font-medium text-[#F3E6D0]/90 bg-[#05070D]/85 px-3 py-1 rounded-full border border-[#F3E6D0]/15 backdrop-blur-md">
                  // Localização aproximada em Ubatuba [CONFIRMAR LINK OFICIAL DO MEU NEGÓCIO]
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Formulário de Reserva / Evento */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-6 sm:p-10 border border-[#F2B25A]/30 bg-[rgba(26,20,17,0.75)] backdrop-blur-md shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9741C]">
                PLANEJE SEU MOMENTO
              </span>
              <h3 className="mt-1 font-condensed font-bold uppercase text-2xl sm:text-3xl text-[#F3E6D0]">
                Solicitar Reserva de Mesa ou Evento
              </h3>
              <p className="text-xs sm:text-sm text-[#F3E6D0]/80 mt-1">
                Preencha os dados abaixo. Nós validamos as informações e abrimos o WhatsApp oficial com a mensagem pronta para confirmação imediata.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nome Completo */}
                <div>
                  <label htmlFor="res-nome" className="block text-xs font-semibold uppercase tracking-wider text-[#F2B25A] mb-1.5">
                    Seu Nome Completo *
                  </label>
                  <input
                    id="res-nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Ex: Carlos Silva"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1A1411] border border-[#F3E6D0]/20 text-[#F3E6D0] placeholder-[#F3E6D0]/40 text-sm focus:outline-none focus:border-[#F2B25A] focus:ring-1 focus:ring-[#F2B25A] transition-colors"
                  />
                  {errors.nome && <p className="text-xs text-[#D6232B] mt-1 font-medium">{errors.nome}</p>}
                </div>

                {/* Tipo de Reserva */}
                <div>
                  <label htmlFor="res-tipo" className="block text-xs font-semibold uppercase tracking-wider text-[#F2B25A] mb-1.5">
                    Tipo de Reserva *
                  </label>
                  <select
                    id="res-tipo"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1A1411] border border-[#F3E6D0]/20 text-[#F3E6D0] text-sm focus:outline-none focus:border-[#F2B25A] focus:ring-1 focus:ring-[#F2B25A] transition-colors cursor-pointer"
                  >
                    <option value="Mesa comum">Mesa comum (almoço ou jantar)</option>
                    <option value="Aniversário">Aniversário</option>
                    <option value="Mesa de grupo / Família">Mesa de grupo ou família (8+ pessoas)</option>
                    <option value="Confraternização ou Evento corporativo">Confraternização ou evento corporativo</option>
                    <option value="Outro">Outro formato</option>
                  </select>
                </div>

                {/* Data */}
                <div>
                  <label htmlFor="res-data" className="block text-xs font-semibold uppercase tracking-wider text-[#F2B25A] mb-1.5">
                    Data Desejada *
                  </label>
                  <input
                    id="res-data"
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1A1411] border border-[#F3E6D0]/20 text-[#F3E6D0] text-sm focus:outline-none focus:border-[#F2B25A] focus:ring-1 focus:ring-[#F2B25A] transition-colors cursor-pointer"
                  />
                  {errors.data && <p className="text-xs text-[#D6232B] mt-1 font-medium">{errors.data}</p>}
                </div>

                {/* Horário */}
                <div>
                  <label htmlFor="res-horario" className="block text-xs font-semibold uppercase tracking-wider text-[#F2B25A] mb-1.5">
                    Horário Desejado *
                  </label>
                  <select
                    id="res-horario"
                    value={form.horario}
                    onChange={(e) => setForm({ ...form, horario: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1A1411] border border-[#F3E6D0]/20 text-[#F3E6D0] text-sm focus:outline-none focus:border-[#F2B25A] focus:ring-1 focus:ring-[#F2B25A] transition-colors cursor-pointer"
                  >
                    <option value="">Selecione um horário</option>
                    <option value="12:00">12:00 (Almoço)</option>
                    <option value="13:00">13:00 (Almoço)</option>
                    <option value="14:00">14:00 (Almoço)</option>
                    <option value="19:00">19:00 (Jantar)</option>
                    <option value="20:00">20:00 (Jantar)</option>
                    <option value="21:00">21:00 (Jantar)</option>
                    <option value="22:00">22:00 (Jantar)</option>
                  </select>
                  {errors.horario && <p className="text-xs text-[#D6232B] mt-1 font-medium">{errors.horario}</p>}
                </div>

                {/* Número de Pessoas */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-pessoas" className="block text-xs font-semibold uppercase tracking-wider text-[#F2B25A] mb-1.5">
                    Número de Pessoas *
                  </label>
                  <input
                    id="res-pessoas"
                    type="number"
                    min="1"
                    max="60"
                    value={form.pessoas}
                    onChange={(e) => setForm({ ...form, pessoas: e.target.value })}
                    placeholder="2"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1A1411] border border-[#F3E6D0]/20 text-[#F3E6D0] text-sm focus:outline-none focus:border-[#F2B25A] focus:ring-1 focus:ring-[#F2B25A] transition-colors"
                  />
                  {errors.pessoas && <p className="text-xs text-[#D6232B] mt-1 font-medium">{errors.pessoas}</p>}
                </div>

                {/* Observações */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-obs" className="block text-xs font-semibold uppercase tracking-wider text-[#F2B25A] mb-1.5">
                    Observações ou Preferências (opcional)
                  </label>
                  <textarea
                    id="res-obs"
                    rows={3}
                    value={form.observacoes}
                    onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                    placeholder="Ex: preferência por mesa na área externa, comemoração de aniversário, restrição alimentar..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1A1411] border border-[#F3E6D0]/20 text-[#F3E6D0] placeholder-[#F3E6D0]/40 text-sm focus:outline-none focus:border-[#F2B25A] focus:ring-1 focus:ring-[#F2B25A] transition-colors"
                  />
                </div>
              </div>

              {/* Botão de Enviar */}
              <div className="pt-4 text-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto uppercase font-condensed tracking-wider text-base shadow-[0_4px_25px_rgba(217,116,28,0.45)] cursor-pointer"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Enviar Solicitação pelo WhatsApp</span>
                </Button>
                <p className="mt-2.5 text-xs text-[#F3E6D0]/60">
                  Nenhum dado é armazenado em banco de dados externo. A solicitação é enviada direto para o WhatsApp oficial do restaurante.
                </p>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
