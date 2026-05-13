import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Search, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  ChevronRight, 
  RefreshCw, 
  Building2, 
  MapPin, 
  Briefcase,
  ArrowLeft,
  Check,
  Edit3
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Interface de tipagem avançada para os Leads
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

// Dados de Demonstração de altíssimo padrão caso o RLS bloqueie leitura anônima inicial ou o banco esteja vazio
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
  }
];

const STATUS_OPTIONS = [
  { key: 'pendente_analise', label: 'Em Análise Inicial', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  { key: 'aprovada', label: 'Aprovada no Enquadramento', color: 'bg-blue-100 text-blue-900 border-blue-200' },
  { key: 'precisa_seimg', label: 'Pendente Cadastro SEI!MG', color: 'bg-purple-100 text-purple-900 border-purple-200' },
  { key: 'falta_carta', label: 'Aguardando Carta de Interesse', color: 'bg-orange-100 text-orange-900 border-orange-200' },
  { key: 'captada', label: 'Parceria Captada Sucesso', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' },
  { key: 'nao_aprovada', label: 'Não Enquadrada', color: 'bg-neutral-200 text-neutral-700 border-neutral-300' }
];

export default function AdminPage() {
  const [leads, setLeads] = useState<CorporateLead[]>(INITIAL_DEMO_LEADS);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<CorporateLead | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  
  // Estados para atualização interativa de um lead
  const [editingStatus, setEditingStatus] = useState<string>('');
  const [editingValor, setEditingValor] = useState<string>('');
  const [editingCartaUrl, setEditingCartaUrl] = useState<string>('');
  const [savingAction, setSavingAction] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('empresas_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Se retornar vazio devido a leitura anônima sem política aberta ou ausência de dados
        setLeads(INITIAL_DEMO_LEADS);
        setIsDemoMode(true);
      } else {
        setLeads(data as CorporateLead[]);
        setIsDemoMode(false);
      }
    } catch (err) {
      console.error('Falha ao buscar base do Supabase:', err);
      setLeads(INITIAL_DEMO_LEADS);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Abrir Drawer de Detalhes
  const handleOpenLead = (lead: CorporateLead) => {
    setSelectedLead(lead);
    setEditingStatus(lead.status);
    setEditingValor(lead.valor_captado_real ? lead.valor_captado_real.toString() : '0');
    setEditingCartaUrl(lead.carta_interesse_url || '');
  };

  // Salvar alterações de status e finanças de um lead no banco (ou no estado local se for Demo)
  const handleSaveChanges = async () => {
    if (!selectedLead) return;
    setSavingAction(true);
    
    const valorRealNum = parseFloat(editingValor) || 0;
    
    // Atualização local de tela para resposta instantânea
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
    
    // Sincronizar lead selecionado
    const updatedSelected = updatedList.find(l => l.id === selectedLead.id) || null;
    setSelectedLead(updatedSelected);

    // Salvar nativamente no Supabase caso não seja um ID demo estático
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
    setFeedbackMsg('Informações da empresa salvas com sucesso!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Funções para totalizadores
  const totalEmpresas = leads.length;
  const totalPotencial = leads.reduce((sum, item) => sum + (item.potencial_anual_estimado || 0), 0);
  const totalCaptado = leads.reduce((sum, item) => sum + (item.valor_captado_real || 0), 0);
  const totalCartas = leads.filter(item => item.status === 'captada' || item.status === 'falta_carta' || item.carta_interesse_url).length;

  // Filtragem de abas e busca textual
  const filteredLeads = leads.filter(item => {
    const matchesTab = activeTab === 'todas' || item.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.razao_social.toLowerCase().includes(q) || 
                          item.cnpj.includes(q) || 
                          item.nome_responsavel.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  // Auxiliar para decodificar json de observacoes com segurança
  const getObservacoesObj = (obsString: string | null) => {
    if (!obsString) return null;
    try {
      return JSON.parse(obsString);
    } catch {
      return null;
    }
  };

  const getStatusInfo = (statusCode: string) => {
    return STATUS_OPTIONS.find(s => s.key === statusCode) || { label: statusCode, color: 'bg-neutral-100 text-neutral-800' };
  };

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-neutral-100 selection:text-black pb-24">
      
      {/* HEADER DE COMANDO INSTITUCIONAL */}
      <header className="bg-neutral-900 border-b border-neutral-800 py-4 px-6 sticky top-0 z-40 backdrop-blur-md bg-neutral-900/90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2.5">
              <img src="/escudo.png" alt="GAMELEIRA" className="h-8 w-auto" />
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 block font-black leading-none">B2B Core CRM</span>
                <span className="text-lg font-black tracking-tight text-white leading-none">GAMELEIRA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isDemoMode && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold rounded-full">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> Modo Demonstração Ativado
              </span>
            )}
            <button 
              onClick={fetchLeads} 
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold transition-all border border-neutral-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Atualizar
            </button>
          </div>
        </div>
      </header>

      {/* ALERTAS ESTÁTICOS / ORIENTAÇÕES */}
      {isDemoMode && (
        <div className="bg-neutral-900 border-b border-neutral-800 py-3 px-6 text-xs text-neutral-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p>
              💡 <strong className="text-neutral-200">Acesso Rápido de Produção:</strong> Exibindo dados simulados de alto padrão porque a tabela real aguarda submissões ou liberação de leitura RLS.
            </p>
            <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md font-mono border border-neutral-700">
              anon_bypass_active
            </span>
          </div>
        </div>
      )}

      {/* FEEDBACK MENSAGENS TOAST */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-100 text-neutral-950 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-neutral-300 animate-slide-up font-bold text-sm">
          <Check className="w-4 h-4 text-emerald-600" /> {feedbackMsg}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* TÍTULO DO PAINEL */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
            Painel de Controle Estratégico de Captação
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
            Gestão inteligente de contrapartidas de ICMS, funil institucional e auditoria de valores agregados ao clube.
          </p>
        </div>

        {/* 1. DASHBOARD INDICADORES FINANCEIROS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Total de Leads</span>
              <div className="p-2 bg-white/5 rounded-xl text-neutral-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black italic text-white tracking-tight">
              {totalEmpresas}
            </div>
            <span className="text-[10px] text-neutral-500 font-bold uppercase mt-1 block">Empresas Cadastradas</span>
          </div>

          {/* Card 2 */}
          <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Potencial Estimado</span>
              <div className="p-2 bg-white/5 rounded-xl text-neutral-300">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black italic text-neutral-200 tracking-tight truncate">
              {totalPotencial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-neutral-500 font-bold uppercase mt-1 block">Captação Anual 3% ICMS</span>
          </div>

          {/* Card 3 */}
          <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Cartas de Interesse</span>
              <div className="p-2 bg-white/5 rounded-xl text-neutral-300">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black italic text-white tracking-tight">
              {totalCartas}
            </div>
            <span className="text-[10px] text-neutral-500 font-bold uppercase mt-1 block">Empresas Engajadas</span>
          </div>

          {/* Card 4 Dominante (Platinum/Metálico) */}
          <div className="bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 text-neutral-950 p-5 rounded-2xl border border-white relative overflow-hidden shadow-xl">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-600">Total Captado Real</span>
              <div className="p-2 bg-neutral-950 text-white rounded-xl shadow-xs">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black italic tracking-tight text-neutral-950 relative z-10 truncate">
              {totalCaptado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-neutral-700 font-black uppercase mt-1 block relative z-10">Valores com Aporte Concluído</span>
          </div>

        </div>

        {/* 2. BARRA DE FILTROS & BUSCA TEXTUAL */}
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-4">
          
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            
            {/* Buscador */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Buscar por Razão Social, CNPJ ou Contato..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-neutral-500 font-bold self-end md:self-center">
              Mostrando <strong className="text-white">{filteredLeads.length}</strong> de {leads.length} leads
            </div>
          </div>

          {/* Abas do Funil */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-800">
            {[
              { key: 'todas', label: 'Todas as Empresas' },
              { key: 'pendente_analise', label: 'Em Análise' },
              { key: 'aprovada', label: 'Aprovadas' },
              { key: 'precisa_seimg', label: 'Cadastro SEI!MG' },
              { key: 'falta_carta', label: 'Falta Carta' },
              { key: 'captada', label: 'Captadas Sucesso' },
              { key: 'nao_aprovada', label: 'Não Aprovadas' }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${activeTab === t.key ? 'bg-white text-black shadow-sm' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>

        {/* 3. LISTAGEM PRINCIPAL (TABELA CORPORATIVA) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/50 text-[10px] uppercase font-black tracking-widest text-neutral-500">
                  <th className="p-4 pl-6">Empresa & CNPJ</th>
                  <th className="p-4">Contato Principal</th>
                  <th className="p-4">Potencial Est.</th>
                  <th className="p-4">Status do Lead</th>
                  <th className="p-4">Valor Captado Real</th>
                  <th className="p-4 pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-500 font-medium">
                      Nenhuma empresa encontrada com os filtros atuais.
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
                        className="hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                      >
                        {/* Coluna 1 */}
                        <td className="p-4 pl-6 max-w-xs">
                          <div className="font-bold text-white truncate group-hover:text-neutral-200">
                            {item.razao_social}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
                            {item.cnpj} 
                            {obsObj?.cidade && <span className="text-neutral-600 font-sans">• {obsObj.cidade}-{obsObj.estado || 'MG'}</span>}
                          </div>
                        </td>

                        {/* Coluna 2 */}
                        <td className="p-4">
                          <div className="font-bold text-neutral-200 truncate">{item.nome_responsavel}</div>
                          <div className="text-[11px] text-neutral-500 truncate">{item.telefone}</div>
                        </td>

                        {/* Coluna 3 */}
                        <td className="p-4 font-mono font-medium text-neutral-300">
                          {item.potencial_anual_estimado ? item.potencial_anual_estimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : 'R$ 0'}
                        </td>

                        {/* Coluna 4 Status */}
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Coluna 5 Valor Real Captado */}
                        <td className="p-4 font-mono font-bold">
                          {item.valor_captado_real > 0 ? (
                            <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                              {item.valor_captado_real.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                            </span>
                          ) : (
                            <span className="text-neutral-600 italic font-sans font-normal">— Lançar valor</span>
                          )}
                        </td>

                        {/* Coluna 6 Botão Acessar */}
                        <td className="p-4 pr-6 text-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenLead(item); }}
                            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <ChevronRight className="w-4 h-4" />
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

      </main>

      {/* 4. DRAWER / MODAL DE DETALHES E EDIÇÃO DO LEAD */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Overlay escuro */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity" 
            onClick={() => setSelectedLead(null)}
          />

          {/* Container do Drawer */}
          <div className="relative w-full max-w-2xl bg-neutral-900 border-l border-neutral-800 h-full overflow-y-auto z-10 flex flex-col text-neutral-100 shadow-2xl">
            
            {/* Header do Drawer */}
            <div className="p-6 bg-neutral-950 border-b border-neutral-800 flex justify-between items-start sticky top-0 z-20">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
                  Gestão Estratégica B2B
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

            {/* Corpo do Drawer com os detalhes integrais preservados */}
            <div className="p-6 space-y-6 flex-grow">
              
              {/* BLOCO DE AÇÕES DE NEGÓCIO (STATUS & VALORES REAIS) */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4 shadow-inner">
                <div className="text-xs font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
                  ⚡ Atualizar Funil Corporativo
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Select do Status */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">Status da Captação</label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input do Valor Real Captado */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Valor Captado Real (R$)
                    </label>
                    <input 
                      type="number"
                      placeholder="Ex: 50000"
                      value={editingValor}
                      onChange={(e) => setEditingValor(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Input do link da Carta de Interesse */}
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Link do Documento / Carta de Interesse Assinada
                  </label>
                  <input 
                    type="url"
                    placeholder="https://link-do-drive.com/carta-assinada.pdf"
                    value={editingCartaUrl}
                    onChange={(e) => setEditingCartaUrl(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                  {editingCartaUrl && (
                    <a 
                      href={editingCartaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:underline block mt-1 font-medium"
                    >
                      Abrir anexo em nova aba ↗
                    </a>
                  )}
                </div>

                {/* Botão de Gravação */}
                <button
                  onClick={handleSaveChanges}
                  disabled={savingAction}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-black uppercase italic tracking-widest text-xs py-3 rounded-xl transition-all shadow-md mt-2 cursor-pointer flex items-center justify-center gap-2"
                >
                  {savingAction ? 'Salvando...' : 'Salvar Status e Lançamento Real'}
                </button>
              </div>

              {/* DADOS DIRETOS DO BANCO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Contato Responsável</span>
                  <div className="text-xs font-bold text-white">{selectedLead.nome_responsavel}</div>
                  <div className="text-[11px] text-neutral-400">{selectedLead.cargo || 'Responsável B2B'}</div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-2">WhatsApp: <strong className="text-white">{selectedLead.telefone}</strong></div>
                  <div className="text-[11px] text-neutral-400 truncate">E-mail: <strong className="text-white">{selectedLead.email}</strong></div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Estimativa Simulador</span>
                  <div className="text-xs text-neutral-400">
                    Base de ICMS: <strong className="text-white font-mono">{selectedLead.icms_mensal_estimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Regime Declarado: <strong className="text-white uppercase">{selectedLead.regime_tributario}</strong>
                  </div>
                  <div className="text-xs text-neutral-400 mt-2 border-t border-neutral-800 pt-1.5">
                    Potencial de Captação: <strong className="text-emerald-400 font-mono">{selectedLead.potencial_anual_estimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</strong>/ano
                  </div>
                </div>

              </div>

              {/* DECODIFICAÇÃO DO JSON DE OBSERVAÇÕES INTERNAS */}
              {(() => {
                const obsObj = getObservacoesObj(selectedLead.observacoes_internas);
                if (!obsObj) return null;

                return (
                  <div className="space-y-4 pt-2 border-t border-neutral-800">
                    <span className="text-xs font-black uppercase tracking-widest text-neutral-400 block">
                      📋 Diagnóstico Avançado do Questionário
                    </span>

                    {/* Endereço e Dados Cadastrais */}
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                      <div className="font-bold text-neutral-300 pb-1 border-b border-neutral-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-neutral-500" /> Cadastral & Logística
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div><span className="text-neutral-500">Nome Fantasia:</span> <strong className="text-neutral-200">{obsObj.nome_fantasia || '—'}</strong></div>
                        <div><span className="text-neutral-500">Inscrição Est.:</span> <strong className="text-neutral-200">{obsObj.ie || '—'}</strong></div>
                        <div><span className="text-neutral-500">Segmento:</span> <strong className="text-neutral-200">{obsObj.segmento || '—'}</strong></div>
                        <div><span className="text-neutral-500">Qtd Funcionários:</span> <strong className="text-neutral-200">{obsObj.qtd_func || '—'}</strong></div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-neutral-900 text-[11px]">
                        <span className="text-neutral-500 block mb-0.5">Endereço Declarado:</span>
                        <div className="text-neutral-200 font-medium">
                          {obsObj.endereco}, {obsObj.numero} — {obsObj.cidade}-{obsObj.estado} (CEP: {obsObj.cep})
                        </div>
                      </div>
                    </div>

                    {/* Dados do Contador */}
                    {(obsObj.contador_nome || obsObj.contador_escritorio) && (
                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                        <div className="font-bold text-neutral-300 pb-1 border-b border-neutral-900 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-neutral-500" /> Decisor Técnico (Contador Indicado)
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div><span className="text-neutral-500">Contador:</span> <strong className="text-neutral-200">{obsObj.contador_nome || '—'}</strong></div>
                          <div><span className="text-neutral-500">Escritório:</span> <strong className="text-neutral-200">{obsObj.contador_escritorio || '—'}</strong></div>
                          <div><span className="text-neutral-500">WhatsApp Cont.:</span> <strong className="text-neutral-200 font-mono">{obsObj.contador_telefone || '—'}</strong></div>
                          <div className="truncate"><span className="text-neutral-500">E-mail:</span> <strong className="text-neutral-200">{obsObj.contador_email || '—'}</strong></div>
                        </div>
                      </div>
                    )}

                    {/* Pesquisa de Perfil Institucional */}
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1.5 text-xs text-neutral-300">
                      <div className="font-bold text-xs pb-1 text-white">Pesquisa de Engajamento:</div>
                      <div><span className="text-neutral-500">Recolhe ICMS em MG?</span> <strong className="text-white">{obsObj.recolhe_icms_mg || '—'}</strong></div>
                      <div><span className="text-neutral-500">Faixa Declarada:</span> <strong className="text-white">{obsObj.faixa_icms || '—'}</strong></div>
                      <div><span className="text-neutral-500">Interesse Primário:</span> <strong className="text-white">{obsObj.interesse_principal || '—'}</strong></div>
                    </div>

                  </div>
                );
              })()}

              <div className="text-[10px] text-neutral-600 text-center pt-4">
                Submissão recebida em: {new Date(selectedLead.created_at).toLocaleString('pt-BR')}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
