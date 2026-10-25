import React, { useState } from 'react';
import {
  X,
  Save,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Zap,
  DollarSign,
  CheckCircle2,
  CreditCard,
  Building,
  Plus,
  Trash2,
  Cpu,
  SunMedium,
  Shield,
  Layers
} from 'lucide-react';
import { criarProposta, atualizarProposta } from '../lib/propostas';

// Potências de módulos de 425W a 700W de 5 em 5W
export const OPCOES_POTENCIA_MODULOS = [];
for (let w = 425; w <= 700; w += 5) {
  OPCOES_POTENCIA_MODULOS.push(w);
}

// Inversores de 1kW a 75kW
export const OPCOES_POTENCIA_INVERSOR = [];
for (let kw = 1; kw <= 75; kw++) {
  OPCOES_POTENCIA_INVERSOR.push(kw);
}

// Potências para microinversores
export const OPCOES_POTENCIA_MICRO = [
  1, 1.2, 1.5, 1.6, 1.8, 2, 2.25, 2.5, 3, 4, 5
];

// Tensões de rede para inversores
export const TENSOES_INVERSOR = [
  'Monofásico 220V',
  'Trifásico 220V',
  'Trifásico 380V',
  'Trifásico 400V',
  'Trifásico 800V'
];

// Tensões para microinversores (exclusivamente 220V)
export const TENSOES_MICRO = [
  'Monofásico / Bifásico 220V'
];

export function normalizarDimensionamento(dim) {
  if (!dim) dim = {};
  
  let modulos = dim.modulos;
  if (!Array.isArray(modulos) || modulos.length === 0) {
    const qtd = Number(dim.qtdPaineis) || 12;
    let pot = 590;
    if (dim.modeloPainel) {
      const match = dim.modeloPainel.match(/(\d{3})\s*W/i);
      if (match) {
        const p = parseInt(match[1], 10);
        if (p >= 425 && p <= 700) pot = p;
      }
    }
    modulos = [
      {
        id: 'mod-1',
        quantidade: qtd,
        potenciaW: pot,
        modelo: 'Módulo Fotovoltaico Bifacial N-Type'
      }
    ];
  }

  let inversores = dim.inversores;
  if (!Array.isArray(inversores) || inversores.length === 0) {
    let tipo = 'Inversor';
    let pot = 7;
    let tensao = 'Monofásico 220V';

    if (dim.modeloInversor) {
      if (/micro/i.test(dim.modeloInversor)) {
        tipo = 'Microinversor';
        tensao = 'Monofásico / Bifásico 220V';
      }
      const matchKw = dim.modeloInversor.match(/(\d+(\.\d+)?)\s*kW/i);
      if (matchKw) pot = parseFloat(matchKw[1]) || 7;
      if (/380/i.test(dim.modeloInversor)) tensao = 'Trifásico 380V';
      else if (/400/i.test(dim.modeloInversor)) tensao = 'Trifásico 400V';
      else if (/800/i.test(dim.modeloInversor)) tensao = 'Trifásico 800V';
      else if (/trif[aá]sico/i.test(dim.modeloInversor)) tensao = 'Trifásico 220V';
    } else if (dim.potenciaKwp) {
      pot = Math.max(1, Math.min(75, Math.ceil(dim.potenciaKwp)));
    }

    inversores = [
      {
        id: 'inv-1',
        tipo,
        quantidade: 1,
        potenciaKw: pot,
        tensao: tipo === 'Microinversor' ? 'Monofásico / Bifásico 220V' : tensao
      }
    ];
  }

  return {
    ...dim,
    modulos,
    inversores
  };
}

export const recalcularTotaisModulos = (listaModulos) => {
  const totalPlacas = (listaModulos || []).reduce((acc, m) => acc + (Number(m.quantidade) || 0), 0);
  const totalWatts = (listaModulos || []).reduce((acc, m) => acc + ((Number(m.quantidade) || 0) * (Number(m.potenciaW) || 0)), 0);
  const potenciaKwp = Number((totalWatts / 1000).toFixed(2));
  const areaNecessariaM2 = Math.round(totalPlacas * 2.2);
  const geracaoMensalKwh = Math.round(potenciaKwp * 84.7);
  const geracaoAnualKwh = geracaoMensalKwh * 12;

  let resumoPainel = '';
  if (!listaModulos || listaModulos.length === 0) {
    resumoPainel = 'Módulos Solares Fotovoltaicos';
  } else if (listaModulos.length === 1) {
    resumoPainel = `${listaModulos[0].quantidade}x Módulo Fotovoltaico Bifacial ${listaModulos[0].potenciaW}W N-Type Tier-1`;
  } else {
    resumoPainel = listaModulos
      .map((m) => `${m.quantidade}x ${m.potenciaW}W`)
      .join(' + ');
  }

  return {
    totalPlacas,
    totalWatts,
    potenciaKwp,
    areaNecessariaM2,
    geracaoMensalKwh,
    geracaoAnualKwh,
    resumoPainel
  };
};

export const recalcularResumoInversores = (listaInversores) => {
  if (!listaInversores || listaInversores.length === 0) return '';
  return listaInversores
    .map((inv) => {
      const qtdStr = inv.quantidade > 1 ? `${inv.quantidade}x ` : '';
      return `${qtdStr}${inv.tipo} ${inv.potenciaKw}kW ${inv.tensao}`;
    })
    .join(' + ');
};

export default function ProposalFormModal({ initialData, onClose, onSaved }) {
  const isEditing = Boolean(initialData?.id);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Estado do formulário
  const [form, setForm] = useState(() => {
    let baseData = initialData?.dados ? JSON.parse(JSON.stringify(initialData.dados)) : null;
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    if (!baseData) {
      baseData = {
        numero: initialData?.numero || `${randomNum}/${currentYear}`,
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        validadeDias: 30,
        cliente: {
          nome: initialData?.cliente_nome || '',
          cpfCnpj: '',
          telefone: initialData?.cliente_telefone || '',
          endereco: '',
          bairro: '',
          cidade: initialData?.cliente_cidade || 'Ferraz de Vasconcelos',
          uf: 'SP',
          tipoTelhado: 'Telha Colonial Cerâmica',
          orientacao: 'Norte / Noroeste',
          segmento: 'Residencial'
        },
        dimensionamento: {
          potenciaKwp: initialData?.potencia_kwp || 7.08,
          qtdPaineis: 12,
          modeloPainel: '12x Módulo Fotovoltaico Bifacial 590W N-Type Tier-1',
          garantiaPainel: '15 anos produto / 25 anos performance linear (84.8%)',
          modeloInversor: 'Inversor 7kW Monofásico 220V',
          garantiaInversor: '10 anos de garantia de fábrica',
          geracaoMensalKwh: 600,
          geracaoAnualKwh: 7200,
          areaNecessariaM2: 26,
          coberturaConsumo: 100,
          expansaoFutura: 'Permite expansão de até 4 módulos adicionais no mesmo inversor',
          modulos: [
            {
              id: 'mod-1',
              quantidade: 12,
              potenciaW: 590,
              modelo: 'Módulo Fotovoltaico Bifacial N-Type'
            }
          ],
          inversores: [
            {
              id: 'inv-1',
              tipo: 'Inversor',
              quantidade: 1,
              potenciaKw: 7,
              tensao: 'Monofásico 220V'
            }
          ]
        },
        financeiro: {
          contaAtualMensal: 600.0,
          contaNovaMensal: 65.0,
          investimentoTotal: initialData?.valor_investimento || 18900.0,
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
    } else {
      // Garante normalização de dimensionamento com modulos e inversores estruturados
      baseData.dimensionamento = normalizarDimensionamento(baseData.dimensionamento);
    }

    return baseData;
  });

  // Atualização de campos aninhados
  const updateCliente = (field, val) => {
    setForm((prev) => ({ ...prev, cliente: { ...prev.cliente, [field]: val } }));
  };

  const updateDimensionamento = (field, val) => {
    setForm((prev) => ({ ...prev, dimensionamento: { ...prev.dimensionamento, [field]: val } }));
  };

  const updateFinanceiro = (field, val) => {
    setForm((prev) => ({ ...prev, financeiro: { ...prev.financeiro, [field]: val } }));
  };

  // ============================================================
  // HANDLERS DE MÓDULOS (425W a 700W)
  // ============================================================
  const handleUpdateModulo = (index, field, value) => {
    const updatedModulos = (form.dimensionamento.modulos || []).map((m, idx) => {
      if (idx !== index) return m;
      return { ...m, [field]: field === 'quantidade' || field === 'potenciaW' ? Number(value) : value };
    });

    const totais = recalcularTotaisModulos(updatedModulos);

    setForm((prev) => ({
      ...prev,
      dimensionamento: {
        ...prev.dimensionamento,
        modulos: updatedModulos,
        qtdPaineis: totais.totalPlacas,
        potenciaKwp: totais.potenciaKwp,
        areaNecessariaM2: totais.areaNecessariaM2,
        geracaoMensalKwh: totais.geracaoMensalKwh,
        geracaoAnualKwh: totais.geracaoAnualKwh,
        modeloPainel: totais.resumoPainel
      }
    }));
  };

  const handleAddModulo = () => {
    const novoModulo = {
      id: `mod-${Date.now()}`,
      quantidade: 4,
      potenciaW: 590,
      modelo: 'Módulo Fotovoltaico Bifacial N-Type'
    };
    const updatedModulos = [...(form.dimensionamento.modulos || []), novoModulo];
    const totais = recalcularTotaisModulos(updatedModulos);

    setForm((prev) => ({
      ...prev,
      dimensionamento: {
        ...prev.dimensionamento,
        modulos: updatedModulos,
        qtdPaineis: totais.totalPlacas,
        potenciaKwp: totais.potenciaKwp,
        areaNecessariaM2: totais.areaNecessariaM2,
        geracaoMensalKwh: totais.geracaoMensalKwh,
        geracaoAnualKwh: totais.geracaoAnualKwh,
        modeloPainel: totais.resumoPainel
      }
    }));
  };

  const handleRemoveModulo = (index) => {
    if ((form.dimensionamento.modulos || []).length <= 1) return;
    const updatedModulos = form.dimensionamento.modulos.filter((_, idx) => idx !== index);
    const totais = recalcularTotaisModulos(updatedModulos);

    setForm((prev) => ({
      ...prev,
      dimensionamento: {
        ...prev.dimensionamento,
        modulos: updatedModulos,
        qtdPaineis: totais.totalPlacas,
        potenciaKwp: totais.potenciaKwp,
        areaNecessariaM2: totais.areaNecessariaM2,
        geracaoMensalKwh: totais.geracaoMensalKwh,
        geracaoAnualKwh: totais.geracaoAnualKwh,
        modeloPainel: totais.resumoPainel
      }
    }));
  };

  // ============================================================
  // HANDLERS DE INVERSORES (1kW a 75kW / Tensão)
  // ============================================================
  const handleUpdateInversor = (index, field, value) => {
    const updatedInversores = (form.dimensionamento.inversores || []).map((inv, idx) => {
      if (idx !== index) return inv;
      const updated = {
        ...inv,
        [field]: field === 'quantidade' || field === 'potenciaKw' ? Number(value) : value
      };
      
      // Se mudar para Microinversor, trava tensão em 220V e ajusta potência típica
      if (field === 'tipo' && value === 'Microinversor') {
        updated.tensao = 'Monofásico / Bifásico 220V';
        if (updated.potenciaKw > 5) updated.potenciaKw = 2;
      } else if (field === 'tipo' && value === 'Inversor' && updated.tensao === 'Monofásico / Bifásico 220V') {
        updated.tensao = 'Monofásico 220V';
        if (updated.potenciaKw < 1) updated.potenciaKw = 5;
      }
      return updated;
    });

    const resumoInversores = recalcularResumoInversores(updatedInversores);

    setForm((prev) => ({
      ...prev,
      dimensionamento: {
        ...prev.dimensionamento,
        inversores: updatedInversores,
        modeloInversor: resumoInversores
      }
    }));
  };

  const handleAddInversor = () => {
    const novoInversor = {
      id: `inv-${Date.now()}`,
      tipo: 'Inversor',
      quantidade: 1,
      potenciaKw: 5,
      tensao: 'Monofásico 220V'
    };
    const updatedInversores = [...(form.dimensionamento.inversores || []), novoInversor];
    const resumoInversores = recalcularResumoInversores(updatedInversores);

    setForm((prev) => ({
      ...prev,
      dimensionamento: {
        ...prev.dimensionamento,
        inversores: updatedInversores,
        modeloInversor: resumoInversores
      }
    }));
  };

  const handleRemoveInversor = (index) => {
    if ((form.dimensionamento.inversores || []).length <= 1) return;
    const updatedInversores = form.dimensionamento.inversores.filter((_, idx) => idx !== index);
    const resumoInversores = recalcularResumoInversores(updatedInversores);

    setForm((prev) => ({
      ...prev,
      dimensionamento: {
        ...prev.dimensionamento,
        inversores: updatedInversores,
        modeloInversor: resumoInversores
      }
    }));
  };

  // ============================================================
  // MOTOR DE CÁLCULO AUTOMÁTICO EM CASCATA (Etapa 1 Conta de Luz)
  // ============================================================
  const handleContaLuzChange = (val) => {
    const conta = parseFloat(val) || 0;
    const tarifaEstimada = 1.0; // R$ 1,00/kWh média SP
    const consumoKwh = Math.round(conta / tarifaEstimada);
    
    // Alto Tietê: ~84.7 kWh/mês por kWp
    const kwpCalculado = Number((consumoKwh / 84.7).toFixed(2));
    
    // Pega a potência do primeiro módulo ou 590W
    const potModulo = form.dimensionamento?.modulos?.[0]?.potenciaW || 590;
    const placasCalculadas = Math.max(2, Math.round((kwpCalculado * 1000) / potModulo));
    
    const novosModulos = [
      {
        id: form.dimensionamento?.modulos?.[0]?.id || 'mod-1',
        quantidade: placasCalculadas,
        potenciaW: potModulo,
        modelo: 'Módulo Fotovoltaico Bifacial N-Type'
      }
    ];

    const totais = recalcularTotaisModulos(novosModulos);

    // Sugerir potência de inversor coerente com o kWp
    const potInvSugerida = Math.max(1, Math.min(75, Math.ceil(totais.potenciaKwp)));
    const novosInversores = form.dimensionamento?.inversores?.length
      ? form.dimensionamento.inversores.map((inv, idx) =>
          idx === 0 ? { ...inv, potenciaKw: potInvSugerida } : inv
        )
      : [
          {
            id: 'inv-1',
            tipo: 'Inversor',
            quantidade: 1,
            potenciaKw: potInvSugerida,
            tensao: 'Monofásico 220V'
          }
        ];
    const resumoInversores = recalcularResumoInversores(novosInversores);

    // Investimento Turnkey sugerido (~R$ 2.670 por kWp)
    const investimentoSugerido = Math.round((totais.potenciaKwp * 2670) / 100) * 100 || 18900;
    
    // Recalcular financiamento e payback
    const novaConta = form.financeiro.contaNovaMensal || 65;
    const economiaMensal = conta - novaConta;
    const payback = economiaMensal > 0 ? Number((investimentoSugerido / (economiaMensal * 12)).toFixed(1)) : 2.9;

    const f60 = Number((investimentoSugerido * 0.0256).toFixed(2));
    const f84 = Number((investimentoSugerido * 0.0209).toFixed(2));
    const p3 = Number(((investimentoSugerido * 1.075) / 3).toFixed(2));
    const p6 = Number(((investimentoSugerido * 1.123) / 6).toFixed(2));
    const p12 = Number(((investimentoSugerido * 1.174) / 12).toFixed(2));

    setForm((prev) => ({
      ...prev,
      dimensionamento: {
        ...prev.dimensionamento,
        modulos: novosModulos,
        inversores: novosInversores,
        potenciaKwp: totais.potenciaKwp,
        qtdPaineis: totais.totalPlacas,
        areaNecessariaM2: totais.areaNecessariaM2,
        geracaoMensalKwh: totais.geracaoMensalKwh,
        geracaoAnualKwh: totais.geracaoAnualKwh,
        modeloPainel: totais.resumoPainel,
        modeloInversor: resumoInversores
      },
      financeiro: {
        ...prev.financeiro,
        contaAtualMensal: conta,
        investimentoTotal: investimentoSugerido,
        paybackAnos: payback,
        parcelamentoCartao: [
          { vezes: 3, valor: p3 },
          { vezes: 6, valor: p6 },
          { vezes: 12, valor: p12 }
        ],
        financiamentoBancario: [
          { banco: 'Santander / BV', vezes: 60, valorAprox: f60, carencia: 'Até 120 dias' },
          { banco: 'Santander / BV', vezes: 84, valorAprox: f84, carencia: 'Até 120 dias' }
        ]
      }
    }));
  };

  // Quando o vendedor ajusta o investimento total na Etapa 3:
  const handleInvestimentoChange = (val) => {
    const total = parseFloat(val) || 0;
    const p3 = Number(((total * 1.075) / 3).toFixed(2));
    const p6 = Number(((total * 1.123) / 6).toFixed(2));
    const p12 = Number(((total * 1.174) / 12).toFixed(2));
    const f60 = Number((total * 0.0256).toFixed(2));
    const f84 = Number((total * 0.0209).toFixed(2));

    const economiaMensal = form.financeiro.contaAtualMensal - form.financeiro.contaNovaMensal;
    const payback = economiaMensal > 0 ? Number((total / (economiaMensal * 12)).toFixed(1)) : 2.9;

    setForm((prev) => ({
      ...prev,
      financeiro: {
        ...prev.financeiro,
        investimentoTotal: total,
        paybackAnos: payback,
        parcelamentoCartao: [
          { vezes: 3, valor: p3 },
          { vezes: 6, valor: p6 },
          { vezes: 12, valor: p12 }
        ],
        financiamentoBancario: [
          { banco: 'Santander / BV', vezes: 60, valorAprox: f60, carencia: 'Até 120 dias' },
          { banco: 'Santander / BV', vezes: 84, valorAprox: f84, carencia: 'Até 120 dias' }
        ]
      }
    }));
  };

  // Avançar Etapa com validação
  const handleNextStep = () => {
    setError('');
    if (currentStep === 1) {
      if (!form.cliente.nome.trim()) {
        setError('Por favor, digite o nome do cliente para avançar.');
        return;
      }
      if (!form.financeiro.contaAtualMensal || form.financeiro.contaAtualMensal <= 0) {
        setError('Informe o valor aproximado que o cliente paga de conta de luz.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!form.dimensionamento.potenciaKwp || form.dimensionamento.potenciaKwp <= 0) {
        setError('Informe a potência da usina (kWp).');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.cliente.nome.trim()) {
      setError('Por favor, informe o nome do cliente.');
      setCurrentStep(1);
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await atualizarProposta(initialData.id, form);
      } else {
        await criarProposta(form);
      }
      onSaved();
    } catch (err) {
      console.error('Erro ao salvar proposta:', err);
      setError(err.message || 'Erro ao salvar proposta no Supabase.');
    } finally {
      setSaving(false);
    }
  };

  // Cálculos visuais rápidos para a Etapa 3
  const parcela84 = form.financeiro.financiamentoBancario?.find((f) => f.vezes === 84)?.valorAprox || 0;
  const diferencaFinanciamento = form.financeiro.contaAtualMensal - parcela84;
  const valorPixVista = form.financeiro.investimentoTotal * (1 - (form.financeiro.descontoPixPct || 5) / 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Modal com Título e Fechar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
              <span className="truncate">{isEditing ? `Editar Proposta Nº ${form.numero}` : 'Assistente de Nova Proposta'}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Passo {currentStep} de 3 • Preenchimento inteligente com cálculos automáticos
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================
            STEPPER PROGRESS BAR (Etapas 1, 2 e 3)
        ============================================================ */}
        <div className="bg-slate-950/80 px-4 sm:px-6 py-2.5 border-b border-slate-800/80 shrink-0">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold transition ${
                currentStep === 1
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : currentStep > 1
                  ? 'text-emerald-400 hover:bg-slate-900'
                  : 'text-slate-500'
              }`}
            >
              {currentStep > 1 ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              ) : (
                <User className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="truncate">1. Cliente & Conta</span>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (form.cliente.nome.trim()) setCurrentStep(2);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold transition ${
                currentStep === 2
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : currentStep > 2
                  ? 'text-emerald-400 hover:bg-slate-900'
                  : 'text-slate-500'
              }`}
            >
              {currentStep > 2 ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              ) : (
                <Zap className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="truncate">2. Sistema Solar</span>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => {
                if (form.cliente.nome.trim() && form.dimensionamento.potenciaKwp > 0) setCurrentStep(3);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold transition ${
                currentStep === 3
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">3. Financiamento</span>
            </button>

          </div>

          {/* Barra Visual de Porcentagem */}
          <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: currentStep === 1 ? '33.3%' : currentStep === 2 ? '66.6%' : '100%' }}
            />
          </div>
        </div>

        {/* ============================================================
            CONTEÚDO DAS ETAPAS
        ============================================================ */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-300 flex-1">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ------------------------------------------------------------
              ETAPA 1: DADOS DO CLIENTE & CONTA ATUAL
          ------------------------------------------------------------ */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Box de Destaque da Conta de Luz Atual (Gatilho de Cálculo) */}
              <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border-2 border-amber-400/50 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Conta de Luz Atual do Cliente (R$/mês) *</span>
                  </span>
                  <span className="text-[10px] text-amber-300/80 bg-amber-400/20 px-2 py-0.5 rounded font-bold">
                    Cálculo Automático
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      step="10"
                      required
                      value={form.financeiro.contaAtualMensal}
                      onChange={(e) => handleContaLuzChange(e.target.value)}
                      placeholder="Ex: 600"
                      className="w-full bg-slate-950 border border-amber-400/80 rounded-xl pl-11 pr-3 py-2.5 text-xl font-black text-amber-300 focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                  <div className="hidden xs:flex flex-col text-right justify-center">
                    <span className="text-[11px] text-slate-400">Consumo Estimado:</span>
                    <strong className="text-sm font-bold text-white">
                      ~{Math.round(form.financeiro.contaAtualMensal / 1.0)} kWh/mês
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  💡 <em>Ao digitar o valor da conta, o sistema já dimensiona a quantidade de placas e simula o financiamento automaticamente nas próximas etapas.</em>
                </p>
              </div>

              {/* Dados Pessoais do Cliente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-semibold">Nome Completo do Cliente *</label>
                  <input
                    type="text"
                    required
                    value={form.cliente.nome}
                    onChange={(e) => updateCliente('nome', e.target.value)}
                    placeholder="Ex: Claudio Roberto Squizato"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={form.cliente.telefone}
                    onChange={(e) => updateCliente('telefone', e.target.value)}
                    placeholder="(11) 99433-3471"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Cidade / UF</label>
                  <input
                    type="text"
                    value={form.cliente.cidade}
                    onChange={(e) => updateCliente('cidade', e.target.value)}
                    placeholder="Poá, Ferraz, Suzano, Mogi..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tipo de Telhado</label>
                  <select
                    value={form.cliente.tipoTelhado}
                    onChange={(e) => updateCliente('tipoTelhado', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  >
                    <option value="Telha Colonial Cerâmica">Telha Colonial Cerâmica</option>
                    <option value="Telha Fibrocimento">Telha Fibrocimento</option>
                    <option value="Telha Metálica / Sanduíche">Telha Metálica / Sanduíche</option>
                    <option value="Laje de Concreto">Laje de Concreto</option>
                    <option value="Solo">Solo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Segmento</label>
                  <select
                    value={form.cliente.segmento}
                    onChange={(e) => updateCliente('segmento', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Condomínio">Condomínio</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Endereço e Bairro (Opcional)</label>
                  <input
                    type="text"
                    value={form.cliente.endereco}
                    onChange={(e) => updateCliente('endereco', e.target.value)}
                    placeholder="Rua / Avenida, Número e Bairro"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------
              ETAPA 2: SISTEMA TÉCNICO & EQUIPAMENTOS
          ------------------------------------------------------------ */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Card Resumo do Dimensionamento Gerado em Tempo Real */}
              <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/15 border-2 border-amber-400/40 rounded-2xl p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Dimensionamento da Usina Solar • {form.cliente.nome || 'Cliente'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        O kWp e a área do telhado atualizam automaticamente conforme os módulos selecionados.
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-400/20 border border-amber-400/50 px-3.5 py-1.5 rounded-xl text-amber-300 font-black text-sm shrink-0 flex items-center gap-2">
                    <span className="text-white">{form.dimensionamento.potenciaKwp} kWp</span>
                    <span className="text-amber-400/70">•</span>
                    <span>{form.dimensionamento.qtdPaineis} Placas</span>
                    <span className="text-amber-400/70">•</span>
                    <span className="text-slate-300 font-semibold text-xs">~{form.dimensionamento.areaNecessariaM2} m²</span>
                  </div>
                </div>

                {/* Mini indicadores rápidos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px]">
                  <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Potência Total (kWp)</span>
                    <strong className="text-amber-400 font-bold text-xs">{form.dimensionamento.potenciaKwp} kWp</strong>
                  </div>
                  <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Total de Painéis</span>
                    <strong className="text-white font-bold text-xs">{form.dimensionamento.qtdPaineis} placas</strong>
                  </div>
                  <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Área de Telhado (m²)</span>
                    <strong className="text-white font-bold text-xs">~{form.dimensionamento.areaNecessariaM2} m²</strong>
                  </div>
                  <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Geração Prevista</span>
                    <strong className="text-emerald-400 font-bold text-xs">~{form.dimensionamento.geracaoMensalKwh} kWh/mês</strong>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  SEÇÃO 1: MÓDULOS FOTOVOLTAICOS (PLACAS SOLARES)
                  De 425W a 700W de 5 em 5W, múltiplos modelos e quantidades
              ============================================================ */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <SunMedium className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Módulos Fotovoltaicos (Placas Solares)
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    425W a 700W (passos de 5W)
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Defina os modelos de placas. Você pode adicionar mais de um lote/modelo com quantidades diferentes; a potência total da usina (kWp) e a área do telhado são vinculadas automaticamente.
                </p>

                {/* Lista de Módulos */}
                <div className="space-y-2.5">
                  {(form.dimensionamento.modulos || []).map((mod, index) => {
                    const subtotalWatts = (Number(mod.quantidade) || 0) * (Number(mod.potenciaW) || 0);
                    const subtotalKwp = (subtotalWatts / 1000).toFixed(2);
                    const subtotalArea = Math.round((Number(mod.quantidade) || 0) * 2.2);

                    return (
                      <div
                        key={mod.id || `mod-${index}`}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
                      >
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-200">Lote de Placas:</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 w-full sm:w-auto">
                          {/* Quantidade */}
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                              Quantidade (Placas)
                            </label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              required
                              value={mod.quantidade}
                              onChange={(e) => handleUpdateModulo(index, 'quantidade', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-white font-bold outline-none text-xs"
                            />
                          </div>

                          {/* Potência W (425W a 700W de 5 em 5) */}
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                              Potência Unitária (W)
                            </label>
                            <select
                              value={mod.potenciaW}
                              onChange={(e) => handleUpdateModulo(index, 'potenciaW', e.target.value)}
                              className="w-full bg-slate-950 border border-amber-500/50 focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold outline-none text-xs"
                            >
                              {OPCOES_POTENCIA_MODULOS.map((w) => (
                                <option key={w} value={w}>
                                  {w}W {w === 590 ? '★ Padrão UseSol' : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Subtotal da Linha */}
                          <div className="col-span-2 sm:col-span-1 flex flex-col justify-center">
                            <span className="text-[10px] text-slate-400 font-semibold mb-1">Subtotal da Linha</span>
                            <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-300 flex items-center justify-between">
                              <span className="text-amber-400">{subtotalKwp} kWp</span>
                              <span className="text-slate-400 text-[10px]">~{subtotalArea} m²</span>
                            </div>
                          </div>
                        </div>

                        {/* Botão de Remover Módulo */}
                        {(form.dimensionamento.modulos || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveModulo(index)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition shrink-0"
                            title="Remover este lote de placas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Botão Adicionar Outro Modelo de Módulo */}
                <button
                  type="button"
                  onClick={handleAddModulo}
                  className="w-full py-2 px-3 border border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/10 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Outro Modelo de Módulo / Placas</span>
                </button>
              </div>

              {/* ============================================================
                  SEÇÃO 2: INVERSORES & MICROINVERSORES
                  1kW a 75kW, 220V, 380V, 400V, 800V
              ============================================================ */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Inversores & Microinversores
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    1kW a 75kW • 220V, 380V, 400V, 800V
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Selecione os inversores ou microinversores. Conforme as normas técnicas, microinversores operam estritamente em rede 220V.
                </p>

                {/* Lista de Inversores */}
                <div className="space-y-2.5">
                  {(form.dimensionamento.inversores || []).map((inv, index) => {
                    const isMicro = inv.tipo === 'Microinversor';

                    return (
                      <div
                        key={inv.id || `inv-${index}`}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
                      >
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-200">Equipamento:</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 w-full sm:w-auto">
                          {/* Tipo: Inversor ou Microinversor */}
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                              Tipo de Equipamento
                            </label>
                            <select
                              value={inv.tipo}
                              onChange={(e) => handleUpdateInversor(index, 'tipo', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-2 py-1.5 text-white font-bold outline-none text-xs"
                            >
                              <option value="Inversor">Inversor Solar (String)</option>
                              <option value="Microinversor">Microinversor</option>
                            </select>
                          </div>

                          {/* Quantidade */}
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                              Quantidade
                            </label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              required
                              value={inv.quantidade}
                              onChange={(e) => handleUpdateInversor(index, 'quantidade', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-white font-bold outline-none text-xs"
                            />
                          </div>

                          {/* Potência (1kW ao 75kW ou micros) */}
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                              Potência (kW)
                            </label>
                            <select
                              value={inv.potenciaKw}
                              onChange={(e) => handleUpdateInversor(index, 'potenciaKw', e.target.value)}
                              className="w-full bg-slate-950 border border-amber-500/50 focus:border-amber-400 rounded-lg px-2 py-1.5 text-amber-300 font-bold outline-none text-xs"
                            >
                              {isMicro ? (
                                OPCOES_POTENCIA_MICRO.map((kw) => (
                                  <option key={`micro-${kw}`} value={kw}>
                                    {kw} kW
                                  </option>
                                ))
                              ) : (
                                OPCOES_POTENCIA_INVERSOR.map((kw) => (
                                  <option key={`inv-${kw}`} value={kw}>
                                    {kw} kW
                                  </option>
                                ))
                              )}
                            </select>
                          </div>

                          {/* Tensão da Rede */}
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                              Tensão de Conexão
                            </label>
                            <select
                              value={inv.tensao}
                              disabled={isMicro}
                              onChange={(e) => handleUpdateInversor(index, 'tensao', e.target.value)}
                              className={`w-full bg-slate-950 border rounded-lg px-2 py-1.5 text-xs outline-none font-bold ${
                                isMicro
                                  ? 'border-slate-800 text-slate-400 cursor-not-allowed'
                                  : 'border-slate-700 text-white focus:border-amber-400'
                              }`}
                            >
                              {isMicro ? (
                                <option value="Monofásico / Bifásico 220V">220V (Padrão Micro)</option>
                              ) : (
                                TENSOES_INVERSOR.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>

                        {/* Botão de Remover Inversor */}
                        {(form.dimensionamento.inversores || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveInversor(index)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition shrink-0"
                            title="Remover este inversor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Botão Adicionar Outro Inversor */}
                <button
                  type="button"
                  onClick={handleAddInversor}
                  className="w-full py-2 px-3 border border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/10 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Outro Inversor / Microinversor</span>
                </button>
              </div>

              {/* Ajustes Complementares (Garantias & Expansão) */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Memorial & Garantias Padrão UseSol
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Garantia dos Módulos</label>
                    <input
                      type="text"
                      value={form.dimensionamento.garantiaPainel}
                      onChange={(e) => updateDimensionamento('garantiaPainel', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Garantia dos Inversores</label>
                    <input
                      type="text"
                      value={form.dimensionamento.garantiaInversor}
                      onChange={(e) => updateDimensionamento('garantiaInversor', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1 text-[11px]">Possibilidade de Expansão Futura</label>
                    <input
                      type="text"
                      value={form.dimensionamento.expansaoFutura}
                      onChange={(e) => updateDimensionamento('expansaoFutura', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400 text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------
              ETAPA 3: FINANCEIRO & FINANCIAMENTO AUTOMÁTICO
          ------------------------------------------------------------ */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Investimento Total */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-slate-950 to-emerald-500/10 border-2 border-emerald-400/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Investimento Total Sistema Turnkey (R$) *</span>
                  </span>
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-400/20 px-2 py-0.5 rounded">
                    Instalado & Homologado
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    step="100"
                    required
                    value={form.financeiro.investimentoTotal}
                    onChange={(e) => handleInvestimentoChange(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl pl-11 pr-3 py-2.5 text-2xl font-black text-emerald-400 focus:ring-2 focus:ring-emerald-400 outline-none"
                  />
                </div>
              </div>

              {/* SIMULAÇÃO DE FINANCIAMENTO SANTANDER & BV (Calculada na Hora!) */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Financiamento Solar Santander & BV
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Carência até 120 dias
                  </span>
                </div>

                {/* Cards de Parcelas */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Opção 60 Meses</span>
                    <strong className="text-lg font-black text-emerald-400 block my-0.5">
                      60x de R$ {form.financeiro.financiamentoBancario[0]?.valorAprox?.toFixed(2)}
                    </strong>
                    <span className="text-[10px] text-slate-500">Sem entrada</span>
                  </div>

                  <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-3 text-center relative overflow-hidden">
                    <span className="text-[11px] text-slate-400 block font-medium">Opção 84 Meses (Mais Vendida)</span>
                    <strong className="text-lg font-black text-emerald-400 block my-0.5">
                      84x de R$ {form.financeiro.financiamentoBancario[1]?.valorAprox?.toFixed(2)}
                    </strong>
                    <span className="text-[10px] text-emerald-400 font-bold">Menor parcela</span>
                  </div>
                </div>

                {/* Gatilho Comparativo de Venda */}
                {parcela84 > 0 && form.financeiro.contaAtualMensal > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-300 font-semibold block">
                        Conta Atual: <strong>R$ {form.financeiro.contaAtualMensal.toFixed(2)}</strong> vs Parcela 84x: <strong>R$ {parcela84.toFixed(2)}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold text-[11px]">
                        {diferencaFinanciamento > 0
                          ? `✓ O cliente já economiza R$ ${diferencaFinanciamento.toFixed(2)}/mês mesmo pagando a parcela!`
                          : '✓ O valor da parcela substitui a conta de energia e o sistema se paga sozinho.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resumo À Vista PIX e Cartão de Crédito */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* À Vista PIX */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">À Vista (PIX / TED)</span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                      5% Desconto
                    </span>
                  </div>
                  <div className="text-base font-black text-white">
                    R$ {valorPixVista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Economia imediata de R$ {(form.financeiro.investimentoTotal - valorPixVista).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Cartão de Crédito */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">Cartão de Crédito</span>
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-base font-black text-white">
                    12x de R$ {form.financeiro.parcelamentoCartao[2]?.valor?.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500 block">Sem burocracia bancária</span>
                </div>

              </div>

              {/* Métricas Adicionais (Payback e Nova Conta) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-slate-400 mb-1">Nova Conta Estimada</label>
                  <input
                    type="number"
                    value={form.financeiro.contaNovaMensal}
                    onChange={(e) => updateFinanceiro('contaNovaMensal', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Payback (Anos)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.financeiro.paybackAnos}
                    onChange={(e) => updateFinanceiro('paybackAnos', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-400 mb-1">Validade da Proposta</label>
                  <input
                    type="number"
                    value={form.validadeDias}
                    onChange={(e) => setForm({ ...form, validadeDias: parseInt(e.target.value, 10) || 30 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ============================================================
            FOOTER: BOTÕES DE NAVEGAÇÃO POR ETAPAS
        ============================================================ */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between gap-2 bg-slate-950 shrink-0">
          
          {/* Botão Voltar ou Cancelar */}
          {currentStep === 1 ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition text-xs"
            >
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          )}

          {/* Botão de Avançar ou Salvar */}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition text-xs"
            >
              <span>{currentStep === 1 ? 'Avançar: Sistema Técnico' : 'Avançar: Financiamento'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition text-xs disabled:opacity-50"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Atualizar Proposta' : 'Gerar e Salvar Proposta Oficial 🚀'}</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
