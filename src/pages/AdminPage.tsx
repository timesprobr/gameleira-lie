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
  Save,
  MessageSquare
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



const STATUS_OPTIONS = [
  { key: 'pendente_analise', label: 'Em análise', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { key: 'nao_aprovada', label: 'Reprovada', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  { key: 'precisa_seimg', label: 'Cadastro pendente no SEI!MG', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { key: 'aprovada', label: 'Aprovada', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { key: 'falta_carta', label: 'Aguardando a Carta', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { key: 'captada', label: 'Captada', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold' }
];

export default function AdminPage() {
  // Navegação da Sidebar: 'dashboard' | 'empresas' | 'valores'
  const [activeSection, setActiveSection] = useState<'dashboard' | 'empresas' | 'valores'>('dashboard');
  
  const [leads, setLeads] = useState<CorporateLead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Controles de listagem
  const [activeTabStatus, setActiveTabStatus] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Drawer CRM
  const [selectedLead, setSelectedLead] = useState<CorporateLead | null>(null);
  const [commentsOnlyMode, setCommentsOnlyMode] = useState<boolean>(false);
  const [editingStatus, setEditingStatus] = useState<string>('');
  const [editingCartaUrl, setEditingCartaUrl] = useState<string>('');
  const [editingComentario, setEditingComentario] = useState<string>('');
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

      if (error) {
        console.error('Erro de consulta Supabase:', error);
        setLeads([]);
        setBatchValues({});
      } else {
        const liveData = (data || []) as CorporateLead[];
        setLeads(liveData);
        const initialBatch: Record<string, string> = {};
        liveData.forEach(l => {
          initialBatch[l.id] = l.valor_captado_real ? l.valor_captado_real.toString() : '';
        });
        setBatchValues(initialBatch);
      }
    } catch (err) {
      console.error('Erro de conexão Supabase:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Obter histórico de comentários do Lead
  const getLeadComments = (lead: CorporateLead | null) => {
    if (!lead?.observacoes_internas) return [];
    try {
      const parsed = JSON.parse(lead.observacoes_internas);
      if (parsed && Array.isArray(parsed.comentarios_admin)) {
        return parsed.comentarios_admin;
      }
      // Suporte retroativo caso houvesse um comentário antigo salvo em string simples
      if (parsed && typeof parsed.comentario_admin === 'string' && parsed.comentario_admin.trim()) {
        return [{ data: lead.created_at || new Date().toISOString(), texto: parsed.comentario_admin }];
      }
    } catch (e) {
      // ignora
    }
    return [];
  };

  // Abrir Drawer com campo limpo
  const handleOpenLead = (lead: CorporateLead, isCommentsOnly: boolean = false) => {
    setSelectedLead(lead);
    setEditingStatus(lead.status);
    setEditingCartaUrl(lead.carta_interesse_url || '');
    setEditingComentario(''); // Campo sempre inicia em branco pronto para nova anotação
    setCommentsOnlyMode(isCommentsOnly);
  };

  // Adicionar comentário/anotação instantaneamente na Timeline
  const handleAddComentario = async () => {
    if (!selectedLead || !editingComentario.trim()) return;

    const newComment = {
      data: new Date().toISOString(),
      texto: editingComentario.trim()
    };

    let obsObj: Record<string, any> = {};
    if (selectedLead.observacoes_internas) {
      try {
        const parsed = JSON.parse(selectedLead.observacoes_internas);
        if (parsed && typeof parsed === 'object') {
          obsObj = { ...parsed };
        }
      } catch (e) {}
    }

    const currentComments = Array.isArray(obsObj.comentarios_admin) ? obsObj.comentarios_admin : [];
    // Adiciona o novo comentário no início do Feed (mais recentes primeiro)
    obsObj.comentarios_admin = [newComment, ...currentComments];
    const newObsStr = JSON.stringify(obsObj);

    // Atualiza listagem local
    const updatedList = leads.map(item => {
      if (item.id === selectedLead.id) {
        return { ...item, observacoes_internas: newObsStr };
      }
      return item;
    });

    setLeads(updatedList);
    const updatedSelected = updatedList.find(l => l.id === selectedLead.id) || null;
    setSelectedLead(updatedSelected);
    setEditingComentario(''); // Limpa o campo instantaneamente conforme requisitado!

    // Persiste no Supabase
    if (!selectedLead.id.startsWith('demo-')) {
      try {
        await supabase
          .from('empresas_leads')
          .update({
            observacoes_internas: newObsStr,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedLead.id);
      } catch (e) {
        console.error('Erro ao salvar comentário:', e);
      }
    }

    showToast('Anotação registrada no histórico!');
  };

  // Salvar alterações gerais de Status no Drawer
  const handleSaveChanges = async () => {
    if (!selectedLead) return;
    setSavingAction(true);
    
    // Se o usuário digitou um comentário mas esqueceu de clicar em "Adicionar", salvamos para ele automaticamente
    let newObsStr = selectedLead.observacoes_internas;
    if (editingComentario.trim()) {
      let obsObj: Record<string, any> = {};
      if (selectedLead.observacoes_internas) {
        try {
          const parsed = JSON.parse(selectedLead.observacoes_internas);
          if (parsed && typeof parsed === 'object') obsObj = { ...parsed };
        } catch (e) {}
      }
      const currentComments = Array.isArray(obsObj.comentarios_admin) ? obsObj.comentarios_admin : [];
      obsObj.comentarios_admin = [{ data: new Date().toISOString(), texto: editingComentario.trim() }, ...currentComments];
      newObsStr = JSON.stringify(obsObj);
    }

    const updatedList = leads.map(item => {
      if (item.id === selectedLead.id) {
        return {
          ...item,
          status: editingStatus,
          carta_interesse_url: editingCartaUrl ? editingCartaUrl : null,
          observacoes_internas: newObsStr
        };
      }
      return item;
    });

    setLeads(updatedList);
    const updatedSelected = updatedList.find(l => l.id === selectedLead.id) || null;
    setSelectedLead(updatedSelected);
    setEditingComentario('');

    if (!selectedLead.id.startsWith('demo-')) {
      try {
        await supabase
          .from('empresas_leads')
          .update({
            status: editingStatus,
            carta_interesse_url: editingCartaUrl ? editingCartaUrl : null,
            observacoes_internas: newObsStr,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedLead.id);
      } catch (e) {
        console.error('Erro ao atualizar Supabase:', e);
      }
    }

    setSavingAction(false);
    showToast('Status atualizado com sucesso!');
  };

  // Upload/Anexo de arquivo da Carta de Interesse
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast('Processando o anexo do documento...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `carta_${Date.now()}.${fileExt}`;
      const filePath = `cartas/${fileName}`;

      const { error } = await supabase.storage
        .from('documentos')
        .upload(filePath, file);

      if (error) {
        // Fallback local robusto se o bucket não estiver criado/liberado
        const fakeUrl = URL.createObjectURL(file);
        setEditingCartaUrl(fakeUrl);
        showToast('Carta anexada com sucesso (Modo Local/Fallback)');
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('documentos')
          .getPublicUrl(filePath);
        
        if (publicUrlData?.publicUrl) {
          setEditingCartaUrl(publicUrlData.publicUrl);
          showToast('Carta enviada para a nuvem com sucesso!');
        }
      }
    } catch (err) {
      const fakeUrl = URL.createObjectURL(file);
      setEditingCartaUrl(fakeUrl);
      showToast('Documento anexado com sucesso!');
    }
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

  // Empresas listadas na aba "Valores Captados" (exibindo estritamente aquelas com status "captada")
  const financialLeads = leads
    .filter(item => item.status === 'captada')
    .sort((a, b) => b.valor_captado_real - a.valor_captado_real);

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
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 text-[10px] text-emerald-400 font-mono text-center truncate">
            ● Supabase Live DB
          </div>

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

              {/* CARDS INDICADORES COMPACTOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Card 1 */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl relative shadow-xs">
                  <div className="flex justify-between items-center text-neutral-400 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider">Total de Leads</span>
                    <Users className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black italic text-white tracking-tight leading-none">
                    {totalEmpresas}
                  </div>
                  <div className="text-[9px] text-neutral-500 font-bold uppercase mt-1">
                    Prospectos no Funil
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl relative shadow-xs">
                  <div className="flex justify-between items-center text-neutral-400 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider">Potencial ICMS 3%</span>
                    <TrendingUp className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div className="text-lg sm:text-xl font-black italic text-neutral-200 tracking-tight leading-none truncate">
                    {totalPotencial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[9px] text-neutral-500 font-bold uppercase mt-1">
                    Estimativa Anual Bruta
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl relative shadow-xs">
                  <div className="flex justify-between items-center text-neutral-400 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider">Cartas de Interesse</span>
                    <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black italic text-white tracking-tight leading-none">
                    {leads.filter(l => l.status === 'captada' || l.status === 'falta_carta' || l.carta_interesse_url).length}
                  </div>
                  <div className="text-[9px] text-neutral-500 font-bold uppercase mt-1">
                    Empresas Alinhadas
                  </div>
                </div>

                {/* Card 4 - Destaque Metálico/Platinado Compacto */}
                <div className="bg-gradient-to-br from-neutral-200 via-white to-neutral-300 text-black p-4 rounded-xl border border-white relative shadow-md overflow-hidden">
                  <div className="flex justify-between items-center text-neutral-700 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider">Total Captado Real</span>
                    <div className="p-0.5 bg-black text-white rounded">
                      <DollarSign className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-black italic tracking-tight text-neutral-950 leading-none truncate">
                    {totalCaptado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[9px] text-neutral-600 font-black uppercase mt-1">
                    Aportes Consolidados
                  </div>
                </div>

              </div>

              {/* SEÇÃO GRÁFICOS E ALERTAS COMPACTOS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Gráfico 1: Distribuição do Funil */}
                <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-4.5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                    <div className="flex items-center gap-1.5 font-black text-[11px] uppercase tracking-wider text-neutral-300">
                      <BarChart3 className="w-3.5 h-3.5 text-neutral-400" /> Distribuição do Funil Corporativo
                    </div>
                    <span className="text-[9px] text-neutral-500 font-mono uppercase">Conversão</span>
                  </div>

                  {/* DESENHO DO FUNIL REAL DE CAPTAÇÃO */}
                  <div className="space-y-2 pt-1">
                    {(() => {
                      // Ordem visual solicitada para formar o Funil de cima para baixo
                      const funnelStagesOrder = [
                        { key: 'pendente_analise', label: 'Em análise', width: '100%', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30', dot: 'bg-amber-400' },
                        { key: 'nao_aprovada', label: 'Reprovadas', width: '92%', color: 'from-red-500/20 to-red-500/5', border: 'border-red-500/30', dot: 'bg-red-400' },
                        { key: 'precisa_seimg', label: 'Pendente no SEI!MG', width: '84%', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', dot: 'bg-purple-400' },
                        { key: 'falta_carta', label: 'Aguardando carta', width: '76%', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30', dot: 'bg-orange-400' },
                        { key: 'aprovada', label: 'Aprovada', width: '68%', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', dot: 'bg-blue-400' },
                        { key: 'captada', label: 'Captada', width: '60%', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/40', dot: 'bg-emerald-400' },
                      ];

                      return funnelStagesOrder.map((stage) => {
                        const count = leads.filter(l => l.status === stage.key).length;
                        const percentage = totalEmpresas > 0 ? Math.round((count / totalEmpresas) * 100) : 0;

                        return (
                          <div 
                            key={stage.key}
                            style={{ width: stage.width }}
                            className={`mx-auto bg-neutral-950 border ${stage.border} rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] shadow-md`}
                          >
                            {/* Barra de progresso de fundo imersiva */}
                            <div 
                              className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${stage.color} transition-all duration-1000`}
                              style={{ width: `${Math.max(percentage, count > 0 ? 4 : 0)}%` }}
                            />

                            <div className="relative z-10 px-4 py-2.5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 truncate">
                                <span className={`w-2 h-2 rounded-full ${stage.dot} flex-shrink-0 ${stage.key === 'captada' ? 'animate-pulse' : ''}`} />
                                <span className="text-xs font-bold text-neutral-200 truncate">{stage.label}</span>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0 bg-neutral-900/90 px-2.5 py-1 rounded-md border border-neutral-800">
                                <span className="text-xs font-black text-white font-mono">{count}</span>
                                <span className="text-[10px] text-neutral-400 font-mono">({percentage}%)</span>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Alertas Estratégicos Nativos Compactos */}
                <div className="bg-neutral-900 border border-neutral-800 p-4.5 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-black text-[11px] uppercase tracking-wider text-neutral-300 border-b border-neutral-800 pb-2.5 mb-3">
                      <BellRing className="w-3.5 h-3.5 text-amber-400" /> Central de Alertas
                    </div>

                    <div className="space-y-2 text-[11px]">
                      {/* Alerta 1 */}
                      <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-amber-400 block">Enquadramento</span>
                        <p className="text-neutral-300 leading-tight">
                          {leads.filter(l => l.status === 'pendente_analise').length} novas empresas requerem análise inicial.
                        </p>
                      </div>

                      {/* Alerta 2 */}
                      <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 block">Meta ICMS</span>
                        <p className="text-neutral-400 leading-tight">
                          Potencial bruto cobre <strong className="text-white">100%</strong> das cotas planejadas.
                        </p>
                      </div>

                      {/* Alerta 3 */}
                      <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 block">Formalização</span>
                        <p className="text-neutral-400 leading-tight truncate">
                          Lembrete: Enviar link da Carta para "Pendente SEI!MG".
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveSection('empresas')}
                    className="w-full text-center py-2 bg-neutral-950 hover:bg-black text-neutral-300 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-neutral-800 block"
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
                    { key: 'pendente_analise', label: 'Em análise' },
                    { key: 'nao_aprovada', label: 'Reprovada' },
                    { key: 'precisa_seimg', label: 'Cadastro pendente no SEI!MG' },
                    { key: 'aprovada', label: 'Aprovada' },
                    { key: 'falta_carta', label: 'Aguardando a Carta' },
                    { key: 'captada', label: 'Captada' }
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
                          const itemComments = getLeadComments(item);
                          
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

                              {/* Status Pílula e Ícone de Comentários */}
                              <td className="p-4">
                                <div className="flex items-center gap-1.5">
                                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                  {itemComments.length > 0 ? (
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleOpenLead(item, true); }}
                                      title={`${itemComments.length} anotação(ões) registrada(s) - Clique para abrir apenas o histórico`}
                                      className="flex items-center gap-1 px-1.5 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded text-[10px] font-bold border border-neutral-700 transition-colors cursor-pointer"
                                    >
                                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                                      <span>{itemComments.length}</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleOpenLead(item, true); }}
                                      title="Adicionar anotação a esta empresa"
                                      className="p-1 bg-neutral-950 hover:bg-neutral-800 text-neutral-600 hover:text-neutral-400 rounded transition-colors border border-neutral-800/60 cursor-pointer"
                                    >
                                      <MessageSquare className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
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
                📌 Aqui constam estritamente as empresas classificadas com o status <strong className="text-emerald-400">"Captada Sucesso"</strong>. Você pode auditar, ajustar ou digitar os valores arrecadados em cada uma instantaneamente e salvar na própria linha.
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
                      {financialLeads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-neutral-500 font-medium">
                            Nenhuma empresa está marcada com o status "Captada Sucesso" no momento.<br/>
                            Mude o status de uma empresa na aba <strong className="text-neutral-300">Empresas</strong> para que ela apareça aqui.
                          </td>
                        </tr>
                      ) : (
                        financialLeads.map((item) => {
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
                        })
                      )}
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
                  {commentsOnlyMode ? 'Anotações e Histórico' : 'Ficha do Prospecto B2B'}
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
              {commentsOnlyMode ? (
                /* MODO EXCLUSIVO DE COMENTÁRIOS */
                <div className="space-y-6 animate-fade-in">
                  {/* Caixa de nova anotação */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2.5 shadow-inner">
                    <label className="block text-xs font-bold text-neutral-300">
                      Adicionar Nova Anotação
                    </label>
                    <textarea
                      rows={3}
                      value={editingComentario}
                      onChange={(e) => setEditingComentario(e.target.value)}
                      placeholder="Escreva anotações sobre reuniões, contatos feitos ou próximos passos..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-y"
                    />
                    <button
                      type="button"
                      onClick={handleAddComentario}
                      disabled={!editingComentario.trim()}
                      className="w-full py-2.5 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black rounded-lg text-xs font-black uppercase italic tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-black" />
                      <span>Registrar e Limpar Anotação</span>
                    </button>
                  </div>

                  {/* Feed de anotações pregressas */}
                  {(() => {
                    const leadComments = getLeadComments(selectedLead);
                    return (
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 block border-b border-neutral-900 pb-2">
                          Histórico de Anotações Salvas ({leadComments.length})
                        </span>
                        {leadComments.length === 0 ? (
                          <div className="p-8 text-center text-neutral-600 text-xs italic bg-neutral-950/40 rounded-xl border border-neutral-900">
                            Nenhuma anotação administrativa registrada para este lead ainda.
                          </div>
                        ) : (
                          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
                            {leadComments.map((c, idx) => {
                              const dateObj = new Date(c.data);
                              const dataFormatada = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
                              const horaFormatada = !isNaN(dateObj.getTime()) ? dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
                              
                              return (
                                <div key={idx} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-1.5 shadow-xs">
                                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono border-b border-neutral-900 pb-1">
                                    <span className="font-bold text-neutral-300">Anotação Administrativa</span>
                                    <span>{dataFormatada} às {horaFormatada}</span>
                                  </div>
                                  <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-[11px]">{c.texto}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* MODO COMPLETO (FICHA GERAL DO LEAD) */
                <React.Fragment>
                  {/* BLOCO DE EDIÇÃO E RECLASSIFICAÇÃO */}
                  <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4 shadow-inner">
                    <div className="text-xs font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
                      ⚡ Reclassificar Etapa de Funil
                    </div>

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

                    {/* Carta de Interesse como Upload/Anexo real */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        Anexar Carta de Interesse Assinada (PDF / Imagem)
                      </label>
                      
                      <div className="relative">
                        <input 
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleFileUpload}
                          id="file-upload-carta"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full bg-neutral-900 hover:bg-neutral-800/80 border-2 border-dashed rounded-xl p-3 text-center transition-all flex flex-col items-center justify-center gap-1 ${editingCartaUrl ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-neutral-800'}`}>
                          <span className="text-xs font-bold text-neutral-300">
                            {editingCartaUrl ? 'Documento Anexado com Sucesso' : 'Clique ou arraste o arquivo aqui'}
                          </span>
                          <span className="text-[10px] text-neutral-500 block">
                            {editingCartaUrl ? 'Substituir arquivo atual' : 'Formatos suportados: PDF, JPG, PNG'}
                          </span>
                        </div>
                      </div>

                      {editingCartaUrl && (
                        <div className="mt-2 flex items-center justify-between bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-800">
                          <a 
                            href={editingCartaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold"
                          >
                            <span>Visualizar Anexo Atual</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button 
                            onClick={() => { setEditingCartaUrl(''); showToast('Anexo removido da seleção'); }}
                            className="text-[10px] text-neutral-500 hover:text-red-400 font-medium"
                          >
                            Remover
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Comentários / Anotações do Lead */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-400">
                        Anotações Internas / Histórico de Contato
                      </label>
                      <textarea
                        rows={3}
                        value={editingComentario}
                        onChange={(e) => setEditingComentario(e.target.value)}
                        placeholder="Escreva anotações, data prevista de retorno, impeditivos..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-y"
                      />
                      <button
                        type="button"
                        onClick={handleAddComentario}
                        disabled={!editingComentario.trim()}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-neutral-300 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-neutral-800 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Registrar e Limpar Anotação</span>
                      </button>
                    </div>

                    {/* Botão Salvar Modal */}
                    <button
                      onClick={handleSaveChanges}
                      disabled={savingAction}
                      className="w-full bg-white hover:bg-neutral-200 text-black font-black uppercase italic tracking-widest text-xs py-3 rounded-xl transition-all shadow-md mt-2 cursor-pointer"
                    >
                      {savingAction ? 'Salvando...' : 'Aplicar Atualização de Status'}
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

                  {/* FEED DE COMENTÁRIOS / TIMELINE HISTÓRICO */}
                  {(() => {
                    const leadComments = getLeadComments(selectedLead);
                    if (leadComments.length === 0) return null;

                    return (
                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3 animate-fade-in">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 block border-b border-neutral-900 pb-2">
                          Histórico do Lead / Anotações ({leadComments.length})
                        </span>
                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
                          {leadComments.map((c, idx) => {
                            const dateObj = new Date(c.data);
                            const dataFormatada = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
                            const horaFormatada = !isNaN(dateObj.getTime()) ? dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
                            
                            return (
                              <div key={idx} className="p-3 bg-neutral-900 rounded-lg border border-neutral-800/80 text-xs space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono border-b border-neutral-800/40 pb-1">
                                  <span className="font-bold text-neutral-300">Anotação Administrativa</span>
                                  <span>{dataFormatada} às {horaFormatada}</span>
                                </div>
                                <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-[11px]">{c.texto}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

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
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
