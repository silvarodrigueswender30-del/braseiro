import React, { useState, useEffect, useRef, useId } from 'react';
import { Calendar, Clock, Users, Baby, Check, ChevronRight, ChevronLeft, X, ShoppingBag, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/config';

export interface ReservaTriagemProps {
  variant: 'inline' | 'sheet';
  isOpen?: boolean;
  onClose?: () => void;
  initialOcasiao?: string;
  className?: string;
}

export const OCASIOES = [
  'Sem ocasião',
  'Aniversário',
  'Comemoração',
  'Família',
  'Amigos',
  'Trabalho',
] as const;

export type OcasiaoTipo = (typeof OCASIOES)[number];

export const ReservaTriagem: React.FC<ReservaTriagemProps> = ({
  variant,
  isOpen = false,
  onClose,
  initialOcasiao,
  className = '',
}) => {
  const isSheet = variant === 'sheet';
  const idPrefix = useId();

  // 1. Estados da Reserva
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<string>(() => {
    // Data default: hoje em YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [horario, setHorario] = useState<string>('19:30');
  const [pessoas, setPessoas] = useState<number>(2);
  const [criancas, setCriancas] = useState<number>(0);
  const [cadeirao, setCadeirao] = useState<boolean>(false);
  const [ocasiao, setOcasiao] = useState<string>(initialOcasiao || 'Sem ocasião');
  const [ficarJuntos, setFicarJuntos] = useState<boolean>(false);
  const [area, setArea] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  // 2. Feedback e Envio
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [generatedWaUrl, setGeneratedWaUrl] = useState<string>('');
  const [popupBlocked, setPopupBlocked] = useState<boolean>(false);

  // Refs de acessibilidade
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const nomeInputRef = useRef<HTMLInputElement>(null);

  // Atualiza ocasião inicial se repassada
  useEffect(() => {
    if (initialOcasiao) {
      setOcasiao(initialOcasiao);
    }
  }, [initialOcasiao]);

  // Bloqueio de scroll do body e Focus Trap quando sheet estiver aberta
  useEffect(() => {
    if (!isSheet) return;

    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      // Foco inicial
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose?.();
        } else if (e.key === 'Tab') {
          // Focus trap
          if (!dialogRef.current) return;
          const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        previousActiveElementRef.current?.focus();
      };
    }
  }, [isSheet, isOpen, onClose]);

  // Formatação de data em extenso em pt-BR
  const getDataExtenso = (dataStr: string): string => {
    if (!dataStr) return '';
    try {
      const [ano, mes, dia] = dataStr.split('-').map(Number);
      const d = new Date(ano, mes - 1, dia);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      return d.toLocaleDateString('pt-BR', options);
    } catch {
      return dataStr;
    }
  };

  const getDataFormatada = (dataStr: string): string => {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Montagem da mensagem oficial WhatsApp
  const buildWhatsAppMessage = (): string => {
    const dataFormatada = getDataFormatada(data);
    const dataExtenso = getDataExtenso(data);
    const diaSemana = dataExtenso.split(',')[0] || '';

    const lines: string[] = [
      'Olá! Gostaria de reservar uma mesa no Braseiro Caiçara.',
      `Nome: ${nome.trim()}`,
      `Data: ${diaSemana ? `${diaSemana}, ` : ''}${dataFormatada}`,
      `Horário: ${horario}`,
    ];

    if (criancas > 0) {
      lines.push(`Pessoas: ${pessoas} (${criancas} ${criancas === 1 ? 'criança' : 'crianças'})`);
    } else {
      lines.push(`Pessoas: ${pessoas}`);
    }

    if (cadeirao && criancas > 0) {
      lines.push('Cadeirão: sim');
    }

    if (ocasiao && ocasiao !== 'Sem ocasião') {
      lines.push(`Ocasião: ${ocasiao}`);
    }

    if (ficarJuntos && pessoas >= 8) {
      lines.push('Preferência: Preferimos ficar juntos');
    }

    if (area && siteConfig.reservationAreas?.length > 0) {
      lines.push(`Área: ${area}`);
    }

    if (observacoes.trim()) {
      lines.push(`Observações: ${observacoes.trim()}`);
    }

    lines.push('Pode confirmar, por favor?');
    return lines.join('\n');
  };

  // Validação dos passos
  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (s === 1) {
      if (!data) newErrors.data = 'Selecione a data da reserva';
      if (!horario) newErrors.horario = 'Selecione o horário';
    } else if (s === 2) {
      if (pessoas < 1) newErrors.pessoas = 'Selecione ao menos 1 pessoa';
      if (criancas >= pessoas) newErrors.criancas = 'O número de crianças deve ser menor que o total de pessoas';
    } else if (s === 3) {
      if (!nome.trim() || nome.trim().length < 2) {
        newErrors.nome = 'Informe seu nome completo';
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      const firstError = Object.values(newErrors)[0];
      setLiveAnnouncement(firstError);
    }
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      if (step === 1) {
        setStep(2);
        setLiveAnnouncement('Passo 2 de 3: Selecione o número de pessoas e ocasião.');
      } else if (step === 2) {
        setStep(3);
        setLiveAnnouncement('Passo 3 de 3: Preencha seu nome e confira o resumo.');
        setTimeout(() => nomeInputRef.current?.focus(), 50);
      }
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
      setLiveAnnouncement(`Retornou ao passo ${step - 1} de 3.`);
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const rawPhone = siteConfig.phoneRaw?.replace(/\D/g, '') || '';
    if (!rawPhone || rawPhone.includes('99999')) {
      setErrors({ phone: 'Número de WhatsApp temporariamente indisponível' });
      return;
    }

    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
    setGeneratedWaUrl(url);

    try {
      const win = window.open(url, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        setPopupBlocked(true);
      }
    } catch {
      setPopupBlocked(true);
    }

    setIsSubmitted(true);
    setLiveAnnouncement('Reserva pronta: abrindo o WhatsApp.');
  };

  const handleReset = () => {
    setStep(1);
    setIsSubmitted(false);
    setPopupBlocked(false);
    setNome('');
    setObservacoes('');
    setPessoas(2);
    setCriancas(0);
    setCadeirao(false);
    setOcasiao(initialOcasiao || 'Sem ocasião');
    setFicarJuntos(false);
    setErrors({});
  };

  const isPhoneValid = Boolean(
    siteConfig.phoneRaw &&
    !siteConfig.phoneRaw.includes('99999') &&
    siteConfig.phoneRaw.trim().length >= 10
  );

  const todayMin = new Date().toISOString().split('T')[0];

  // ==========================================
  // RENDERIZAÇÃO INTERNA DO FORMULÁRIO (COMPARTILHADA)
  // ==========================================
  const formContent = (
    <div className="w-full">
      {/* Região acessível live para erros e navegação */}
      <div className="sr-only" aria-live="polite" role="status">
        {liveAnnouncement}
      </div>

      {isSubmitted ? (
        // TELA DE CONFIRMAÇÃO PÓS-ENVIO
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#E8832A]/20 text-[#E8832A] flex items-center justify-center mb-4">
            <Check className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#F5E6D0]">
            Abrimos o WhatsApp com os dados da sua reserva!
          </h3>
          <p className="mt-2 text-sm text-[#F5E6D0]/80 max-w-md leading-relaxed">
            Basta enviar a mensagem pronta para nossa equipe.
          </p>

          <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-[#E8832A] bg-[#E8832A]/10 px-4 py-2 rounded-full border border-[#E8832A]/20">
            A reserva só vale depois da confirmação do restaurante.
          </p>

          {popupBlocked && (
            <div className="mt-4 p-3 rounded bg-[#E8832A]/15 border border-[#E8832A]/30 text-xs text-[#F5E6D0]">
              O navegador bloqueou a abertura da janela.{' '}
              <a
                href={generatedWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-[#E8832A]"
              >
                Clique aqui para abrir o WhatsApp diretamente
              </a>.
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
            <a
              href={generatedWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-[6px] bg-[#E8832A] text-[#14100D] font-bold text-xs uppercase tracking-wider hover:bg-[#F5E6D0] transition-colors"
            >
              Abrir o WhatsApp de novo
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-[6px] border border-[#F5E6D0]/30 text-[#F5E6D0] font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Fazer outra reserva
            </button>
          </div>
        </div>
      ) : (
        // FORMULÁRIO DE 3 PASSOS
        <form onSubmit={handleSendWhatsApp} noValidate className="space-y-6">
          {/* Indicador de Passo */}
          <div className="flex items-center justify-between border-b border-[#F5E6D0]/15 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8832A]">
              Passo {step} de 3
            </span>
            <div className="flex gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-8 bg-[#E8832A]'
                      : s < step
                      ? 'w-4 bg-[#E8832A]/50'
                      : 'w-4 bg-[#F5E6D0]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* PASSO 1: QUANDO (Data e Horário)                             */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-6 animate-[fadeIn_250ms_ease-out]">
              <div>
                <label
                  htmlFor={`${idPrefix}-data`}
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#F5E6D0]/80 mb-2"
                >
                  Data da Reserva
                </label>
                <div className="relative">
                  <input
                    ref={firstInputRef}
                    id={`${idPrefix}-data`}
                    type="date"
                    min={todayMin}
                    value={data}
                    onChange={(e) => {
                      setData(e.target.value);
                      if (errors.data) setErrors({ ...errors, data: '' });
                    }}
                    required
                    aria-describedby={errors.data ? `${idPrefix}-data-error` : undefined}
                    className="w-full min-h-[48px] bg-transparent border-b-2 border-[#F5E6D0]/30 focus:border-[#E8832A] px-1 py-2 text-[16px] text-[#F5E6D0] outline-none transition-colors"
                  />
                  <Calendar className="absolute right-2 top-3 w-5 h-5 text-[#F5E6D0]/50 pointer-events-none" />
                </div>
                {data && (
                  <p className="mt-1.5 text-xs text-[#E8832A] capitalize font-medium">
                    {getDataExtenso(data)}
                  </p>
                )}
                {errors.data && (
                  <p id={`${idPrefix}-data-error`} className="mt-1 text-xs text-[#EA1D2C]">
                    {errors.data}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`${idPrefix}-horario`}
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#F5E6D0]/80 mb-2"
                >
                  Horário
                </label>
                <div className="relative">
                  <select
                    id={`${idPrefix}-horario`}
                    value={horario}
                    onChange={(e) => {
                      setHorario(e.target.value);
                      if (errors.horario) setErrors({ ...errors, horario: '' });
                    }}
                    required
                    aria-describedby={errors.horario ? `${idPrefix}-horario-error` : undefined}
                    className="w-full min-h-[48px] bg-[#14100D] border-b-2 border-[#F5E6D0]/30 focus:border-[#E8832A] px-1 py-2 text-[16px] text-[#F5E6D0] outline-none transition-colors cursor-pointer"
                  >
                    {siteConfig.reservationSlots?.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#14100D] text-[#F5E6D0]">
                        {slot}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute right-2 top-3 w-5 h-5 text-[#F5E6D0]/50 pointer-events-none" />
                </div>
                <p className="mt-1.5 text-xs text-[#F5E6D0]/60">
                  Parrilla acesa a partir das 11h30. Reservas até às 22h00.
                </p>
                {errors.horario && (
                  <p id={`${idPrefix}-horario-error`} className="mt-1 text-xs text-[#EA1D2C]">
                    {errors.horario}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PASSO 2: QUEM (Pessoas, Crianças, Ocasião, Área)              */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-6 animate-[fadeIn_250ms_ease-out]">
              {/* Stepper Total de Pessoas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor={`${idPrefix}-pessoas`}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F5E6D0]/80"
                  >
                    Total de Pessoas
                  </label>
                  <span className="text-xs text-[#F5E6D0]/60">Adultos + Crianças</span>
                </div>
                <div className="flex items-center justify-between border-b-2 border-[#F5E6D0]/30 py-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#E8832A]" />
                    <span className="text-xl font-bold text-[#F5E6D0]">{pessoas}</span>
                    <span className="text-xs text-[#F5E6D0]/60">
                      {pessoas === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Diminuir uma pessoa"
                      disabled={pessoas <= 1}
                      onClick={() => {
                        const next = Math.max(1, pessoas - 1);
                        setPessoas(next);
                        if (criancas >= next) setCriancas(Math.max(0, next - 1));
                      }}
                      className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-[#F5E6D0]/30 text-[#F5E6D0] hover:bg-[#E8832A] hover:text-[#14100D] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#F5E6D0] transition-colors flex items-center justify-center text-lg font-bold"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      aria-label="Aumentar uma pessoa"
                      onClick={() => setPessoas(pessoas + 1)}
                      className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-[#F5E6D0]/30 text-[#F5E6D0] hover:bg-[#E8832A] hover:text-[#14100D] transition-colors flex items-center justify-center text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                {pessoas > 12 && (
                  <p className="mt-2 text-xs text-[#E8832A] font-medium bg-[#E8832A]/10 p-2.5 rounded border border-[#E8832A]/20">
                    Mesa para {pessoas} pessoas! Para grupos maiores, a gente combina os detalhes com você direto no WhatsApp.
                  </p>
                )}
              </div>

              {/* Stepper Crianças */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor={`${idPrefix}-criancas`}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F5E6D0]/80"
                  >
                    Crianças no grupo
                  </label>
                  <span className="text-xs text-[#F5E6D0]/60">Entre as {pessoas} pessoas</span>
                </div>
                <div className="flex items-center justify-between border-b-2 border-[#F5E6D0]/30 py-2">
                  <div className="flex items-center gap-2">
                    <Baby className="w-5 h-5 text-[#E8832A]" />
                    <span className="text-xl font-bold text-[#F5E6D0]">{criancas}</span>
                    <span className="text-xs text-[#F5E6D0]/60">
                      {criancas === 1 ? 'criança' : 'crianças'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Diminuir crianças"
                      disabled={criancas <= 0}
                      onClick={() => setCriancas(Math.max(0, criancas - 1))}
                      className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-[#F5E6D0]/30 text-[#F5E6D0] hover:bg-[#E8832A] hover:text-[#14100D] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#F5E6D0] transition-colors flex items-center justify-center text-lg font-bold"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      aria-label="Aumentar crianças"
                      disabled={criancas >= pessoas - 1}
                      onClick={() => setCriancas(Math.min(pessoas - 1, criancas + 1))}
                      className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-[#F5E6D0]/30 text-[#F5E6D0] hover:bg-[#E8832A] hover:text-[#14100D] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#F5E6D0] transition-colors flex items-center justify-center text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggle Cadeirão (Só se crianças > 0) */}
              {criancas > 0 && (
                <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-[#F5E6D0]/10 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={cadeirao}
                    onChange={(e) => setCadeirao(e.target.checked)}
                    className="w-5 h-5 accent-[#E8832A] rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#F5E6D0]">
                    Precisamos de cadeirão de bebê
                  </span>
                </label>
              )}

              {/* Checkbox Preferimos Ficar Juntos (Se pessoas >= 8) */}
              {pessoas >= 8 && (
                <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-[#F5E6D0]/10 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={ficarJuntos}
                    onChange={(e) => setFicarJuntos(e.target.checked)}
                    className="w-5 h-5 accent-[#E8832A] rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[#F5E6D0]">
                    Preferimos ficar juntos na mesma mesa ou mesas integradas
                  </span>
                </label>
              )}

              {/* Chips de Ocasião */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#F5E6D0]/80 mb-2.5">
                  Ocasião Especial
                </label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Ocasião especial">
                  {OCASIOES.map((oc) => {
                    const isSelected = ocasiao === oc;
                    return (
                      <button
                        key={oc}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setOcasiao(oc)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all select-none ${
                          isSelected
                            ? 'bg-[#E8832A] text-[#14100D] font-bold shadow-sm'
                            : 'bg-white/5 text-[#F5E6D0]/80 border border-[#F5E6D0]/20 hover:border-[#E8832A]/50'
                        }`}
                      >
                        {oc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Área (só se reservationAreas tiver itens) */}
              {siteConfig.reservationAreas && siteConfig.reservationAreas.length > 0 && (
                <div>
                  <label
                    htmlFor={`${idPrefix}-area`}
                    className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#F5E6D0]/80 mb-2"
                  >
                    Preferência de Área
                  </label>
                  <select
                    id={`${idPrefix}-area`}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full min-h-[48px] bg-[#14100D] border-b-2 border-[#F5E6D0]/30 px-1 py-2 text-[16px] text-[#F5E6D0] outline-none"
                  >
                    <option value="">Sem preferência</option>
                    {siteConfig.reservationAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* PASSO 3: CONTATO E RESUMO                                    */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_250ms_ease-out]">
              <div>
                <label
                  htmlFor={`${idPrefix}-nome`}
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#F5E6D0]/80 mb-1"
                >
                  Seu Nome *
                </label>
                <input
                  ref={nomeInputRef}
                  id={`${idPrefix}-nome`}
                  type="text"
                  autoComplete="name"
                  placeholder="Como podemos te chamar?"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (errors.nome) setErrors({ ...errors, nome: '' });
                  }}
                  required
                  aria-describedby={errors.nome ? `${idPrefix}-nome-error` : undefined}
                  className="w-full min-h-[48px] bg-transparent border-b-2 border-[#F5E6D0]/30 focus:border-[#E8832A] px-1 py-2 text-[16px] text-[#F5E6D0] placeholder-[#F5E6D0]/30 outline-none transition-colors"
                />
                {errors.nome && (
                  <p id={`${idPrefix}-nome-error`} className="mt-1 text-xs text-[#EA1D2C]">
                    {errors.nome}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`${idPrefix}-obs`}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F5E6D0]/80"
                  >
                    Observações (Opcional)
                  </label>
                  <span className="text-[11px] text-[#F5E6D0]/50">{observacoes.length}/280</span>
                </div>
                <textarea
                  id={`${idPrefix}-obs`}
                  rows={3}
                  maxLength={280}
                  placeholder="Alergias, restrições, acessibilidade ou pedido especial..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full bg-white/5 border border-[#F5E6D0]/20 rounded-lg p-3 text-[16px] text-[#F5E6D0] placeholder-[#F5E6D0]/30 focus:border-[#E8832A] outline-none resize-none transition-colors"
                />
              </div>

              {/* Resumo da Reserva com Links de Editar */}
              <div className="rounded-xl bg-white/[0.04] border border-[#F5E6D0]/15 p-4 space-y-2 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#E8832A] mb-1">
                  Resumo da Reserva
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F5E6D0]/10">
                  <span className="text-[#F5E6D0]/70">Quando:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F5E6D0]">
                      {getDataFormatada(data)} às {horario}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[#E8832A] underline hover:text-white"
                    >
                      Editar
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F5E6D0]/10">
                  <span className="text-[#F5E6D0]/70">Pessoas:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F5E6D0]">
                      {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}
                      {criancas > 0 && ` (${criancas} crianças)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-[#E8832A] underline hover:text-white"
                    >
                      Editar
                    </button>
                  </div>
                </div>

                {ocasiao && ocasiao !== 'Sem ocasião' && (
                  <div className="flex items-center justify-between py-1 border-b border-[#F5E6D0]/10">
                    <span className="text-[#F5E6D0]/70">Ocasião:</span>
                    <span className="font-semibold text-[#F5E6D0]">{ocasiao}</span>
                  </div>
                )}

                {cadeirao && criancas > 0 && (
                  <div className="flex items-center justify-between py-1 border-b border-[#F5E6D0]/10">
                    <span className="text-[#F5E6D0]/70">Cadeirão:</span>
                    <span className="font-semibold text-[#F5E6D0]">Sim</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-[#F5E6D0]/60 text-center">
                A reserva só vale depois da confirmação do restaurante.
              </p>
            </div>
          )}

          {/* ============================================================ */}
          {/* BOTÕES DE NAVEGAÇÃO DOS PASSOS                               */}
          {/* ============================================================ */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="min-h-[44px] px-5 py-2.5 rounded-[6px] border border-[#F5E6D0]/30 text-[#F5E6D0] hover:bg-white/5 font-semibold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="min-h-[44px] px-7 py-2.5 rounded-[6px] bg-[#E8832A] hover:bg-[#F5E6D0] text-[#14100D] font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 ml-auto"
              >
                <span>Continuar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isPhoneValid}
                className="min-h-[48px] px-8 py-3 rounded-[6px] bg-[#E8832A] hover:bg-[#F5E6D0] disabled:opacity-40 text-[#14100D] font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2.5 ml-auto active:scale-[0.97]"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>ENVIAR PELO WHATSAPP</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );

  // ==========================================
  // RETORNO VARIANTE INLINE (SEÇÃO #contato-reservas)
  // ==========================================
  if (!isSheet) {
    return <div className={`reserva-triagem-inline ${className}`}>{formContent}</div>;
  }

  // ==========================================
  // RETORNO VARIANTE SHEET / DIALOG MODAL
  // ==========================================
  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Overlay com clique para fechar */}
      <div
        className="fixed inset-0 bg-[#14100D]/75 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteúdo do Diálogo (Bottom Sheet no Mobile, Modal no Desktop) */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-reserva-title"
        className="relative z-10 w-full sm:max-w-[560px] max-h-[92svh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#14100D] text-[#F5E6D0] border-t sm:border border-[#F5E6D0]/15 shadow-2xl p-6 sm:p-8 grao animate-[sheetIn_350ms_cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: '#14100D',
        }}
      >
        {/* Cabeçalho do Diálogo com Título e Fechar */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2
              id="dialog-reserva-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D0]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span>RESERVAR</span>{' '}
              <span
                className="italic text-[#E8832A] font-black lowercase tracking-[-0.02em]"
                style={{
                  fontWeight: 900,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                }}
              >
                mesa
              </span>
            </h2>
            <p className="mt-1 text-xs text-[#F5E6D0]/70 font-sans">
              Garanta seu lugar na brasa. Preencha em 1 minuto.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de reserva"
            className="w-11 h-11 min-h-[44px] min-w-[44px] -mr-2 -mt-2 rounded-full flex items-center justify-center text-[#F5E6D0]/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário de Triagem */}
        {formContent}

        {/* Rodapé do Diálogo */}
        <div className="mt-8 pt-4 border-t border-[#F5E6D0]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5E6D0]/70 text-center sm:text-left">
          <div>
            <span>Só uma dúvida? </span>
            <a
              href={`https://wa.me/${siteConfig.phoneRaw}?text=${encodeURIComponent(
                'Olá! Vim pelo site do Braseiro Caiçara e gostaria de falar com o restaurante.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E8832A] hover:underline font-semibold"
            >
              Falar direto no WhatsApp
            </a>
          </div>

          {siteConfig.ifoodUrl && (
            <div>
              <span>Prefere pedir em casa? </span>
              <a
                href={siteConfig.ifoodUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8832A] hover:underline font-semibold inline-flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pedir no iFood</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes sheetIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (min-width: 640px) {
          @keyframes sheetIn {
            from {
              transform: scale(0.98);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes sheetIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
};

export default ReservaTriagem;
