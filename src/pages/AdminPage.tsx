import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileText, 
  Search, 
  X, 
  ChevronRight, 
  RefreshCw, 
  MapPin, 
  Briefcase,
  ArrowLeft,
  Check,
  Edit3,
  AlertCircle,
  BarChart3,
  PieChart,
  ShieldAlert,
  BellRing,
  ExternalLink,
  Save
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Tipagem de Leads
interface CorporateLead {
  id: string;
  razao_social: string;
  cnpj: string;
  nome_responsavel: string;
  cargo: string | null;
  email: string;
  telefone: string;
  icms_mensal_estimado: number;
  regime_tributario: string;
  potencial_anual_estimado: number;
  status: string;
  carta_interesse_url: string | null;
  valor_captado_real: number;
  observacoes_internas: string | null;
  created_at: string;
}

// Dados de Demonstração de Altíssimo Padrão
const INITIAL_DEMO_LEADS: CorporateLead[] = [
  {
    id: 'demo-1',
    razao_social: 'Vale do Aço Indústria e Logística S/A',
    cnpj: '12.345.678/0001-90',
    nome_responsavel: 'Carlos Eduardo Drummond',
    cargo: 'Diretor Financeiro',
    email: 'carlos.drummond@valedoaco.com.br',
    telefone: '(31) 98888-7777',
    icms_mensal_estimado: 85000,
    regime_tributario: 'real',
    potencial_anual_estimado: 30600,
    status: 'falta_carta',
    carta_interesse_url: null,
    valor_captado_real: 0,
    observacoes_internas: JSON.stringify({
      nome_fantasia: 'Vale do Aço Logística',
      ie: '123.456.789/00',
      segmento: 'Siderurgia e Logística',
      qtd_func: '350',
      cep: '35160-000',
      endereco: 'Av. Industrial, 1500',
      numero: '1500',
      cidade: 'Ipatinga',
      estado: 'MG',
      contador_nome: 'Mariana Silva',
      contador_escritorio: 'MS Contabilidade Estratégica',
      contador_telefone: '(31) 99999-1111',
      contador_email: 'mariana@mscont.com.br',
      faixa_icms: 'R$ 30 mil a R$ 100 mil',
      recolhe_icms_mg: 'Sim',
      interesse_principal: 'Incentivo fiscal'
    }, null, 2),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'demo-2',
    razao_social: 'Supermercados Alvorada Ltda',
    cnpj: '98.765.432/0001-10',
    nome_responsavel: 'Roberto Souza Ramos',
    cargo: 'Proprietário',
    email: 'diretoria@superalvorada.com.br',
    telefone: '(33) 99111-2222',
    icms_mensal_estimado: 120000,
    regime_tributario: 'real',
    potencial_anual_estimado: 43200,
    status: 'captada',
    carta_interesse_url: 'https://exemplo.com/carta-assinada.pdf',
    valor_captado_real: 43200,
    observacoes_internas: JSON.stringify({
      nome_fantasia: 'Alvorada Supermercados',
      ie: '987.654.321/01',
      segmento: 'Varejo Alimentício',
      qtd_func: '180',
      cep: '35330-000',
      endereco: 'Rua Principal, 45',
      numero: '45',
      cidade: 'Ubaporanga',
      estado: 'MG',
      contador_nome: 'Geraldo Magela',
      contador_escritorio: 'Contabilidade Magela',
      contador_telefone: '(33) 98888-5555',
      contador_email: 'contato@magelacont.com.br',
      faixa_icms: 'Acima de R$ 100 mil',
      recolhe_icms_mg: 'Sim',
      interesse_principal: 'Impacto social e Exposição'
    }, null, 2),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'demo-3',
    razao_social: 'Construtora Horizonte Mineiro S/A',
    cnpj: '45.123.890/0001-55',
    nome_responsavel: 'Fernanda Albuquerque',
    cargo: 'Diretora de Relações Institucionais',
    email: 'falbuquerque@horizontemineiro.com.br',
    telefone: '(31) 97777-4444',
    icms_mensal_estimado: 45000,
    regime_tributario: 'real',
    potencial_anual_estimado: 16200,
    status: 'aprovada',
    carta_interesse_url: null,
    valor_captado_real: 0,
    observacoes_internas: JSON.stringify({
      nome_fantasia: 'Horizonte Mineiro',
      ie: '451.238.900/01',
      segmento: 'Construção Civil',
      qtd_func: '120',
      cep: '30130-000',
      endereco: 'Av. Afonso Pena, 2500',
      numero: '2500',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      contador_nome: '',
      contador_escritorio: '',
      contador_telefone: '',
      contador_email: '',
      faixa_icms: 'R$ 30 mil a R$ 100 mil',
      recolhe_icms_mg: 'Sim',
      interesse_principal: 'Apoio ao esporte e Reputação'
    }, null, 2),
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const STATUS_OPTIONS = [
  { key: 'pendente_analise', label: 'Em Análise Inicial', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { key: 'aprovada', label: 'Aprovada (Enquadrada)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { key: 'precisa_seimg', label: 'Pendente SEI!MG', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { key: 'falta_carta', label: 'Falta Carta Interesse', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { key: 'captada', label: 'Captada Sucesso', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold' },
  { key: 'nao_aprovada', label: 'Não Enquadrada', color: 'bg-neutral-800 text-neutral-400 border-neutral-700' }
];

export default function AdminPage() {
  // Navegação da Sidebar: 'dashboard' | 'empresas' | 'valores'
  const [activeSection, setActiveSection] = useState<'dashboard' | 'empresas' | 'valores'>('dashboard');
  
  const [leads, setLeads] = useState<CorporateLead[]>(INITIAL_DEMO_LEADS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  
  // Controles de listagem
  const [activeTabStatus, setActiveTabStatus] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Drawer CRM
  const [selectedLead, setSelectedLead] = useState<CorporateLead | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>('');
  const [editingValor, setEditingValor] = useState<string>('');
  const [editingCartaUrl, setEditingCartaUrl] = useState<string>('');
  const [savingAction, setSavingAction] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Estados de edição em lote para a tela de Valores Captados
  const [batchValues, setBatchValues] = useState<Record<string, string>>({});

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('empresas_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setLeads(INITIAL_DEMO_LEADS);
        setIsDemoMode(true);
        // Inicializa batch values
        const initialBatch: Record<string, string> = {};
        INITIAL_DEMO_LEADS.forEach(l => {
          initialBatch[l.id] = l.valor_captado_real ? l.valor_captado_real.toString() : '';
        });
        setBatchValues(initialBatch);
      } else {
        const liveData = data as CorporateLead[];
        setLeads(liveData);
        setIsDemoMode(false);
        const initialBatch: Record<string, string> = {};
        liveData.forEach(l => {
          initialBatch[l.id] = l.valor_captado_real ? l.valor_captado_real.toString() : '';
        });
        setBatchValues(initialBatch);
      }
    } catch (err) {
      console.error('Erro de conexão Supabase:', err);
      setLeads(INITIAL_DEMO_LEADS);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Abrir Drawer
  const handleOpenLead = (lead: CorporateLead) => {
    setSelectedLead(lead);
    setEditingStatus(lead.status);
    setEditingValor(lead.valor_captado_real ? lead.valor_captado_real.toString() : '0');
    setEditingCartaUrl(lead.carta_interesse_url || '');
  };

  // Salvar no Drawer
  const handleSaveChanges = async () => {
    if (!selectedLead) return;
    setSavingAction(true);
    
    const valorRealNum = parseFloat(editingValor) || 0;
    
    const updatedList = leads.map(item => {
      if (item.id === selectedLead.id) {
        return {
          ...item,
          status: editingStatus,
          valor_captado_real: valorRealNum,
          carta_interesse_url: editingCartaUrl ? editingCartaUrl : null
        };
      }
      return item;
    });

    setLeads(updatedList);
    setBatchValues(prev => ({ ...prev, [selectedLead.id]: valorRealNum.toString() }));
    
    const updatedSelected = updatedList.find(l => l.id === selectedLead.id) || null;
    setSelectedLead(updatedSelected);

    if (!selectedLead.id.startsWith('demo-')) {
      try {
        await supabase
          .from('empresas_leads')
          .update({
            status: editingStatus,
            valor_captado_real: valorRealNum,
            carta_interesse_url: editingCartaUrl ? editingCartaUrl : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedLead.id);
      } catch (e) {
        console.error('Erro ao atualizar Supabase:', e);
      }
    }

    setSavingAction(false);
    showToast('Lead atualizado com sucesso!');
  };

  // Salvar valor isolado na tela de Valores Captados
  const handleSaveInlineValue = async (leadId: string) => {
    const stringVal = batchValues[leadId] || '0';
    const numVal = parseFloat(stringVal) || 0;

    const updatedList = leads.map(item => {
      if (item.id === leadId) {
        // Se colocar um valor efetivo, marca como captada para facilidade operacional
        const nextStatus = numVal > 0 && item.status === 'pendente_analise' ? 'captada' : item.status;
        return { ...item, valor_captado_real: numVal, status: nextStatus };
      }
      return item;
    });

    setLeads(updatedList);

    if (!leadId.startsWith('demo-')) {
      try {
        const targetLead = updatedList.find(l => l.id === leadId);
        await supabase
          .from('empresas_leads')
          .update({
            valor_captado_real: numVal,
            status: targetLead?.status || 'captada',
            updated_at: new Date().toISOString()
          })
          .eq('id', leadId);
      } catch (e) {
        console.error('Erro ao atualizar inline:', e);
      }
    }
    showToast('Valor de captação reajustado com sucesso!');
  };

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Agregações de negócio
  const totalEmpresas = leads.length;
  const totalPotencial = leads.reduce((sum, item) => sum + (item.potencial_anual_estimado || 0), 0);
  const totalCaptado = leads.reduce((sum, item) => sum + (item.valor_captado_real || 0), 0);
  
  // Contagem do Funil para Gráficos
  const funnelCounts = STATUS_OPTIONS.map(opt => ({
    ...opt,
    count: leads.filter(l => l.status === opt.key).length
  }));

  // Decodificação segura do JSON
  const getObservacoesObj = (obsString: string | null) => {
    if (!obsString) return null;
    try { return JSON.parse(obsString); } catch { return null; }
  };

  const getStatusInfo = (statusCode: string) => {
    return STATUS_OPTIONS.find(s => s.key === statusCode) || { label: statusCode, color: 'bg-neutral-900 text-neutral-400 border-neutral-800' };
  };

  // Filtragem na tela de Empresas
  const filteredLeads = leads.filter(item => {
    const matchesTab = activeTabStatus === 'todas' || item.status === activeTabStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.razao_social.toLowerCase().includes(q) || 
                          item.cnpj.includes(q) || 
                          item.nome_responsavel.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  // Empresas listadas na aba "Valores Captados" (ordenadas por quem já contribuiu ou tem potencial alto)
  const financialLeads = [...leads].sort((a, b) => b.valor_captado_real - a.valor_captado_real);

  return (
    <div className="flex min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-white selection:text-black">
      
      {/* MENSAGEM TOAST GERAL */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-100 text-neutral-950 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-neutral-300 animate-slide-up font-bold text-sm">
          <Check className="w-4 h-4 text-emerald-600" /> {feedbackMsg}
        </div>
      )}

      {/* 🟢 MENU ESQUERDO (SIDEBAR FIXA DE ALTO PADRÃO B2B) */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between flex-shrink-0 select-none hidden md:flex">
        
        {/* Topo da Sidebar: Brand e Conexão */}
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-neutral-800/80 bg-neutral-950/40 flex items-center gap-3">
            <img src="/escudo.png" alt="Gameleira" className="h-9 w-auto filter drop-shadow-md" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block leading-none">B2B Core Admin</span>
              <span className="text-base font-black tracking-tight text-white leading-tight">GAMELEIRA</span>
            </div>
          </div>

          {/* Links de Navegação Principal */}
          <nav className="p-4 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 block px-3 mb-2">
              Navegação
            </span>

            {/* Botão 1: Dashboard */}
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer group ${activeSection === 'dashboard' ? 'bg-white text-black shadow-md font-black' : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeSection === 'dashboard' ? 'text-black' : 'text-neutral-400'}`} />
                <span>Dashboard</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans ${activeSection === 'dashboard' ? 'bg-neutral-200 text-black font-black' : 'bg-neutral-800 text-neutral-500'}`}>
                Grafs
              </span>
            </button>

            {/* Botão 2: Empresas */}
            <button
              onClick={() => setActiveSection('empresas')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer group ${activeSection === 'empresas' ? 'bg-white text-black shadow-md font-black' : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeSection === 'empresas' ? 'text-black' : 'text-neutral-400'}`} />
                <span>Empresas</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeSection === 'empresas' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                {leads.length}
              </span>
            </button>

            {/* Botão 3: Valores Captados */}
            <button
              onClick={() => setActiveSection('valores')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer group ${activeSection === 'valores' ? 'bg-gradient-to-r from-neutral-200 to-white text-black shadow-md font-black' : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeSection === 'valores' ? 'text-black' : 'text-neutral-400'}`} />
                <span>Valores Captados</span>
              </div>
              {totalCaptado > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/20 space-y-3">
          {isDemoMode ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[10px] text-amber-400 font-medium">
              <div className="flex items-center gap-1 font-bold mb-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" /> Modo Simulação
              </div>
              Bypass ativo. Cadastros reais entram no Supabase.
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 text-[10px] text-emerald-400 font-mono text-center truncate">
              Conexão DB Live Ativa
            </div>
          )}

          <a 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-2 bg-neutral-950 hover:bg-black text-neutral-400 hover:text-white rounded-xl text-xs font-bold transition-colors border border-neutral-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Portal
          </a>
        </div>
      </aside>

      {/* 🔵 ÁREA CENTRAL DE CONTEÚDO */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Responsivo (Para Mobile e Comandos Rápidos) */}
        <header className="bg-neutral-900/60 border-b border-neutral-800 py-3 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 md:hidden">
            <img src="/escudo.png" alt="Gameleira" className="h-7 w-auto" />
            <span className="text-sm font-black text-white">GAMELEIRA</span>
          </div>
          
          {/* Navegação Mobile Rápida em Pílulas */}
          <div className="flex items-center gap-1 md:hidden overflow-x-auto max-w-xs">
            {[
              { id: 'dashboard', label: 'Dash' },
              { id: 'empresas', label: 'Empresas' },
              { id: 'valores', label: 'Valores' }
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => setActiveSection(m.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${activeSection === m.id ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <span className="text-xs text-neutral-400 font-medium hidden sm:inline-block">
              Setor: <strong className="text-white uppercase">{activeSection}</strong>
            </span>
            <button 
              onClick={fetchLeads} 
              disabled={loading}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-all border border-neutral-700 inline-flex items-center gap-1 text-xs font-bold"
              title="Recarregar do Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </header>

        {/* MOLDURA INTERNA DO CONTEÚDO ATIVO */}
        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8 flex-grow">
          
          {/* ========================================================= */}
          {/* VIEW 1: DASHBOARD (CARDS, GRÁFICOS, ALERTAS) */}
          {/* ========================================================= */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Título da Seção */}
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-neutral-500 block">
                  Visão Geral da Organização
                </span>
                <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase">
                  Métricas de Captação B2B
                </h1>
              </div>

              {/* CARDS INDICADORES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1 */}
                <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl relative shadow-xs">
                  <div className="flex justify-between items-start text-neutral-400 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider">Total de Leads</span>
                    <Users className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="text-3xl font-black italic text-white tracking-tight">
                    {totalEmpresas}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-bold uppercase mt-1">
                    Prospectos no Funil
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl relative shadow-xs">
                  <div className="flex justify-between items-start text-neutral-400 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider">Potencial ICMS 3%</span>
                    <TrendingUp className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black italic text-neutral-200 tracking-tight truncate">
                    {totalPotencial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-bold uppercase mt-1">
                    Estimativa Anual Bruta
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl relative shadow-xs">
                  <div className="flex justify-between items-start text-neutral-400 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider">Cartas de Interesse</span>
                    <FileText className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="text-3xl font-black italic text-white tracking-tight">
                    {leads.filter(l => l.status === 'captada' || l.status === 'falta_carta' || l.carta_interesse_url).length}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-bold uppercase mt-1">
                    Empresas Alinhadas
                  </div>
                </div>

                {/* Card 4 - Destaque Absoluto Premium Platinado */}
                <div className="bg-gradient-to-br from-neutral-200 via-white to-neutral-300 text-black p-5 rounded-2xl border border-white relative shadow-xl overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-black/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start text-neutral-700 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider">Total Captado Real</span>
                    <div className="p-1 bg-black text-white rounded-lg">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black italic tracking-tight text-neutral-950 truncate">
                    {totalCaptado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-neutral-600 font-black uppercase mt-1">
                    Aportes Consolidados
                  </div>
                </div>

              </div>

              {/* SEÇÃO GRÁFICOS VISUAIS (NATIVOS COM EXCELÊNCIA ESTÉTICA) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Gráfico 1: Distribuição do Funil */}
                <div className="lg:col-span-2 bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl space-y-4 backdrop-blur-xs">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-neutral-300">
                      <BarChart3 className="w-4 h-4 text-neutral-400" /> Distribuição do Funil Corporativo
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">Taxa de Conversão</span>
                  </div>

                  {/* Barras de progresso do funil */}
                  <div className="space-y-3.5 pt-2">
                    {funnelCounts.map(item => {
                      const percentage = totalEmpresas > 0 ? Math.round((item.count / totalEmpresas) * 100) : 0;
                      
                      return (
                        <div key={item.key} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-neutral-300 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-neutral-400" /> {item.label}
                            </span>
                            <span className="text-neutral-400 font-mono">
                              {item.count} <span className="text-neutral-600 font-normal">({percentage}%)</span>
                            </span>
                          </div>
                          {/* Barra Platinada/Escura */}
                          <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800/80">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${item.key === 'captada' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-neutral-500 to-neutral-200'}`}
                              style={{ width: `${Math.max(percentage, item.count > 0 ? 3 : 0)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Alertas Estratégicos Nativos */}
                <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 backdrop-blur-xs">
                  <div>
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-neutral-300 border-b border-neutral-800 pb-3 mb-4">
                      <BellRing className="w-4 h-4 text-amber-400" /> Central de Alertas
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Alerta 1 */}
                      <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block">Diagnóstico de Enquadramento</span>
                        <p className="text-neutral-300 leading-snug">
                          {leads.filter(l => l.status === 'pendente_analise').length} novas empresas requerem análise inicial de viabilidade técnica.
                        </p>
                      </div>

                      {/* Alerta 2 */}
                      <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">Meta Financeira</span>
                        <p className="text-neutral-400 leading-snug">
                          O potencial bruto de ICMS atingido cobre <strong className="text-white">100%</strong> das cotas de patrocínio planejadas.
                        </p>
                      </div>

                      {/* Alerta 3 */}
                      <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 block">Formalização</span>
                        <p className="text-neutral-400 leading-snug">
                          Lembrete: Enviar link da Carta de Interesse oficial para empresas no status <strong className="text-neutral-200">"Pendente SEI!MG"</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveSection('empresas')}
                    className="w-full text-center py-2.5 bg-neutral-950 hover:bg-black text-neutral-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-neutral-800 block"
                  >
                    Ver Tabela Completa →
                  </button>
                </div>

              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* VIEW 2: EMPRESAS (CRM GERAL, BUSCA E FILTROS) */}
          {/* ========================================================= */}
          {activeSection === 'empresas' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Título da Seção */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-500 block">
                    Base de Relações Corporativas
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase">
                    Gestão de Empresas Leads
                  </h1>
                </div>

                <div className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
                  Total Listado: <strong className="text-white">{filteredLeads.length}</strong>
                </div>
              </div>

              {/* BARRA DE BUSCA E ABAS */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-4">
                
                {/* Input Buscador */}
                <div className="relative max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar por Razão Social, CNPJ ou Nome do Contato..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Abas Horizontais */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-800">
                  {[
                    { key: 'todas', label: 'Todas' },
                    { key: 'pendente_analise', label: 'Em Análise' },
                    { key: 'aprovada', label: 'Aprovadas' },
                    { key: 'precisa_seimg', label: 'SEI!MG' },
                    { key: 'falta_carta', label: 'Falta Carta' },
                    { key: 'captada', label: 'Captadas' },
                    { key: 'nao_aprovada', label: 'Não Aprovadas' }
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTabStatus(t.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${activeTabStatus === t.key ? 'bg-white text-black shadow-xs' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TABELA PRINCIPAL DE EMPRESAS */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-950/40 text-[10px] uppercase font-black tracking-widest text-neutral-500">
                        <th className="p-4 pl-6">Razão Social / Local</th>
                        <th className="p-4">Contato</th>
                        <th className="p-4">Potencial ICMS</th>
                        <th className="p-4">Etapa do Funil</th>
                        <th className="p-4 pr-6 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 text-xs">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-neutral-500 font-medium">
                            Nenhuma empresa condiz com o termo buscado.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((item) => {
                          const statusInfo = getStatusInfo(item.status);
                          const obsObj = getObservacoesObj(item.observacoes_internas);
                          
                          return (
                            <tr 
                              key={item.id}
                              onClick={() => handleOpenLead(item)}
                              className="hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                            >
                              {/* Empresa */}
                              <td className="p-4 pl-6 max-w-xs">
                                <div className="font-bold text-white truncate group-hover:text-neutral-200">
                                  {item.razao_social}
                                </div>
                                <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                                  {item.cnpj} {obsObj?.cidade && <span className="text-neutral-600 font-sans">• {obsObj.cidade}-{obsObj.estado}</span>}
                                </div>
                              </td>

                              {/* Contato */}
                              <td className="p-4 max-w-xs truncate">
                                <div className="font-bold text-neutral-200 truncate">{item.nome_responsavel}</div>
                                <div className="text-[11px] text-neutral-500 truncate">{item.telefone}</div>
                              </td>

                              {/* Potencial */}
                              <td className="p-4 font-mono font-medium text-neutral-300">
                                {item.potencial_anual_estimado ? item.potencial_anual_estimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : 'R$ 0'}
                              </td>

                              {/* Status Pílula */}
                              <td className="p-4">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </td>

                              {/* Botão Acessar */}
                              <td className="p-4 pr-6 text-right">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleOpenLead(item); }}
                                  className="p-1.5 bg-neutral-950 group-hover:bg-neutral-800 text-neutral-400 group-hover:text-white rounded-lg transition-colors inline-flex items-center gap-1 border border-neutral-800"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* VIEW 3: VALORES CAPTADOS (CONTROLE FINANCEIRO PURO) */}
          {/* ========================================================= */}
          {activeSection === 'valores' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Título da Seção */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-500 block">
                    Auditoria de Destinação Financeira
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase">
                    Valores Captados Realizados
                  </h1>
                </div>

                {/* Mini Resumo de Arrecadação */}
                <div className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Arrecadação Total Consolidada</span>
                  <span className="text-xl font-black italic text-emerald-400 font-mono">
                    {totalCaptado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Explicação da tela */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-xs text-neutral-400">
                📌 Aqui constam todas as empresas com aportes configurados ou em vias de destinação. Você pode ajustar ou digitar os valores arrecadados em cada uma instantaneamente e salvar na própria linha.
              </div>

              {/* LISTA FINANCEIRA PRÁTICA */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-950/40 text-[10px] uppercase font-black tracking-widest text-neutral-500">
                        <th className="p-4 pl-6">Razão Social</th>
                        <th className="p-4">Status Atual</th>
                        <th className="p-4">Potencial de Cálculo</th>
                        <th className="p-4">Valor Efetivo Captado (R$)</th>
                        <th className="p-4 pr-6 text-right">Lançar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 text-xs">
                      {financialLeads.map((item) => {
                        const statusInfo = getStatusInfo(item.status);
                        const isContributed = item.valor_captado_real > 0;
                        const inputValue = batchValues[item.id] ?? (item.valor_captado_real ? item.valor_captado_real.toString() : '');

                        return (
                          <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                            {/* Razão Social */}
                            <td className="p-4 pl-6">
                              <div className="font-bold text-white truncate max-w-xs">{item.razao_social}</div>
                              <div className="text-[10px] text-neutral-500 font-mono">{item.cnpj}</div>
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </td>

                            {/* Potencial Estimado base */}
                            <td className="p-4 font-mono text-neutral-400">
                              {item.potencial_anual_estimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                            </td>

                            {/* Input Editável na Tabela */}
                            <td className="p-4 max-w-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="text-neutral-500 font-mono text-xs">R$</span>
                                <input 
                                  type="number"
                                  value={inputValue}
                                  onChange={(e) => setBatchValues(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  placeholder="0"
                                  className={`w-32 bg-neutral-950 border rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-white transition-colors ${isContributed ? 'border-emerald-500/50 text-emerald-400' : 'border-neutral-800 text-neutral-200'}`}
                                />
                              </div>
                            </td>

                            {/* Botão de salvar específico */}
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() => handleSaveInlineValue(item.id)}
                                className="px-3 py-1.5 bg-neutral-950 hover:bg-white text-neutral-300 hover:text-black rounded-lg text-xs font-bold transition-all border border-neutral-800 inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Salvar</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* 4. DRAWER LATERAL INTERATIVO (PRESERVA DETALHES AVANÇADOS) */}
      {/* ========================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Overlay Escuro */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-fade-in" 
            onClick={() => setSelectedLead(null)}
          />

          {/* Janela Deslizante */}
          <div className="relative w-full max-w-2xl bg-neutral-900 border-l border-neutral-800 h-full overflow-y-auto z-10 flex flex-col text-neutral-100 shadow-2xl animate-slide-left">
            
            {/* Header do Drawer */}
            <div className="p-6 bg-neutral-950 border-b border-neutral-800 flex justify-between items-start sticky top-0 z-20">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
                  Ficha do Prospecto B2B
                </span>
                <h3 className="text-xl font-black italic text-white uppercase tracking-tight pr-4">
                  {selectedLead.razao_social}
                </h3>
                <span className="text-xs text-neutral-400 font-mono mt-1 block">CNPJ: {selectedLead.cnpj}</span>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Drawer */}
            <div className="p-6 space-y-6 flex-grow">
              
              {/* BLOCO DE EDIÇÃO E RECLASSIFICAÇÃO */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4 shadow-inner">
                <div className="text-xs font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
                  ⚡ Ajustar Funil e Financeiro
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Etapa Funil */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">Status do Lead</label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Valor Fechado */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Aporte Finalizado Real (R$)
                    </label>
                    <input 
                      type="number"
                      value={editingValor}
                      onChange={(e) => setEditingValor(e.target.value)}
                      placeholder="0"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Carta de Interesse */}
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Link da Carta de Interesse Assinada (PDF)
                  </label>
                  <input 
                    type="url"
                    value={editingCartaUrl}
                    onChange={(e) => setEditingCartaUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                  {editingCartaUrl && (
                    <a 
                      href={editingCartaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                    >
                      <span>Abrir Carta Anexada</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Botão Salvar Modal */}
                <button
                  onClick={handleSaveChanges}
                  disabled={savingAction}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-black uppercase italic tracking-widest text-xs py-3 rounded-xl transition-all shadow-md mt-2 cursor-pointer"
                >
                  {savingAction ? 'Salvando...' : 'Aplicar Reclassificação e Fechamento'}
                </button>
              </div>

              {/* DADOS DE CONTATO PRIMÁRIOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Representante Legal</span>
                  <div className="font-bold text-white">{selectedLead.nome_responsavel}</div>
                  <div className="text-[11px] text-neutral-400">{selectedLead.cargo || 'Responsável'}</div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-2">WhatsApp: <strong className="text-white">{selectedLead.telefone}</strong></div>
                  <div className="text-[11px] text-neutral-400 truncate">E-mail: <strong className="text-white">{selectedLead.email}</strong></div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Mapeamento Estimado</span>
                  <div className="text-neutral-400">Base Mensal: <strong className="text-white font-mono">{selectedLead.icms_mensal_estimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
                  <div className="text-neutral-400 mt-1">Regime: <strong className="text-white uppercase">{selectedLead.regime_tributario}</strong></div>
                  <div className="text-emerald-400 font-mono mt-2 border-t border-neutral-800 pt-1.5 font-bold">
                    Potencial: {selectedLead.potencial_anual_estimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}/ano
                  </div>
                </div>
              </div>

              {/* DIAGNÓSTICO AVANÇADO (JSON OBSERVACÕES INTERNAS) */}
              {(() => {
                const obsObj = getObservacoesObj(selectedLead.observacoes_internas);
                if (!obsObj) return null;

                return (
                  <div className="space-y-4 pt-2 border-t border-neutral-800">
                    <span className="text-xs font-black uppercase tracking-widest text-neutral-400 block">
                      📋 Dados Completos do Questionário Inicial
                    </span>

                    {/* Cadastral */}
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                      <div className="font-bold text-neutral-300 pb-1 border-b border-neutral-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-neutral-500" /> Detalhes da Operação
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span className="text-neutral-500">Fantasia:</span> <strong className="text-neutral-200">{obsObj.nome_fantasia || '—'}</strong></div>
                        <div><span className="text-neutral-500">Inscrição Est.:</span> <strong className="text-neutral-200">{obsObj.ie || '—'}</strong></div>
                        <div><span className="text-neutral-500">Segmento:</span> <strong className="text-neutral-200">{obsObj.segmento || '—'}</strong></div>
                        <div><span className="text-neutral-500">Funcionários:</span> <strong className="text-neutral-200">{obsObj.qtd_func || '—'}</strong></div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-neutral-900 text-[11px]">
                        <span className="text-neutral-500 block mb-0.5">Endereço Informado:</span>
                        <div className="text-neutral-200 font-medium">
                          {obsObj.endereco}, {obsObj.numero} — {obsObj.cidade}-{obsObj.estado} (CEP: {obsObj.cep})
                        </div>
                      </div>
                    </div>

                    {/* Contador */}
                    {(obsObj.contador_nome || obsObj.contador_escritorio) && (
                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                        <div className="font-bold text-neutral-300 pb-1 border-b border-neutral-900 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-neutral-500" /> Decisor Técnico (Contador Indicado)
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div><span className="text-neutral-500">Nome:</span> <strong className="text-neutral-200">{obsObj.contador_nome || '—'}</strong></div>
                          <div><span className="text-neutral-500">Escritório:</span> <strong className="text-neutral-200">{obsObj.contador_escritorio || '—'}</strong></div>
                          <div><span className="text-neutral-500">WhatsApp:</span> <strong className="text-neutral-200 font-mono">{obsObj.contador_telefone || '—'}</strong></div>
                          <div className="truncate"><span className="text-neutral-500">E-mail:</span> <strong className="text-neutral-200">{obsObj.contador_email || '—'}</strong></div>
                        </div>
                      </div>
                    )}

                    {/* Engajamento */}
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1 text-xs text-neutral-300">
                      <div className="font-bold text-xs pb-1 text-white">Engajamento Declarado:</div>
                      <div><span className="text-neutral-500">Recolhe em MG?</span> <strong className="text-white">{obsObj.recolhe_icms_mg || '—'}</strong></div>
                      <div><span className="text-neutral-500">Faixa ICMS:</span> <strong className="text-white">{obsObj.faixa_icms || '—'}</strong></div>
                      <div><span className="text-neutral-500">Interesse Foco:</span> <strong className="text-white">{obsObj.interesse_principal || '—'}</strong></div>
                    </div>
                  </div>
                );
              })()}

              <div className="text-[10px] text-neutral-600 text-center pt-2">
                Submissão do forms: {new Date(selectedLead.created_at).toLocaleString('pt-BR')}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
