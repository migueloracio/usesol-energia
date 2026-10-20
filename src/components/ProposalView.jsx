import React, { useState, useEffect } from 'react';
import {
  Sun,
  Zap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  MapPin,
  FileText,
  Printer,
  ArrowLeft,
  Share2,
  Building2,
  Home,
  Award,
  Clock,
  Sparkles,
  MessageCircle,
  Sliders
} from 'lucide-react';
import Logo from './Logo';
import { buscarPropostaPorId } from '../lib/propostas';

const DEFAULT_PROPOSAL_DATA = {
  numero: '00040/2026',
  dataEmissao: '02/07/2026',
  validadeDias: 30,
  cliente: {
    nome: 'Claudio Roberto Squizato',
    cpfCnpj: '***.***.***-**',
    telefone: '(11) 9****-****',
    endereco: 'Rua Dois Sai da Yoshico Utaka, 32',
    bairro: 'Nova Poá',
    cidade: 'Poá',
    uf: 'SP',
    tipoTelhado: 'Telha Colonial Cerâmica',
    orientacao: 'Norte / Noroeste',
    segmento: 'Residencial'
  },
  dimensionamento: {
    potenciaKwp: 7.08,
    qtdPaineis: 12,
    modeloPainel: 'Módulo Fotovoltaico Bifacial 590W N-Type Tier-1',
    garantiaPainel: '15 anos produto / 25 anos performance linear (84.8%)',
    modeloInversor: 'Inversor String 7.0kW 220V 2-MPPT Inteligente Wi-Fi',
    garantiaInversor: '10 anos de garantia de fábrica',
    geracaoMensalKwh: 600,
    geracaoAnualKwh: 7200,
    areaNecessariaM2: 28,
    coberturaConsumo: 100,
    expansaoFutura: 'Permite expansão de até 4 módulos adicionais no mesmo inversor'
  },
  financeiro: {
    contaAtualMensal: 600.0,
    contaNovaMensal: 65.0,
    investimentoTotal: 18900.0,
    descontoPixPct: 5,
    paybackAnos: 2.9,
    parcelamentoCartao: [
      { vezes: 3, valor: 6773.62 },
      { vezes: 6, valor: 3538.54 },
      { vezes: 12, valor: 1848.90 }
    ],
    financiamentoBancario: [
      { banco: 'Santander / BV', vezes: 60, valorAprox: 485.0, carencia: 'Até 120 dias' },
      { banco: 'Santander / BV', vezes: 84, valorAprox: 395.0, carencia: 'Até 120 dias' }
    ]
  },
  prazos: {
    entregaProjeto: 'Até 10 dias após entrega documental e assinatura',
    instalacaoHomologacao: 'Até 45 a 60 dias (vistoria e troca de medidor pela concessionária)'
  }
};

export default function ProposalView({ onBack, propostaId, initialData, isConsultant = false }) {
  const [data, setData] = useState(() => initialData?.dados || initialData || DEFAULT_PROPOSAL_DATA);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    let idToLoad = propostaId;
    if (!idToLoad && typeof window !== 'undefined') {
      const match = window.location.hash.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match) idToLoad = match[1];
    }

    if (idToLoad) {
      setLoading(true);
      buscarPropostaPorId(idToLoad)
        .then((res) => {
          if (res?.dados) {
            setData(res.dados);
          } else {
            setNotFound(true);
          }
        })
        .catch((err) => {
          console.error('Erro ao buscar proposta no Supabase:', err);
          setNotFound(true);
        })
        .finally(() => setLoading(false));
    }
  }, [propostaId]);

  // Cálculos dinâmicos
  const economiaMensal = data.financeiro.contaAtualMensal - data.financeiro.contaNovaMensal;
  const economia1Ano = economiaMensal * 12;
  const economia25Anos = (data.financeiro.contaAtualMensal * 12 * 25) - (data.financeiro.contaNovaMensal * 12 * 25);
  const valorPix = data.financeiro.investimentoTotal * (1 - data.financeiro.descontoPixPct / 100);

  // Dados para o gráfico de 25 anos (com inflação energética estimada de 6% a.a.)
  const yearsData = [1, 3, 5, 8, 10, 15, 20, 25].map((ano) => {
    // Estimativa acumulada com ajuste inflacionário médio
    const fatorInflacao = Math.pow(1.055, ano / 2);
    const acumulado = Math.round(economia1Ano * ano * fatorInflacao);
    return { ano, valor: acumulado };
  });
  const maxYearVal = yearsData[yearsData.length - 1].valor;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    // Obter o ID da proposta (via prop, initialData ou URL hash)
    let currentId = propostaId || initialData?.id;
    if (!currentId && typeof window !== 'undefined') {
      const match = window.location.hash.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match) currentId = match[1];
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://usesol.com.br';
    const proposalUrl = currentId ? `${origin}/#proposta?id=${currentId}` : `${origin}/#proposta`;

    // Formatar telefone do cliente se houver (ex: "(11) 99433-3471" -> "5511994333471")
    let rawPhone = data.cliente?.telefone ? String(data.cliente.telefone).replace(/\D/g, '') : '';
    if (rawPhone && !rawPhone.startsWith('55') && rawPhone.length >= 10) {
      rawPhone = `55${rawPhone}`;
    }

    const text = encodeURIComponent(
      `Olá ${data.cliente.nome}, segue o link da sua Proposta Comercial Oficial UseSol Energia Nº ${data.numero}:\n\n` +
      `⚡ Potência: ${data.dimensionamento.potenciaKwp} kWp (${data.dimensionamento.qtdPaineis} placas bifaciais)\n` +
      `💰 Economia estimada: R$ ${economiaMensal.toLocaleString('pt-BR')}/mês (~R$ ${economia1Ano.toLocaleString('pt-BR')}/ano)\n` +
      `⏱️ Retorno do Investimento (Payback): ${data.financeiro.paybackAnos} anos\n` +
      `💳 Investimento: R$ ${data.financeiro.investimentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
      `👉 *Acesse sua proposta completa pelo link oficial:*\n${proposalUrl}`
    );

    const waUrl = rawPhone ? `https://wa.me/${rawPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(waUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <span className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Carregando Proposta Oficial UseSol...</h2>
        <p className="text-xs text-slate-400 mt-1">Conectando ao banco de dados Supabase</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold">Proposta não encontrada</h2>
          <p className="text-xs text-slate-400 mt-2 mb-6">
            Esta proposta pode ter sido expirada, excluída ou o link digitado está incorreto.
          </p>
          <button
            onClick={onBack}
            className="bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
          >
            Ir para o site da UseSol
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased pb-20 print:bg-white print:text-slate-900 print:pb-0">
      
      {/* ============================================================
          TOP CONTROL BAR (Oculto na impressão)
      ============================================================ */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-8 py-2.5 sm:py-3.5 no-print shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{isConsultant ? 'Voltar ao Painel' : 'Voltar ao Site'}</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-700 pl-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                Proposta Oficial UseSol
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[200px] md:max-w-none">
                Nº <strong className="text-white">{data.numero}</strong> • {data.cliente.nome}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isConsultant && (
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="hidden md:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition shadow-sm"
                title="Ajustar valores para simulação"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>{showEditor ? 'Ocultar' : 'Simular'}</span>
              </button>
            )}

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 px-2.5 sm:px-3.5 py-1.5 rounded-lg shadow-md transition"
              title="Compartilhar no WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartilhar WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 sm:px-4 py-1.5 rounded-lg shadow-lg shadow-amber-500/20 transition"
              title="Baixar ou Imprimir PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Baixar / Imprimir PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>

        {/* EDITOR RÁPIDO EXPANSÍVEL (Para demonstrar facilidade de gerar proposta) */}
        {showEditor && (
          <div className="max-w-7xl mx-auto mt-3 p-4 bg-slate-900 border border-slate-700 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-slate-400 mb-1">Nome do Cliente</label>
              <input
                type="text"
                value={data.cliente.nome}
                onChange={(e) => setData({ ...data, cliente: { ...data.cliente, nome: e.target.value } })}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Cidade / UF</label>
              <input
                type="text"
                value={`${data.cliente.cidade} - ${data.cliente.uf}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  setData({
                    ...data,
                    cliente: {
                      ...data.cliente,
                      cidade: parts[0]?.trim() || '',
                      uf: parts[1]?.trim() || 'SP'
                    }
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Conta Atual (R$/mês)</label>
              <input
                type="number"
                value={data.financeiro.contaAtualMensal}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setData({ ...data, financeiro: { ...data.financeiro, contaAtualMensal: val } });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Valor do Investimento (R$)</label>
              <input
                type="number"
                value={data.financeiro.investimentoTotal}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setData({ ...data, financeiro: { ...data.financeiro, investimentoTotal: val } });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:border-amber-400 outline-none"
              />
            </div>
          </div>
        )}
      </header>

      {/* ============================================================
          CONTAINER DAS 4 PÁGINAS EM FORMATO A4 EXECUTIVO
      ============================================================ */}
      <main className="max-w-[850px] mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-10 print:max-w-none print:px-0 print:py-0 print:space-y-0">

        {/* ------------------------------------------------------------
            PÁGINA 1: CAPA EXECUTIVA & APRESENTAÇÃO
        ------------------------------------------------------------ */}
        <article className="proposal-page bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-10 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-0 sm:min-h-[1130px] border border-slate-200 print:rounded-none print:shadow-none print:border-none print:m-0 print:p-10 print:min-h-[285mm] print:break-after-page">
          
          {/* Top Brand Banner */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <Logo className="h-10" isDark={false} />
            </div>
            <div className="text-right">
              <span className="inline-block text-[11px] font-bold tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase">
                Proposta Orçamentária
              </span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Nº {data.numero}</p>
            </div>
          </div>

          {/* Hero Presentation */}
          <div className="my-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-md mb-3 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estudo de Engenharia Fotovoltaica Personalizado</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Projeto de Autonomia e<br />
              <span className="text-amber-500">Geração de Energia Solar</span>
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Solução completa chave na mão (Turnkey): engenharia, homologação na concessionária, instalação qualificada e garantia estendida.
            </p>
          </div>

          {/* Box de Identificação do Cliente */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Dados do Cliente & Local de Instalação</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Titular:</span>
                <strong className="text-slate-900 text-sm font-bold block">{data.cliente.nome}</strong>
                <span className="text-slate-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {data.cliente.endereco}, {data.cliente.bairro}
                </span>
                <span className="text-slate-600 pl-4">{data.cliente.cidade} - {data.cliente.uf}</span>
              </div>
              <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                <div>
                  <span className="text-slate-400">Tipo de Telhado:</span>{' '}
                  <strong className="text-slate-800">{data.cliente.tipoTelhado}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Segmento:</span>{' '}
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {data.cliente.segmento}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Data de Emissão:</span>{' '}
                  <strong className="text-slate-800">{data.dataEmissao}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Validade da Proposta:</span>{' '}
                  <strong className="text-amber-600 font-bold">{data.validadeDias} dias</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Galeria de Segmentos com Fotos Reais da UseSol */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                Projetos & Segmentos Atendidos pela UseSol
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">Instalações reais no Alto Tietê e Grande SP</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
              {[
                { title: 'Residencial', img: '/img%20e%20videos/3.jpeg', icon: Home, desc: 'Casas & Sobrados' },
                { title: 'Comercial', img: '/img%20e%20videos/5.jpeg', icon: Building2, desc: 'Comércio & Clínicas' },
                { title: 'Condomínios', img: '/img%20e%20videos/2.jpeg', icon: Building2, desc: 'Áreas Comuns' },
                { title: 'Industrial', img: '/img%20e%20videos/4.jpeg', icon: Zap, desc: 'Galpões & Indústrias' },
                { title: 'Rural', img: '/img%20e%20videos/7.jpeg', icon: Sun, desc: 'Sítios & Chácaras' }
              ].map((item, idx) => (
                <div key={idx} className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex flex-col h-28 sm:h-32 shadow-sm">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-16 sm:h-20 object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.src = '/img%20e%20videos/3.jpeg'; }}
                  />
                  <div className="p-1 sm:p-1.5 text-center flex-1 flex flex-col justify-center bg-white">
                    <strong className="text-[10px] sm:text-[11px] font-bold text-slate-800 block leading-tight">{item.title}</strong>
                    <span className="text-[8px] sm:text-[9px] text-slate-400 leading-tight">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé da Capa com Credenciais Técnicas */}
          <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-100 grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1" />
              <strong className="text-[11px] sm:text-xs text-slate-800 leading-tight">Engenharia Homologada</strong>
              <span className="text-[9px] sm:text-[10px] text-slate-400">Conformidade ANEEL e EDP / Enel</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1" />
              <strong className="text-[11px] sm:text-xs text-slate-800 leading-tight">Equipamentos Tier-1</strong>
              <span className="text-[9px] sm:text-[10px] text-slate-400">Garantias de 10 a 25 anos</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1" />
              <strong className="text-[11px] sm:text-xs text-slate-800 leading-tight">Suporte e Monitoramento</strong>
              <span className="text-[9px] sm:text-[10px] text-slate-400">Acompanhamento direto pelo App</span>
            </div>
          </div>

          {/* Paginação */}
          <div className="text-right text-[10px] text-slate-400 pt-2">
            Página 01 / 04
          </div>
        </article>

        {/* ------------------------------------------------------------
            PÁGINA 2: ESTUDO DE VIABILIDADE & RETORNO DO INVESTIMENTO
        ------------------------------------------------------------ */}
        <article className="proposal-page bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-10 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-0 sm:min-h-[1130px] border border-slate-200 print:rounded-none print:shadow-none print:border-none print:m-0 print:p-10 print:min-h-[285mm] print:break-after-page">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-7 bg-amber-500 rounded-full" />
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Estudo de Viabilidade Econômica</h2>
                <p className="text-xs text-slate-400">Relação Custo × Benefício e Retorno do Investimento (Payback)</p>
              </div>
            </div>
            <Logo className="h-7" isDark={false} />
          </div>

          {/* Comparativo Antes x Depois (Redesenhado de forma moderna) */}
          <div className="my-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Comparativo de Custos: Concessionária vs Sistema Próprio UseSol
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card SEM UseSol */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-1 rounded-md">
                    Sem Energia Solar
                  </span>
                  <span className="text-[11px] text-rose-600 font-medium">Dependente de reajustes</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline border-b border-rose-100 pb-2">
                    <span className="text-xs text-slate-600">Conta média mensal:</span>
                    <strong className="text-base text-rose-700 font-bold">
                      R$ {data.financeiro.contaAtualMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-rose-100 pb-2">
                    <span className="text-xs text-slate-600">Gasto previsto em 1 ano:</span>
                    <strong className="text-sm text-slate-800 font-semibold">
                      R$ {(data.financeiro.contaAtualMensal * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-600">Gasto acumulado em 25 anos:</span>
                    <strong className="text-base text-rose-800 font-black">
                      R$ {(data.financeiro.contaAtualMensal * 12 * 25).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 italic">* Sem contar a inflação energética histórica de 6% a 9% a.a.</p>
              </div>

              {/* Card COM UseSol */}
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/50 p-5 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-bl-lg">
                  Economia de até 90%
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    Com UseSol Energia
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">Geração Própria</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline border-b border-emerald-100 pb-2">
                    <span className="text-xs text-slate-600">Nova conta estimada:</span>
                    <strong className="text-base text-emerald-700 font-bold">
                      R$ {data.financeiro.contaNovaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-emerald-100 pb-2">
                    <span className="text-xs text-slate-600">Gasto previsto em 1 ano:</span>
                    <strong className="text-sm text-slate-800 font-semibold">
                      R$ {(data.financeiro.contaNovaMensal * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-600">Gasto residual em 25 anos:</span>
                    <strong className="text-base text-emerald-800 font-black">
                      R$ {(data.financeiro.contaNovaMensal * 12 * 25).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-700 mt-3 font-medium">✓ Valor referente à taxa básica de conexão / iluminação pública.</p>
              </div>

            </div>
          </div>

          {/* Destaque das Métricas-Chave (Payback + Economia Total) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950/80 block">
                  Tempo de Retorno (Payback)
                </span>
                <div className="text-3xl font-black tracking-tight text-slate-950 mt-1">
                  {data.financeiro.paybackAnos} <span className="text-lg font-bold">Anos</span>
                </div>
                <span className="text-xs text-amber-950 font-medium block mt-0.5">
                  Após esse prazo, toda a energia gerada é 100% lucro líquido.
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-950/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-slate-950" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">
                  Economia Acumulada em 25 Anos
                </span>
                <div className="text-3xl font-black tracking-tight text-white mt-1">
                  R$ {economia25Anos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-xs text-emerald-100 font-medium block mt-0.5">
                  Patrimônio que fica no seu bolso em vez de ir para a concessionária.
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>

          </div>

          {/* Gráfico Moderno de Projeção Acumulada (Substituindo o gráfico antigo do Excel) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Evolução do Saldo Economizado Acumulado (Anos 1 a 25)
                </h3>
                <p className="text-[11px] text-slate-400">Projeção estimada considerando a curva de vida útil dos equipamentos</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Economia Ano 1: R$ {economia1Ano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Barras SVG / CSS elegantes */}
            <div className="h-40 sm:h-44 flex items-end justify-between gap-1 sm:gap-2 pt-6 px-1 sm:px-2 border-b border-slate-200">
              {yearsData.map((item, idx) => {
                const heightPct = Math.max(12, Math.round((item.valor / maxYearVal) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 sm:gap-1.5 h-full justify-end group">
                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 opacity-80 group-hover:opacity-100 transition whitespace-nowrap">
                      R${(item.valor / 1000).toFixed(0)}k
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[42px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-300 hover:brightness-110 relative"
                    />
                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-600">
                      {item.ano}º ano
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center text-[9px] sm:text-[10px] text-slate-400 mt-2 px-1 text-center sm:text-left gap-1">
              <span>Investimento Quitado ~2.9 anos</span>
              <span>Economia direta e blindagem contra bandeiras tarifárias</span>
              <span>25+ Anos de Vida Útil</span>
            </div>
          </div>

          {/* Paginação */}
          <div className="text-right text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            Página 02 / 04
          </div>
        </article>

        {/* ------------------------------------------------------------
            PÁGINA 3: ENGENHARIA & MEMORIAL TÉCNICO DO SISTEMA
        ------------------------------------------------------------ */}
        <article className="proposal-page bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-10 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-0 sm:min-h-[1130px] border border-slate-200 print:rounded-none print:shadow-none print:border-none print:m-0 print:p-10 print:min-h-[285mm] print:break-after-page">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-7 bg-amber-500 rounded-full" />
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Dimensionamento Técnico da Usina</h2>
                <p className="text-xs text-slate-400">Especificações de Engenharia, Equipamentos e Memorial Descritivo</p>
              </div>
            </div>
            <Logo className="h-7" isDark={false} />
          </div>

          {/* 6 Indicadores Técnicos Principais (Cards Modernos) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
            
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Potência Instalada</span>
              <div className="my-1">
                <span className="text-2xl font-black text-slate-900">{data.dimensionamento.potenciaKwp}</span>
                <span className="text-xs font-bold text-amber-500 ml-1">kWp</span>
              </div>
              <span className="text-[10px] text-slate-500">Capacidade de pico geradora</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Qtd. de Módulos</span>
              <div className="my-1">
                <span className="text-2xl font-black text-slate-900">{data.dimensionamento.qtdPaineis}</span>
                <span className="text-xs font-bold text-amber-500 ml-1">Painéis</span>
              </div>
              <span className="text-[10px] text-slate-500">Módulos Bifaciais 590W</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Geração Mensal Média</span>
              <div className="my-1">
                <span className="text-2xl font-black text-emerald-600">{data.dimensionamento.geracaoMensalKwh}</span>
                <span className="text-xs font-bold text-emerald-600 ml-1">kWh/mês</span>
              </div>
              <span className="text-[10px] text-slate-500">Calculado com irradiância de {data.cliente.cidade}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Geração Anual Prevista</span>
              <div className="my-1">
                <span className="text-2xl font-black text-slate-900">{data.dimensionamento.geracaoAnualKwh.toLocaleString('pt-BR')}</span>
                <span className="text-xs font-bold text-amber-500 ml-1">kWh/ano</span>
              </div>
              <span className="text-[10px] text-slate-500">Total gerado anualmente</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Área Estimada Telhado</span>
              <div className="my-1">
                <span className="text-2xl font-black text-slate-900">{data.dimensionamento.areaNecessariaM2}</span>
                <span className="text-xs font-bold text-amber-500 ml-1">m²</span>
              </div>
              <span className="text-[10px] text-slate-500">Otimizado para telhado colonial</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Atendimento do Consumo</span>
              <div className="my-1">
                <span className="text-2xl font-black text-emerald-600">{data.dimensionamento.coberturaConsumo}%</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Autonomia energética total</span>
            </div>

          </div>

          {/* Alerta de Expansão Futura */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center gap-3 my-2 text-xs">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-amber-900 font-bold block">Diferencial de Engenharia UseSol:</strong>
              <span className="text-amber-800">
                {data.dimensionamento.expansaoFutura}. Você poderá aumentar o consumo com ar-condicionado ou carro elétrico sem trocar de inversor!
              </span>
            </div>
          </div>

          {/* Tabela de Equipamentos do Kit (Design Limpo e Profissional) */}
          <div className="my-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Memorial de Equipamentos e Garantias Oficiais
            </h3>

            <div className="overflow-x-auto -mx-2 sm:mx-0 rounded-xl border border-slate-200 shadow-sm text-xs">
              <table className="w-full min-w-[500px] sm:min-w-0 text-left border-collapse">
                <thead className="bg-slate-900 text-white font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Item / Equipamento</th>
                    <th className="py-2.5 px-2 text-center">Qtd</th>
                    <th className="py-2.5 px-3">Especificação & Marca</th>
                    <th className="py-2.5 px-3 text-right">Garantia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      Módulos Solares Fotovoltaicos
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-amber-600">
                      {data.dimensionamento.qtdPaineis}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Bifacial 144 Células 590W N-Type Tier-1 (Vidro Duplo)
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      15 Anos Produto<br />
                      <span className="text-[10px] text-slate-400 font-normal">25 Anos Performance Linear</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      Inversor Solar On-Grid
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-amber-600">
                      01
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      7.0kW 220V 2-MPPT com Antena Wi-Fi integrada e App de celular
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      10 Anos de Fábrica
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      Estrutura de Fixação em Alumínio
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-amber-600">
                      01 Kit
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Perfis e grampos em alumínio anodizado inox para {data.cliente.tipoTelhado}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      12 Anos Estrutura
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      Cabos Solares & Conectores
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-amber-600">
                      Completo
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Cabo Solar 6mm com proteção anti-UV (Preto/Vermelho) + Conectores MC4
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      Padrão Normativo NBR
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      String Box / Proteção Elétrica
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-amber-600">
                      01 Kit
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Dispositivos DPS e disjuntores para proteção contra surtos e descargas
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      Norma ANEEL
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Destaque do Valor do Investimento */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block">
                Investimento Total Sistema Turnkey (Completo Instalado):
              </span>
              <div className="text-2xl font-black text-white">
                R$ {data.financeiro.investimentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-400 font-semibold block">
                Economia já no 1º Ano de Operação:
              </span>
              <span className="text-lg font-black text-emerald-400">
                R$ {economia1Ano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            * <strong>Nota de Engenharia:</strong> A estimativa de geração foi realizada com base no índice de radiação solar CRESESB para a microrregião de {data.cliente.cidade} e o tipo de estrutura {data.cliente.tipoTelhado}. Variações pontuais de clima e sombreamento podem ocorrer ao longo das estações do ano.
          </p>

          {/* Paginação */}
          <div className="text-right text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            Página 03 / 04
          </div>
        </article>

        {/* ------------------------------------------------------------
            PÁGINA 4: FORMAS DE PAGAMENTO, CONDIÇÕES & TERMO DE ACEITE
        ------------------------------------------------------------ */}
        <article className="proposal-page bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-10 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-0 sm:min-h-[1130px] border border-slate-200 print:rounded-none print:shadow-none print:border-none print:m-0 print:p-10 print:min-h-[285mm]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-7 bg-amber-500 rounded-full" />
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Condições Comerciais & Pagamento</h2>
                <p className="text-xs text-slate-400">Facilidades de Pagamento, Cronograma de Implantação e Termo de Aceite</p>
              </div>
            </div>
            <Logo className="h-7" isDark={false} />
          </div>

          {/* Opções de Pagamento (À Vista PIX, Cartão e Financiamento Solar) */}
          <div className="my-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Escolha a melhor modalidade para o seu fluxo financeiro:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Opção 1: À Vista PIX com Desconto */}
              <div className="rounded-xl border-2 border-amber-400 bg-amber-50/50 p-4 flex flex-col justify-between relative shadow-sm">
                <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Maior Economia
                </span>
                <div>
                  <strong className="text-xs font-bold uppercase text-slate-800 block">À Vista (PIX / TED)</strong>
                  <span className="text-[11px] text-amber-700 font-semibold">{data.financeiro.descontoPixPct}% de desconto exclusivo</span>
                  <div className="text-xl font-black text-slate-900 mt-2">
                    R$ {valorPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-2">
                  Economia imediata de R$ {(data.financeiro.investimentoTotal - valorPix).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no fechamento.
                </span>
              </div>

              {/* Opção 2: Cartão de Crédito */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between">
                <div>
                  <strong className="text-xs font-bold uppercase text-slate-800 block">Parcelamento no Cartão</strong>
                  <span className="text-[11px] text-slate-500">Sem burocracia bancária</span>
                  <div className="space-y-1 mt-2 text-xs">
                    {data.financeiro.parcelamentoCartao.map((p, i) => (
                      <div key={i} className="flex justify-between font-medium">
                        <span className="text-slate-600">{p.vezes}x no cartão:</span>
                        <strong className="text-slate-900">R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2">Possibilidade de dividir em mais de 1 cartão.</span>
              </div>

              {/* Opção 3: Financiamento Bancário Santander / BV (Já integrado no site!) */}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Parceria Oficial Santander & BV
                  </span>
                  <strong className="text-xs font-bold uppercase text-slate-800 block mt-1.5">Financiamento Solar</strong>
                  <div className="space-y-1 mt-2 text-xs">
                    {data.financeiro.financiamentoBancario.map((f, i) => (
                      <div key={i} className="flex justify-between font-medium">
                        <span className="text-slate-600">{f.vezes}x aprox:</span>
                        <strong className="text-emerald-800">R$ {f.valorAprox.toFixed(2)}/mês</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-emerald-800 font-semibold mt-2">
                  Carência de até 120 dias: comece a pagar só depois que o sistema estiver gerando energia!
                </span>
              </div>

            </div>
          </div>

          {/* Resumo Contratual & Cronograma de Instalação */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-2 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[11px] mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Cronograma de Execução & Condições Gerais</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div className="space-y-1.5">
                <div>
                  <strong className="text-slate-800 block">1. Engenharia & Homologação:</strong>
                  <span>{data.prazos.entregaProjeto} com protocolo junto à distribuidora de energia.</span>
                </div>
                <div>
                  <strong className="text-slate-800 block">2. Instalação & Ativação:</strong>
                  <span>{data.prazos.instalacaoHomologacao} com troca do relógio bidirecional.</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div>
                  <strong className="text-slate-800 block">3. O que está incluso no Turnkey:</strong>
                  <span>Materiais, frete, instalação, ART (Anotação de Responsabilidade Técnica) e suporte inicial.</span>
                </div>
                <div>
                  <strong className="text-slate-800 block">4. Validade da Proposta:</strong>
                  <span>Preços e disponibilidade garantidos por {data.validadeDias} dias a partir de {data.dataEmissao}.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Observações / Campo Personalizado */}
          <div className="border border-slate-200 rounded-xl p-3 bg-white text-xs text-slate-600">
            <strong className="text-slate-800 block mb-0.5">Observações Complementares:</strong>
            <p className="text-[11px] text-slate-500">
              O cliente deve disponibilizar ponto de internet Wi-Fi estável no local do inversor para ativação do monitoramento em tempo real no smartphone. A estrutura foi dimensionada especificamente para o telhado informado ({data.cliente.tipoTelhado}).
            </p>
          </div>

          {/* Termo de Aceite & Assinaturas (Redesenhado de forma corporativa e limpa) */}
          <div className="mt-6 pt-6 border-t-2 border-slate-200">
            <div className="text-center mb-6">
              <p className="text-xs text-slate-600 font-medium">
                De acordo com os valores, especificações técnicas e condições comerciais descritas nesta proposta orçamentária:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[150px] sm:max-w-[240px] border-b border-slate-400 mb-2" />
                <strong className="text-slate-900 block font-bold text-[11px] sm:text-xs">USESOL ENERGIA</strong>
                <span className="text-[9px] sm:text-[10px] text-slate-400">Depto. Engenharia / ART</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full max-w-[150px] sm:max-w-[240px] border-b border-slate-400 mb-2" />
                <strong className="text-slate-900 block font-bold text-[11px] sm:text-xs truncate max-w-[150px] sm:max-w-none">{data.cliente.nome.toUpperCase()}</strong>
                <span className="text-[9px] sm:text-[10px] text-slate-400">Aceite do Cliente</span>
              </div>
            </div>
          </div>

          {/* Paginação */}
          <div className="text-right text-[10px] text-slate-400 pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
            <span>UseSol Energia Renovável • www.usesol.com.br • Alto Tietê - SP</span>
            <span>Página 04 / 04</span>
          </div>
        </article>

      </main>

      {/* Floating CTA de Aprovação no Mobile / Tela para o Lead dar aceite rápido */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-slate-950/95 border border-amber-400/40 p-3 rounded-2xl shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3 no-print">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Gostou da proposta?</span>
          <span className="text-xs text-white font-semibold">Tire dúvidas ou aprove direto:</span>
        </div>
        <a
          href={`https://wa.me/5511994333471?text=${encodeURIComponent(
            `Olá, equipe UseSol! Analisei a Proposta Nº ${data.numero} (${data.cliente.nome}) e gostaria de avançar para a aprovação e agendamento da visita técnica!`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shrink-0 transition"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Aprovar no WhatsApp</span>
        </a>
      </div>

    </div>
  );
}
