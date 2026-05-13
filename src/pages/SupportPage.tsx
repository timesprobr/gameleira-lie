import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Award, 
  TrendingUp, 
  UserCheck, 
  MapPin, 
  Briefcase, 
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function SupportPage() {
  // Calculator state
  const [calcIcms, setCalcIcms] = useState<string>('20000');
  const [calcRegime, setCalcRegime] = useState<string>('real');

  // Form states
  const [icmsRange, setIcmsRange] = useState<string>('');
  const [recolheIcms, setRecolheIcms] = useState<string>('');
  const [interest, setInterest] = useState<string>('');
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Estimation calculation logic
  const calculateEstimation = () => {
    const val = parseFloat(calcIcms) || 0;
    // Em MG, empresas podem destinar até 3% do saldo devedor do ICMS dependendo da faixa ou edital, 
    // mas vamos apresentar uma estimativa de potencial anual de destinação a custo zero para encantar.
    const monthlyDestination = val * 0.03; 
    const annualDestination = monthlyDestination * 12;
    return {
      monthly: monthlyDestination.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      annual: annualDestination.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };
  };

  const est = calculateEstimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorized) {
      alert('Por favor, autorize o contato para prosseguirmos com a análise.');
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-black selection:text-white">
      
      {/* Top Institutional Header */}
      <header className="bg-black text-white py-4 px-6 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-black/95">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-black text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para o site
          </a>
          <div className="flex items-center gap-3">
            <img src="/escudo.png" alt="GAMELEIRA" className="h-7 w-auto" />
            <span className="text-base font-black tracking-tighter">GAMELEIRA</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-neutral-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" /> Portal de Parcerias
          </div>
        </div>
      </header>

      {/* PERCEPTION SHIFT MINDSET BANNER */}
      <div className="bg-[#E4F100] text-black py-3 px-6 border-b border-black/5 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-black uppercase tracking-widest text-[10px] bg-black text-white px-2 py-0.5 rounded">Atenção</span>
          <p className="text-xs md:text-sm font-black tracking-tight uppercase">
            Você não gasta com patrocínio. Você direciona seu imposto para gerar impacto local.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-black text-[#E4F100] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] font-black text-neutral-500 block mb-2">Análise Solicitada</span>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-neutral-900 mb-4">
            Dados Recebidos com Sucesso
          </h1>
          <p className="text-neutral-600 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed font-medium">
            Nossa equipe jurídica e contábil fará o estudo de viabilidade do redirecionamento do ICMS da sua empresa. Entraremos em contato com o responsável ou contador indicado em até 48 horas úteis.
          </p>
          <div className="bg-white border border-neutral-200 p-6 rounded-2xl max-w-md mx-auto shadow-sm text-left mb-8">
            <h4 className="font-bold text-sm text-neutral-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Próximos Passos
            </h4>
            <ul className="text-xs text-neutral-600 space-y-2">
              <li>1. Validação de regularidade fiscal em MG.</li>
              <li>2. Contato com o contador para alinhamento técnico.</li>
              <li>3. Apresentação do plano de cotas sem impacto no caixa.</li>
            </ul>
          </div>
          <a href="/" className="inline-block bg-black text-white hover:bg-neutral-800 font-bold px-8 py-4 rounded-full text-sm transition-all shadow-md">
            Voltar para a Página Inicial
          </a>
        </div>
      ) : (
        <>
          {/* 1. HERO SECTION */}
          <section className="bg-black text-white pt-16 pb-20 px-6 relative overflow-hidden border-b border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(228,241,0,0.05)_0,transparent_60%)] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <span className="inline-block border border-white/10 px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-[0.3em] font-black mb-6 rounded-full bg-white/5 text-neutral-400">
                Redirecionamento Inteligente de Imposto
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter mb-6 leading-tight">
                TRANSFORME O IMPOSTO QUE VOCÊ JÁ PAGA EM PUBLICIDADE E EXPOSIÇÃO PARA SUA EMPRESA.
              </h1>
              <p className="text-neutral-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                Essa é a chance de direcionar parte do ICMS devido ao Estado para fortalecer a imagem da sua marca apoiando o <strong className="text-white">GAMELEIRA</strong>, obtendo grande visibilidade e retorno institucional a custo zero.
              </p>
            </div>
          </section>



          {/* 2. EXPLICAÇÃO RÁPIDA (COMO FUNCIONA) */}
          <section className="py-20 px-6 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400 block mb-1">Processo Simplificado</span>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-neutral-900">
                COMO FUNCIONA O FLUXO
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "Passo 1", title: "Envio de Dados", desc: "Sua empresa informa os dados para análise contábil preliminar." },
                { step: "Passo 2", title: "Avaliação Técnica", desc: "Nossa equipe avalia o potencial de destinação via ICMS com seu contador." },
                { step: "Passo 3", title: "Escolha da Cota", desc: "Apresentamos as cotas de patrocínio e contrapartidas disponíveis." },
                { step: "Passo 4", title: "Aporte Oficial", desc: "O processo é realizado com total acompanhamento contábil e jurídico." }
              ].map((s, idx) => (
                <div key={idx} className="bg-white border border-neutral-200 p-6 rounded-2xl relative shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#CC0000] bg-red-50 border border-red-100 px-2.5 py-1 rounded-full w-max mb-3">
                    {s.step}
                  </span>
                  <h4 className="font-bold text-base text-neutral-900 mb-2">{s.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-auto font-medium">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CALCULADORA DE POTENCIAL INTERATIVA */}
          <section className="pb-20 px-6 max-w-4xl mx-auto">
            <div className="bg-[#141414] text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-800/80">
              
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-neutral-800 rounded-xl text-neutral-300 border border-neutral-700">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">Estime o seu impacto</span>
                    <h3 className="text-lg md:text-2xl font-black italic tracking-tighter uppercase">
                      Descubra quanto sua empresa pode destinar
                    </h3>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-neutral-400 mb-8 font-medium">
                  Selecione o valor aproximado do ICMS mensal recolhido para ver o potencial estimado de patrocínio a custo zero.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-300 mb-2">
                      Média de ICMS Mensal (R$)
                    </label>
                    <select 
                      value={calcIcms} 
                      onChange={(e) => setCalcIcms(e.target.value)}
                      className="w-full bg-[#1F1F1F] border border-neutral-800 rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-white focus:outline-none focus:border-neutral-400 cursor-pointer"
                    >
                      <option value="5000">Até R$ 10.000</option>
                      <option value="20000">R$ 10.000 a R$ 30.000</option>
                      <option value="65000">R$ 30.000 a R$ 100.000</option>
                      <option value="150000">Acima de R$ 100.000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-300 mb-2">
                      Sistema Tributário
                    </label>
                    <select 
                      value={calcRegime} 
                      onChange={(e) => setCalcRegime(e.target.value)}
                      className="w-full bg-[#1F1F1F] border border-neutral-800 rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-white focus:outline-none focus:border-neutral-400 cursor-pointer"
                    >
                      <option value="real">Lucro Real</option>
                      <option value="presumido">Lucro Presumido</option>
                    </select>
                  </div>
                </div>

                <div className="bg-black/80 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 block">
                      Potencial de Destinação Anual Estimado
                    </span>
                    <div className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-100 italic tracking-tight my-0.5">
                      Até {est.annual}
                    </div>
                    <span className="text-[9px] text-neutral-500 block">
                      *Estimativa baseada em limites médios estaduais. Sem impacto no caixa.
                    </span>
                  </div>

                  <a href="#formulario-captacao" className="bg-white hover:bg-neutral-200 text-black font-black uppercase text-xs tracking-widest px-6 py-3.5 rounded-xl transition-all flex-shrink-0 shadow-md">
                    Aplicar Agora
                  </a>
                </div>

                {/* Requisitos Legais em MG */}
                <div className="mt-6 pt-6 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 block">Regularidade</span>
                      <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">CDT de MG negativa ou positiva com efeito de negativa.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 block">Regime do ICMS</span>
                      <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">ICMS corrente apurado no regime de Débito e Crédito.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 block">Transparência</span>
                      <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">Depósito identificado direto na conta oficial do projeto.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-900 text-center">
                  <span className="inline-block text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                    ⚡ Os incentivos da cultura e do esporte não competem entre si. Sua empresa pode apoiar múltiplos projetos.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. CONTRAPARTIDAS INSTITUCIONAIS */}
          <section className="pb-20 px-6 max-w-5xl mx-auto">
            
            {/* Topo com Meta de Captação */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Meta de Captação: R$ 490 mil aprovados
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-neutral-900">
                CONTRAPARTIDAS INSTITUCIONIAIS
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 max-w-xl mx-auto mt-2 font-medium">
                Planos de participação alinhados às diretrizes de governança e transparência da Lei de Incentivo.
              </p>
            </div>

            <div className="space-y-8">
              
              {/* Card Master (Dominante) */}
              <div className="bg-black text-white rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(255,255,255,0.08)] border border-neutral-800 relative overflow-hidden flex flex-col md:flex-row justify-between gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="max-w-md relative z-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-200 text-black px-3 py-1 rounded-full shadow-sm">
                        Cota Principal
                      </span>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Exclusiva</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black italic tracking-tight text-white uppercase mt-1">
                      Patrocinador Master
                    </h3>
                    <div className="text-3xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-100 mt-2 tracking-tight">
                      R$ 100 mil+
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                      Direito de uso do selo oficial:
                    </span>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <Award className="w-6 h-6 text-neutral-300 flex-shrink-0" />
                      <span className="text-xs font-black italic uppercase tracking-tight text-white">
                        “Empresa apoiadora oficial do GAMELEIRA”
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex-grow md:max-w-lg flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-4 border-b border-white/10 pb-2">
                    Entregas Institucionais do Master
                  </span>
                  <ul className="space-y-3 text-xs text-neutral-300 font-medium">
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 flex-shrink-0" /> Marca no uniforme principal
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 flex-shrink-0" /> Destaque prioritário nas mídias oficiais
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 flex-shrink-0" /> Associação institucional em espaços do CT
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 flex-shrink-0" /> Presença em backdrop e campanhas
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 flex-shrink-0" /> Participação estratégica nos eventos do projeto
                    </li>
                  </ul>
                </div>
              </div>

              {/* Grid das outras 3 opções */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Ouro (Off-black) */}
                <div className="bg-[#111111] text-white rounded-3xl p-8 shadow-xl flex flex-col relative overflow-hidden border border-neutral-800">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-400 block mb-1">Categoria</span>
                  <h4 className="text-xl font-black italic text-white tracking-tight uppercase">Cota Ouro</h4>
                  <div className="text-2xl font-black italic text-neutral-200 mb-6 tracking-tight mt-1">R$ 50 mil+</div>
                  
                  <ul className="space-y-3 text-xs text-neutral-400 font-medium border-t border-neutral-800 pt-6 flex-grow">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Associação institucional da marca em espaços esportivos
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Maior exposição institucional da marca
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Presença em materiais e campanhas oficiais
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Participação em ações sociais e eventos
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Destaque estratégico nas mídias do projeto
                    </li>
                  </ul>
                </div>

                {/* Prata (Branco) */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-300" />
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-500 block mb-1">Categoria</span>
                  <h4 className="text-xl font-black italic text-neutral-900 tracking-tight uppercase">Cota Prata</h4>
                  <div className="text-2xl font-black italic text-neutral-900 mb-6 tracking-tight mt-1">R$ 25 mil</div>
                  
                  <ul className="space-y-3 text-xs text-neutral-600 font-medium border-t border-neutral-100 pt-6 flex-grow">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Aplicação da marca em uniformes de treino
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Banner institucional em eventos locais
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Divulgação institucional periódica
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Presença em ações do projeto
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Todas as entregas da categoria anterior
                    </li>
                  </ul>
                </div>

                {/* Apoiador Social (Cinza Claro) */}
                <div className="bg-neutral-100 border border-neutral-200/60 rounded-3xl p-8 shadow-xs flex flex-col relative overflow-hidden">
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-400 block mb-1">Categoria</span>
                  <h4 className="text-xl font-black italic text-neutral-800 tracking-tight uppercase">Apoiador Social</h4>
                  <div className="text-2xl font-black italic text-neutral-800 mb-6 tracking-tight mt-1">R$ 10 mil</div>
                  
                  <ul className="space-y-3 text-xs text-neutral-600 font-medium border-t border-neutral-200/60 pt-6 flex-grow">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Presença institucional no site oficial
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Divulgação nas redes sociais
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Certificado oficial de apoiador
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" /> Exposição em materiais institucionais
                    </li>
                  </ul>
                </div>

              </div>

              {/* Rodapé de negociação */}
              <div className="text-center pt-4">
                <p className="text-xs md:text-sm text-neutral-500 italic font-medium">
                  “As contrapartidas podem ser adaptadas conforme o perfil e participação institucional da empresa.”
                </p>
              </div>

            </div>
          </section>

          {/* 4. FORMULÁRIO DE CAPTAÇÃO INSTITUCIONAL */}
          <section id="formulario-captacao" className="pb-24 px-6 max-w-4xl mx-auto">
            <div className="bg-white border border-neutral-200 rounded-3xl shadow-xl overflow-hidden">
              
              {/* Header do form */}
              <div className="bg-neutral-900 text-white p-6 md:p-8 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 block mb-1">
                    Análise de Viabilidade Institucional
                  </span>
                  <h3 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">
                    Formulário de Cadastro Corporativo
                  </h3>
                </div>
                <ShieldCheck className="w-8 h-8 text-neutral-300 hidden sm:block" />
              </div>

              {/* Etapas de Funcionamento & Alertas de Segurança */}
              <div className="bg-neutral-50 border-b border-neutral-200 p-6 md:p-8 space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-neutral-400 block mb-3 text-center">
                    Como funciona o processo de destinação
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs relative">
                      <span className="text-[9px] font-black uppercase text-neutral-400 block">Passo 1</span>
                      <p className="text-xs font-bold text-neutral-800 leading-tight mt-0.5">Preencha os dados da empresa</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs relative">
                      <span className="text-[9px] font-black uppercase text-neutral-400 block">Passo 2</span>
                      <p className="text-xs font-bold text-neutral-800 leading-tight mt-0.5">Nossa equipe realiza análise de enquadramento</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs relative">
                      <span className="text-[9px] font-black uppercase text-neutral-400 block">Passo 3</span>
                      <p className="text-xs font-bold text-neutral-800 leading-tight mt-0.5">Apresentamos o potencial de incentivo via ICMS</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs relative">
                      <span className="text-[9px] font-black uppercase text-neutral-400 block">Passo 4</span>
                      <p className="text-xs font-bold text-neutral-800 leading-tight mt-0.5">Formalização institucional e direcionamento</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-white border-l-4 border-black p-3 rounded-r-xl shadow-xs">
                    <p className="text-[11px] text-neutral-700 font-bold uppercase tracking-wide">
                      📌 <strong className="text-black">Observação:</strong> A empresa apta e interessada deve preencher uma Carta de Interesse oficial que enviaremos posteriormente.
                    </p>
                  </div>
                  <div className="bg-neutral-900 text-neutral-300 p-3 rounded-xl shadow-xs text-center">
                    <p className="text-[10px] uppercase tracking-wider font-bold">
                      🔒 Seus dados são utilizados exclusivamente para análise institucional de potencial de incentivo fiscal esportivo. <strong className="text-white">Ou seja, não é o momento ainda de destinar o recurso, não há nenhuma cobrança.</strong>
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">
                
                {/* BLOCO 1: DADOS DA EMPRESA */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
                    <Building2 className="w-3.5 h-3.5 text-neutral-300" /> Dados da Empresa
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Razão Social *</label>
                      <input required type="text" placeholder="Ex: Empresa Exemplo S/A" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Nome Fantasia *</label>
                      <input required type="text" placeholder="Ex: Exemplo" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">CNPJ *</label>
                      <input required type="text" placeholder="00.000.000/0000-00" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Inscrição Estadual *</label>
                      <input required type="text" placeholder="Número da IE" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Segmento da Empresa</label>
                      <input type="text" placeholder="Ex: Indústria, Comércio, Varejo" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Quantidade de Funcionários</label>
                      <input type="text" placeholder="Ex: 50 a 200" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* BLOCO 2: ENDEREÇO */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-neutral-300" /> Endereço
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">CEP *</label>
                      <input required type="text" placeholder="00000-000" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Endereço *</label>
                      <input required type="text" placeholder="Rua, Avenida" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Número *</label>
                      <input required type="text" placeholder="Número" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Cidade *</label>
                      <input required type="text" placeholder="Cidade" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Estado *</label>
                      <input required type="text" placeholder="MG" defaultValue="MG" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* BLOCO 3: CONTATO PRINCIPAL */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
                    <UserCheck className="w-3.5 h-3.5 text-neutral-300" /> Contato Principal
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Nome do Responsável *</label>
                      <input required type="text" placeholder="Nome completo" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Cargo *</label>
                      <input required type="text" placeholder="Ex: Diretor, Gerente, Proprietário" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">WhatsApp *</label>
                      <input required type="tel" placeholder="(00) 90000-0000" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">E-mail Corporativo *</label>
                      <input required type="email" placeholder="nome@empresa.com.br" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* BLOCO 4: CONTADOR (Estratégico) */}
                <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200">
                    <div className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-300" /> Dados do Contador (Recomendado)
                    </div>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">Decisor Técnico</span>
                  </div>
                  
                  <p className="text-xs text-neutral-500 mb-4 font-medium">
                    O contador normalmente conduz o processo de redirecionamento do ICMS. Se preferir, informe os dados abaixo para que nossa equipe técnica faça o alinhamento direto.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Nome do Contador</label>
                      <input type="text" placeholder="Nome completo" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Escritório Contábil</label>
                      <input type="text" placeholder="Nome do escritório" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">WhatsApp do Contador</label>
                      <input type="tel" placeholder="(00) 90000-0000" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">E-mail do Contador</label>
                      <input type="email" placeholder="contador@escritorio.com.br" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
                    </div>
                  </div>
                </div>

                {/* BLOCO 5: DADOS PARA ANÁLISE DE POTENCIAL */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
                    <FileText className="w-3.5 h-3.5 text-neutral-300" /> Análise Institucional de Potencial
                  </div>
                  
                  <div className="space-y-6">
                    {/* Pergunta 1 */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-2">
                        Faixa média mensal de ICMS recolhido *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Até R$ 10 mil",
                          "R$ 10 mil a R$ 30 mil",
                          "R$ 30 mil a R$ 100 mil",
                          "Acima de R$ 100 mil"
                        ].map((opt) => (
                          <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${icmsRange === opt ? 'bg-black text-white border-black' : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-700'}`}>
                            <input 
                              required 
                              type="radio" 
                              name="icmsRange" 
                              value={opt} 
                              checked={icmsRange === opt}
                              onChange={() => setIcmsRange(opt)}
                              className="sr-only" 
                            />
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${icmsRange === opt ? 'border-white bg-black' : 'border-neutral-400 bg-white'}`}>
                              {icmsRange === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pergunta 2 */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-2">
                        Sua empresa recolhe ICMS em MG? *
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {["Sim", "Não", "Não sei informar"].map((opt) => (
                          <label key={opt} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${recolheIcms === opt ? 'bg-black text-white border-black' : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-700'}`}>
                            <input 
                              required 
                              type="radio" 
                              name="recolheIcms" 
                              value={opt} 
                              checked={recolheIcms === opt}
                              onChange={() => setRecolheIcms(opt)}
                              className="sr-only" 
                            />
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${recolheIcms === opt ? 'border-white bg-black' : 'border-neutral-400 bg-white'}`}>
                              {recolheIcms === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pergunta 3 */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-2">
                        Interesse principal da empresa *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Incentivo fiscal",
                          "Impacto social",
                          "Exposição da marca",
                          "Apoio ao esporte",
                          "Relacionamento institucional"
                        ].map((opt) => (
                          <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${interest === opt ? 'bg-black text-white border-black' : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-700'}`}>
                            <input 
                              required 
                              type="radio" 
                              name="interest" 
                              value={opt} 
                              checked={interest === opt}
                              onChange={() => setInterest(opt)}
                              className="sr-only" 
                            />
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${interest === opt ? 'border-white bg-black' : 'border-neutral-400 bg-white'}`}>
                              {interest === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* BLOCO 6: CHECKBOX DE AUTORIZAÇÃO */}
                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl flex items-start gap-3">
                  <input 
                    id="auth"
                    type="checkbox" 
                    checked={authorized}
                    onChange={(e) => setAuthorized(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer" 
                  />
                  <label htmlFor="auth" className="text-xs text-neutral-700 font-bold select-none cursor-pointer leading-tight">
                    Autorizo o contato da equipe do Gameleira FC para análise de potencial de incentivo fiscal esportivo com base nos dados fornecidos.
                  </label>
                </div>

                {/* Botão Submit */}
                <button 
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 text-white font-black uppercase italic tracking-widest text-sm py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:scale-110 transition-transform" /> Solicitar Estudo Sem Compromisso
                </button>

              </form>
            </div>
          </section>

          {/* FRASE DE IMPACTO FINAL */}
          <footer className="bg-black text-white py-16 px-6 text-center border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-100">
                “FORTALEÇA A IMAGEM DA SUA EMPRESA COM UM PATROCÍNIO INSTITUCIONAL FINANCIADO PELO PRÓPRIO ICMS.”
              </h3>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                GAMELEIRA — Agregando Valor à sua Marca através do Desenvolvimento Local
              </p>
            </div>
          </footer>
        </>
      )}

    </div>
  );
}
