import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight,
  ChevronDown,
  Target, 
  Users, 
  ShieldCheck, 
  Heart, 
  HelpCircle, 
  Mail, 
  MessageSquare,
  ArrowRight,
  Plus,
  Minus,
  Menu,
  X,
  Shirt,
  Dumbbell,
  Bus,
  Utensils,
  Flag,
  Lightbulb,
  Building,
  GraduationCap,
  Laptop,
  Trophy,
  BookOpen,
  Receipt,
  ArrowRightLeft,
  CheckCircle,
  TrendingUp,
  Search,
  Landmark,
  Check,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  Instagram,
  MapPin
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from './lib/utils';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'O Projeto', href: '#projeto' },
    { name: 'GAMELEIRA', href: '#instituicao' },
    { name: 'Lei de Incentivo', href: '#lei' },
    { name: 'Quem apoia', href: '#apoio' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6",
      scrolled ? "bg-black/95 backdrop-blur-md py-4 border-b border-white/10" : "bg-gradient-to-b from-black/90 via-black/40 to-transparent py-6 pb-16"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
          <img src="/escudo.png" alt="GAMELEIRA" className="h-10 w-auto group-hover:scale-105 transition-transform" />
          <span className="text-2xl font-black tracking-tighter hidden sm:block">GAMELEIRA</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white hover:opacity-100 transition-all relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="/apoiar"
            className="hidden sm:block bg-white text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-full"
          >
            Quero Apoiar
          </a>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-6 p-8 text-white">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black uppercase italic tracking-tighter hover:pl-2 transition-all"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="/apoiar"
                onClick={() => setIsOpen(false)}
                className="bg-white text-black px-6 py-4 text-center text-xs font-black uppercase tracking-widest mt-4"
              >
                Quero Apoiar
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section 
      className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 pt-20 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("/haed.png")' }}
    >
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center z-10"
      >
        <span className="inline-block border border-white/20 px-4 py-2 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold mb-6 rounded-full bg-black/40 backdrop-blur-md">
          Projeto Talento Mineiro — Realização GAMELEIRA
        </span>
        <p className="text-white text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed font-medium drop-shadow-xl bg-black/40 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
          Invista no futuro do esporte em Minas Gerais e associe sua marca ao GAMELEIRA.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold mb-1">Rolar para baixo</span>
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};

const SectionHeader = ({ title, subtitle, light = false }: { title: string, subtitle: string, light?: boolean }) => (
  <div className={cn("mb-8 md:mb-10", light ? "text-white" : "text-black")}>
    <span className={cn("text-[10px] uppercase tracking-[0.3em] font-black block mb-2", light ? "opacity-50" : "opacity-30")}>
      {subtitle}
    </span>
    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">
      {title}
    </h2>
  </div>
);

const VideoPitchSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] md:text-xs uppercase tracking-[0.2em] font-black mb-8 rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Custo Zero para a sua Empresa
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-8 md:mb-10 tracking-tight leading-tight drop-shadow-xl break-words max-w-full">
          Transforme imposto em futuro.<br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 block sm:inline mt-1 sm:mt-0">Apoie o Gameleira e mude vidas através do esporte.</span>
        </h2>

        <div className="w-full max-w-4xl aspect-video bg-neutral-900 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative group cursor-pointer flex items-center justify-center mb-10">
          {/* Placeholder for Video */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1e1e11417dc5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity transition-transform duration-700 group-hover:scale-105" />
          
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center pl-2 z-20 group-hover:scale-110 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
          {/* Social Proof Avatars */}
          <div className="flex items-center gap-4 bg-white/5 pr-6 rounded-full p-2 border border-white/10">
            <div className="flex -space-x-4">
              <img className="w-12 h-12 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" alt="Empresa 1" />
              <img className="w-12 h-12 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop" alt="Empresa 2" />
              <img className="w-12 h-12 rounded-full border-2 border-black object-cover" src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop" alt="Empresa 3" />
              <div className="w-12 h-12 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center text-xs font-bold text-white z-10">
                +12
              </div>
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-sm font-bold text-white">Empresas apoiadoras</div>
              <div className="text-xs text-neutral-400">Junte-se a elas</div>
            </div>
          </div>

          <a 
            href="/apoiar" 
            className="inline-flex items-center gap-2 bg-white text-black px-10 py-5 text-sm md:text-base font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Quero Apoiar <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="space-y-6 text-neutral-400 text-lg md:text-2xl leading-relaxed font-light max-w-4xl mx-auto mb-20">
          <p>
            Sua empresa pode apoiar o Projeto Social do Gameleira <strong>sem custo adicional.</strong><br/>
            O valor destinado ao projeto é abatido diretamente do ICMS que já seria pago ao Estado.
          </p>
          <p>
            Enquanto sua marca ganha visibilidade e fortalece sua imagem, dezenas de crianças recebem acesso ao esporte, disciplina, educação e oportunidade.
          </p>
          <p>
            O Gameleira acredita que futebol não é só competição.<br/>
            <span className="text-white font-medium">É formação de caráter, afastamento das ruas e construção de futuro.</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <ShieldCheck className="w-8 h-8 mb-4 text-white" />
            <h4 className="font-bold uppercase tracking-tighter text-lg mb-2">100% Abatimento</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">O valor do patrocínio é descontado diretamente do imposto de ICMS a pagar ao Governo.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <Heart className="w-8 h-8 mb-4 text-white" />
            <h4 className="font-bold uppercase tracking-tighter text-lg mb-2">Impacto Real</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">Seu imposto fica na nossa região, investido no esporte e na proteção das nossas crianças.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <Target className="w-8 h-8 mb-4 text-white" />
            <h4 className="font-bold uppercase tracking-tighter text-lg mb-2">Visibilidade</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">Sua empresa estará nos uniformes, placas do CT e mídias do GAMELEIRA o ano todo.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectSection = () => {
  return (
    <section id="projeto" className="py-16 md:py-20 px-6 bg-neutral-50 border-t border-neutral-200 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16 md:space-y-20">
        <div className="text-center mb-8">
          <SectionHeader title="Entenda o Projeto" subtitle="Talento Mineiro" />
        </div>
        
        {/* BLOCO 1 — FOTO FORTE + PROPÓSITO */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
          <div className="w-full md:w-5/12 aspect-[4/3] bg-neutral-200 rounded-2xl overflow-hidden relative shadow-xl">
            <div className="absolute inset-0 bg-[url('/img-002.png')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="w-full md:w-7/12 text-left">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase italic mb-4 tracking-tighter leading-tight text-neutral-900">
              Formando mais que atletas.<br />Formando futuros.
            </h3>
            <div className="space-y-4 text-neutral-600 text-sm md:text-base leading-relaxed font-medium">
              <p>
                O Talento Mineiro é o projeto social do GAMELEIRA criado para oferecer esporte, disciplina e oportunidade para crianças e adolescentes de Ubaporanga e região.
              </p>
              <p>
                Através do futebol, buscamos desenvolver caráter, educação, convivência social e perspectiva de futuro.
              </p>
              <p className="font-bold text-black border-l-4 border-black pl-4 py-2 bg-black/5 rounded-r-lg mt-2">
                O projeto é aprovado pela Lei de Incentivo ao Esporte de Minas Gerais.
              </p>
            </div>
          </div>
        </div>

        {/* BLOCO 2 — QUEM ATENDEMOS */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Quem o projeto impacta</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <Users className="w-6 h-6 mb-3 text-black" />
              <h4 className="font-bold uppercase tracking-tighter text-base md:text-lg mb-1">Crianças e adolescentes</h4>
              <p className="text-neutral-500 text-xs md:text-sm">De 6 a 17 anos em situação de vulnerabilidade social.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <Target className="w-6 h-6 mb-3 text-black" />
              <h4 className="font-bold uppercase tracking-tighter text-base md:text-lg mb-1">Zona urbana e rural</h4>
              <p className="text-neutral-500 text-xs md:text-sm">Levando acesso ao esporte também para regiões afastadas.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <Heart className="w-6 h-6 mb-3 text-black" />
              <h4 className="font-bold uppercase tracking-tighter text-base md:text-lg mb-1">Famílias</h4>
              <p className="text-neutral-500 text-xs md:text-sm">Criando impacto social além do campo.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="w-6 h-6 mb-3 text-black" />
              <h4 className="font-bold uppercase tracking-tighter text-base md:text-lg mb-1">Formação cidadã</h4>
              <p className="text-neutral-500 text-xs md:text-sm">Disciplina, respeito, educação e convivência.</p>
            </div>
          </div>
        </div>

        {/* BLOCO 3 — O QUE O PROJETO PRECISA */}
        <div className="bg-black text-white p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0,transparent_50%)] pointer-events-none" />
          <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-8 relative z-10 text-center">Estrutura que queremos construir</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 text-center relative z-10">
            {[
              { name: "Uniformes", icon: Shirt },
              { name: "Materiais esportivos", icon: Dumbbell },
              { name: "Transporte", icon: Bus },
              { name: "Alimentação", icon: Utensils },
              { name: "Campo estruturado", icon: Flag },
              { name: "Iluminação", icon: Lightbulb },
              { name: "Equipe técnica", icon: Users },
              { name: "Espaço para treinamento", icon: Building },
              { name: "Ações educacionais", icon: GraduationCap },
              { name: "Tecnologia", icon: Laptop }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3 py-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 mb-3 bg-white text-black rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs md:text-sm tracking-tight leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <SuccessCasesBlock />

        {/* NOVA SEÇÃO DE METAS (Substitui Bloco 4 e 5) */}
        <div className="pt-8 border-t border-neutral-200">
          <div className="text-center mb-12">
            <span className="inline-block border border-black/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] font-bold mb-4 rounded-full">
              Visão de Futuro
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase italic mb-4 tracking-tighter leading-tight text-neutral-900">
              NOSSA META PARA 2026
            </h3>
            <p className="text-neutral-500 text-base md:text-lg max-w-xl mx-auto font-medium">
              "Expandir o impacto social do GAMELEIRA dentro e fora de campo."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-16">
            {/* Card 1 */}
            <div className="bg-neutral-900 text-white p-5 md:p-6 rounded-3xl flex flex-col relative overflow-hidden group hover:shadow-xl hover:shadow-black/20 transition-all hover:-translate-y-1">
              <Users className="w-6 h-6 md:w-8 md:h-8 mb-3 opacity-80" />
              <div className="text-3xl md:text-4xl font-black italic mb-1 tracking-tighter leading-none">+200</div>
              <h4 className="font-bold text-base md:text-lg mb-1 mt-auto tracking-tight">Crianças impactadas</h4>
              <p className="text-[11px] md:text-xs opacity-70 font-medium">Atendimento esportivo e social contínuo durante o ano.</p>
              <Users className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-neutral-200 text-black p-5 md:p-6 rounded-3xl flex flex-col relative overflow-hidden group hover:shadow-xl hover:border-neutral-300 transition-all hover:-translate-y-1">
              <Target className="w-6 h-6 md:w-8 md:h-8 mb-3 text-neutral-400 group-hover:text-black transition-colors" />
              <div className="text-2xl md:text-3xl font-black italic mb-1 tracking-tighter text-neutral-900 leading-none">4x por semana</div>
              <h4 className="font-bold text-base md:text-lg mb-1 mt-auto tracking-tight">Treinamentos semanais</h4>
              <p className="text-[11px] md:text-xs text-neutral-500 font-medium">Atividades esportivas organizadas com acompanhamento técnico.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-neutral-900 text-white p-5 md:p-6 rounded-3xl flex flex-col relative overflow-hidden group hover:shadow-xl hover:shadow-black/20 transition-all hover:-translate-y-1">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 mb-3 text-neutral-400 group-hover:text-white transition-colors" />
              <div className="text-2xl md:text-3xl font-black italic mb-1 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 leading-tight">Competições regionais</div>
              <h4 className="font-bold text-base md:text-lg mb-1 mt-auto tracking-tight">Participação esportiva</h4>
              <p className="text-[11px] md:text-xs text-neutral-400 font-medium">Inserir jovens em campeonatos e experiências competitivas.</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-neutral-200 text-black p-5 md:p-6 rounded-3xl flex flex-col relative overflow-hidden group hover:shadow-xl hover:border-neutral-300 transition-all hover:-translate-y-1">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 mb-3 text-neutral-400 group-hover:text-black transition-colors" />
              <div className="text-2xl md:text-3xl font-black italic mb-1 tracking-tighter leading-tight text-neutral-900">Apoio educacional</div>
              <h4 className="font-bold text-base md:text-lg mb-1 mt-auto tracking-tight">Melhora no desempenho escolar</h4>
              <p className="text-[11px] md:text-xs text-neutral-500 font-medium">Estimular disciplina, frequência e desenvolvimento educacional.</p>
            </div>

            {/* Card 5 */}
            <div className="bg-neutral-900 text-white p-5 md:p-6 rounded-3xl flex flex-col relative overflow-hidden group hover:shadow-xl hover:shadow-black/20 transition-all hover:-translate-y-1">
              <Heart className="w-6 h-6 md:w-8 md:h-8 mb-3 text-neutral-400 group-hover:text-white transition-colors" />
              <div className="text-2xl md:text-3xl font-black italic mb-1 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 leading-tight">Desenvolvimento familiar</div>
              <h4 className="font-bold text-base md:text-lg mb-1 mt-auto tracking-tight">Fortalecimento de vínculos</h4>
              <p className="text-[11px] md:text-xs text-neutral-400 font-medium">Promover convivência saudável entre jovens, esporte e família.</p>
            </div>

            {/* Card 6 */}
            <div className="bg-white border border-neutral-200 text-black p-5 md:p-6 rounded-3xl flex flex-col relative overflow-hidden group hover:shadow-xl hover:border-neutral-300 transition-all hover:-translate-y-1">
              <Building className="w-6 h-6 md:w-8 md:h-8 mb-3 text-neutral-400 group-hover:text-black transition-colors" />
              <div className="text-2xl md:text-3xl font-black italic mb-1 tracking-tighter leading-tight text-neutral-900">Estrutura esportiva</div>
              <h4 className="font-bold text-base md:text-lg mb-1 mt-auto tracking-tight">Expansão do projeto</h4>
              <p className="text-[11px] md:text-xs text-neutral-500 font-medium">Investimento em materiais, transporte e equipe técnica.</p>
            </div>
          </div>

          <div className="text-center pb-4">
            <h4 className="text-xl md:text-2xl lg:text-3xl font-black italic tracking-tighter text-neutral-900 bg-neutral-200 inline-block px-6 py-3 rounded-2xl">
              Mais do que formar atletas, queremos formar cidadãos preparados para a vida.
            </h4>
          </div>
        </div>

      </div>
    </section>
  );
};

const SuccessCasesBlock = () => {
  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionHeader title="Exemplos Reais" subtitle="O Esporte Transforma" />
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase italic mb-6 tracking-tighter leading-tight text-neutral-900 max-w-4xl mx-auto">
            Veja exemplos de projetos que já são beneficiados pela Lei de Incentivo
          </h3>
          <p className="text-neutral-900 font-black text-sm md:text-lg uppercase tracking-widest mt-2 px-6 py-3 bg-[#E4F100] inline-block rounded-xl shadow-lg border border-black/5 transform -rotate-1">
            IMAGINA O GAMELEIRA RECEBENDO ESSE APOIO
          </p>
        </div>

        {/* YouTube Mockup */}
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-neutral-200 bg-white hover:shadow-3xl transition-shadow duration-500">
          <div className="aspect-video w-full bg-black">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/f7HfSB9zbWU?si=T2jOqgN931_tO_B1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen>
            </iframe>
          </div>
          <div className="p-4 md:p-5">
            <h4 className="text-lg md:text-xl font-bold text-neutral-900 mb-3 line-clamp-2">
              Lei amplia incentivos ao esporte em Minas.
            </h4>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#CC0000] flex items-center justify-center flex-shrink-0 text-white font-black text-xl overflow-hidden shadow-inner">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-neutral-900">Assembleia de Minas Gerais</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" fill="currentColor" />
                  </div>
                  <div className="text-xs text-neutral-500">237 mil subscritores</div>
                </div>
                <button className="ml-1 md:ml-3 bg-neutral-900 hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-full transition-colors flex-shrink-0">
                  Subscrever
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <div className="flex items-center bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors">
                  <button className="flex items-center gap-2 px-3 py-2 border-r border-neutral-300">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">1</span>
                  </button>
                  <button className="px-3 py-2">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
                <button className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-full transition-colors flex-shrink-0">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">Partilhar</span>
                </button>
                <button className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-full transition-colors flex-shrink-0">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">Guardar</span>
                </button>
                <button className="flex items-center justify-center w-9 h-9 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors flex-shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Galeria Carrossel - Visão de Futuro */}
        <div className="mt-20 pt-12 border-t border-neutral-200 w-full overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              Projeção de Estrutura
            </span>
            <h4 className="text-xl md:text-2xl font-black italic text-neutral-900 tracking-tight">
              Como o GAMELEIRA poderá ficar com o apoio das empresas
            </h4>
          </div>

          <div className="relative w-full overflow-hidden">
            {/* Fade overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <motion.div 
              className="flex gap-4 md:gap-6 w-max py-4 cursor-grab active:cursor-grabbing"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            >
              {[
                "/ct01.png",
                "/img-002.png",
                "/ct02.png",
                "/ct03.png",
                "/ct04.png",
                "/ct05.png",
                "/ct06.png",
                "/ct01.png",
                "/img-002.png",
                "/ct02.png",
                "/ct03.png",
                "/ct04.png",
                "/ct05.png",
                "/ct06.png"
              ].map((src, idx) => (
                <div key={idx} className="w-64 md:w-80 aspect-[4/3] rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-neutral-200 bg-neutral-50 group relative">
                  <img src={src} alt="Projeção GAMELEIRA" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="text-center mt-10">
            <a 
              href="/apoiar"
              className="inline-flex items-center gap-3 bg-black text-white hover:bg-neutral-800 font-bold px-8 py-4 rounded-full text-sm md:text-base tracking-tight shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 group"
            >
              <span>QUERO APOIAR O GAMELEIRA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

const InstitutionSection = () => {
  return (
    <section id="instituicao" className="py-24 px-6 bg-black text-white overflow-hidden relative">
      {/* Decorative Tree Silhouette Background */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
         <div className="text-[40rem] font-black leading-none">
           <span className="inline-block transform rotate-12 italic">G</span>
         </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        <div className="w-full md:w-1/2">
          <SectionHeader title="GAMELEIRA" subtitle="História e Tradição" light />
          <div className="space-y-6 text-neutral-400 text-lg leading-relaxed mb-10 font-sans">
            <p>
              Fundado no coração de Belo Horizonte, o GAMELEIRA é mais que um clube de futebol. É uma instituição que respira a história do bairro e a paixão dos mineiros.
            </p>
            <p className="border-l-2 border-white/20 pl-6 italic font-serif text-white">
              "Respeita Minha História" não é apenas um lema, é a nossa essência e o compromisso que assumimos com cada jovem que veste a nossa camisa.
            </p>
            <p>
              Com décadas de atuação, já revelamos talentos que brilharam no cenário nacional, sempre mantendo o compromisso de pés no chão e olhos no futuro comercial e social.
            </p>
          </div>
          {/* GALERIA DE TROFÉUS E CONQUISTAS */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-400 block mb-4">
              Nossa Galeria de Conquistas
            </span>
            <div className="grid grid-cols-3 gap-4">
              {/* Troféu 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center group hover:bg-white/10 transition-colors">
                <div className="relative mb-2">
                  <div className="absolute inset-0 bg-neutral-400/20 blur-md rounded-full" />
                  <Trophy className="w-10 h-10 text-neutral-300 group-hover:scale-110 transition-transform relative z-10" strokeWidth={1.5} />
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-center text-white mt-1">
                  Copa Regional
                </div>
                <span className="text-[9px] text-neutral-400 font-bold tracking-widest block uppercase mt-0.5">Títulos Invicto</span>
              </div>

              {/* Troféu 2 (Destaque Central) */}
              <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center group hover:border-white/40 transition-colors relative overflow-hidden">
                <div className="absolute top-0 w-12 h-1 bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="relative mb-2 flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-white/10 blur-xl rounded-full" />
                  <div className="flex items-end gap-1 relative z-10">
                    <Trophy className="w-6 h-6 text-neutral-400 opacity-60" strokeWidth={1.5} />
                    <Trophy className="w-12 h-12 text-white group-hover:scale-110 transition-transform" strokeWidth={2} />
                    <Trophy className="w-6 h-6 text-neutral-400 opacity-60" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-center text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-100 mt-1">
                  Galeria Oficial
                </div>
                <span className="text-[9px] text-neutral-400 font-bold tracking-widest block uppercase mt-0.5">15 Taças Conquistadas</span>
              </div>

              {/* Troféu 3 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center group hover:bg-white/10 transition-colors">
                <div className="relative mb-2">
                  <div className="absolute inset-0 bg-neutral-400/20 blur-md rounded-full" />
                  <Trophy className="w-10 h-10 text-neutral-300 group-hover:scale-110 transition-transform relative z-10" strokeWidth={1.5} />
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-center text-white mt-1">
                  Talento Mineiro
                </div>
                <span className="text-[9px] text-neutral-400 font-bold tracking-widest block uppercase mt-0.5">Reconhecimento</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 relative group">
          {/* O Vídeo do Gameleira incorporado */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-neutral-900 relative z-10">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/b-T8Jz5-X_c?si=embed" 
              title="GAMELEIRA INSTITUCIONAL" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen>
            </iframe>
          </div>

          {/* Adesivo / Badge do Escudo sobreposto no canto superior direito */}
          <div className="absolute -top-6 -right-4 md:-right-6 z-20 w-24 h-24 md:w-28 md:h-28 bg-black border-4 border-white rounded-full flex flex-col items-center justify-center p-3 shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <img src="/escudo.png" alt="Escudo GAMELEIRA" className="w-10 h-10 md:w-12 md:h-12 object-contain mb-1 drop-shadow" />
            <span className="text-[7px] md:text-[8px] font-black tracking-tighter block text-center text-white leading-none">
              TRADIÇÃO
            </span>
          </div>

          {/* Sombra decorativa posterior */}
          <div className="absolute -z-0 top-4 left-4 w-full h-full border border-white/5 rounded-2xl" />

          {/* Cardzinho Preview do Instagram */}
          <div className="mt-6 bg-white text-black p-4 md:p-5 rounded-2xl shadow-xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-4 relative z-20">
            {/* Foto de Perfil */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-neutral-200 p-1 flex-shrink-0 bg-neutral-50 overflow-hidden">
              <img src="/escudo.png" alt="Gameleira F7" className="w-full h-full object-contain" />
            </div>

            {/* Dados e Bio */}
            <div className="flex-grow text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mb-1 justify-center sm:justify-start">
                <span className="font-bold text-sm md:text-base tracking-tight text-neutral-900">gameleiraf7</span>
                <span className="text-[10px] text-neutral-400 font-medium hidden sm:inline">•</span>
                <span className="text-xs text-neutral-500 font-medium">Gameleira F7</span>
              </div>

              {/* Stats */}
              <div className="flex justify-center sm:justify-start gap-3 text-[11px] md:text-xs text-neutral-700 font-medium mb-2">
                <span><strong className="text-black">769</strong> posts</span>
                <span><strong className="text-black">6.793</strong> seguidores</span>
                <span><strong className="text-black">100</strong> seguindo</span>
              </div>

              {/* Bio descritiva */}
              <div className="text-[11px] text-neutral-600 leading-snug space-y-0.5">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3 h-3 text-neutral-400" /> Ubaporanga-MG
                </div>
                <div>🏆 CAMPEÃO BRASILEIRO 2025</div>
                <div>🏆 Campeão Mineiro 23</div>
                <div>🥈 Vice Campeão Mineiro 25</div>
              </div>
            </div>

            {/* Botão Seguir / Acessar */}
            <a 
              href="https://www.instagram.com/gameleiraf7/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs flex-shrink-0 mt-2 sm:mt-0"
            >
              <Instagram className="w-3.5 h-3.5" /> Seguir
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const IncentiveLawSection = () => {
  return (
    <section id="lei" className="py-24 px-6 bg-neutral-50 border-t border-neutral-200 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="text-center">
          <SectionHeader title="Como Funciona?" subtitle="A Lei de Incentivo ao Esporte" />
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase italic mb-4 tracking-tighter leading-tight text-neutral-900 max-w-4xl mx-auto">
            Seu imposto pode gerar impacto social na própria região da sua empresa.
          </h3>
          <p className="text-neutral-500 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Entenda como destinar parte do seu ICMS para o esporte sem tirar nenhum centavo a mais do caixa.
          </p>
        </div>
        
        {/* FLUXO - COMO FUNCIONA */}
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[2.5rem] left-[12.5%] right-[12.5%] h-0.5 bg-neutral-200 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white border border-neutral-200 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-black group-hover:scale-110 transition-all">
                <Receipt className="w-8 h-8 text-black" />
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black opacity-50 mb-2 text-black">Passo 1</div>
              <p className="font-bold text-sm text-neutral-800">Sua empresa paga ICMS normalmente.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white border border-neutral-200 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-black group-hover:scale-110 transition-all">
                <ArrowRightLeft className="w-8 h-8 text-black" />
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black opacity-50 mb-2 text-black">Passo 2</div>
              <p className="font-bold text-sm text-neutral-800">Parte desse imposto pode ser destinada ao projeto.</p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white border border-neutral-200 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-black group-hover:scale-110 transition-all">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black opacity-50 mb-2 text-black">Passo 3</div>
              <p className="font-bold text-sm text-neutral-800">O valor investido é abatido do imposto devido.</p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8" />
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black opacity-50 mb-2 text-black">Passo 4</div>
              <p className="font-bold text-sm text-neutral-800">Recurso utilizado no esporte com fiscalização oficial.</p>
            </div>
          </div>
        </div>
        
        {/* CARDS INSTITUCIONAIS DETALHADOS (REQUISITOS E REGRAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Quem pode apoiar & Benefícios */}
          <div className="bg-black text-white p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden border border-neutral-800">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-2.5 py-1 rounded">
                  Elegibilidade
                </span>
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">MG</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-3 italic">
                Quem pode apoiar e Benefício Fiscal
              </h3>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                Empresas contribuintes do ICMS em Minas Gerais, apuradoras no regime de <strong>Débito e Crédito</strong>.
              </p>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 block mb-1">Dedução Padrão</span>
                <p className="text-xs font-bold text-white">Até 3% do ICMS devido para saldos devedores de até R$ 19.911.600,00 no ano anterior (2% acima desse valor).</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 block mb-1">Limite Estadual</span>
                <p className="text-xs font-bold text-white">Até 800.000 UFEMGs anuais por Inscrição Estadual.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Requisitos Obrigatórios */}
          <div className="bg-white border border-neutral-200 p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-neutral-900 text-white px-2.5 py-1 rounded">
                  Obrigatório
                </span>
                <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Requisitos</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-3 italic text-neutral-900">
                Requisitos para a Destinação
              </h3>
              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                Para garantir total conformidade e segurança jurídica, a empresa precisa cumprir três critérios básicos estabelecidos pela Secretaria de Estado:
              </p>
            </div>

            <ul className="space-y-3.5 border-t border-neutral-100 pt-6">
              <li className="flex items-start gap-3 text-xs md:text-sm font-bold text-neutral-800">
                <CheckCircle2 className="w-5 h-5 text-neutral-900 flex-shrink-0 mt-0.5" />
                <span><strong>Regularidade Fiscal:</strong> Possuir CDT (Certidão de Débitos Tributários) de MG negativa ou positiva com efeito de negativa.</span>
              </li>
              <li className="flex items-start gap-3 text-xs md:text-sm font-bold text-neutral-800">
                <CheckCircle2 className="w-5 h-5 text-neutral-900 flex-shrink-0 mt-0.5" />
                <span><strong>ICMS Corrente:</strong> O imposto a ser deduzido deve ser estritamente do período corrente.</span>
              </li>
              <li className="flex items-start gap-3 text-xs md:text-sm font-bold text-neutral-800">
                <CheckCircle2 className="w-5 h-5 text-neutral-900 flex-shrink-0 mt-0.5" />
                <span><strong>Rastreabilidade:</strong> Depósito identificado e direto na conta bancária oficial do projeto captador.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Prazos e Plataforma */}
          <div className="bg-white border border-neutral-200 p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded border border-neutral-200">
                  Operacional
                </span>
                <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">SEI!MG</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-3 italic text-neutral-900">
                Prazos e Sistema Oficial
              </h3>
              <p className="text-neutral-600 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                O fluxo processual tramita de forma transparente e digital dentro dos sistemas do Governo de Minas Gerais.
              </p>
            </div>

            <div className="space-y-4 border-t border-neutral-100 pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg text-neutral-900 mt-0.5">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Prazo de Dedução</span>
                  <p className="text-xs text-neutral-500">A dedução/abatimento do imposto pode ocorrer até 5 anos após a data do repasse financeiro.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg text-neutral-900 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Plataforma SEI!MG</span>
                  <p className="text-xs text-neutral-500">Exige cadastro prévio do Representante Legal da empresa e validação por assinatura eletrônica.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Segurança & Multi-Patrocínio */}
          <div className="bg-neutral-900 text-white p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-xl border border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded">
                  Estratégico
                </span>
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Governança</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-3 italic">
                Múltiplos Projetos e Não-Competição
              </h3>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-medium">
                A legislação de incentivo foi desenhada para somar forças com o planejamento estratégico corporativo:
              </p>
            </div>

            <ul className="space-y-3.5 border-t border-neutral-800 pt-6 mt-6">
              <li className="flex items-start gap-3 text-xs md:text-sm text-neutral-300">
                <Check className="w-4 h-4 text-white flex-shrink-0 mt-1" />
                <span><strong>Sem concorrência de verba:</strong> Os incentivos fiscais da Cultura e do Esporte não competem entre si. A empresa pode utilizar os limites legais de ambos simultaneamente.</span>
              </li>
              <li className="flex items-start gap-3 text-xs md:text-sm text-neutral-300">
                <Check className="w-4 h-4 text-white flex-shrink-0 mt-1" />
                <span><strong>Multi-Apoio:</strong> Um mesmo CNPJ/Inscrição Estadual pode atuar como patrocinador de vários projetos esportivos distintos.</span>
              </li>
              <li className="flex items-start gap-3 text-xs md:text-sm text-neutral-300">
                <Check className="w-4 h-4 text-white flex-shrink-0 mt-1" />
                <span><strong>Retorno ODS:</strong> Fortalece relatórios de sustentabilidade e metas de impacto local (Saúde, Bem-estar e Redução de Desigualdades).</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Linha Visual de Confiança */}
        <div className="pt-10 border-t border-neutral-200 flex flex-wrap justify-center gap-3 md:gap-6 opacity-60">
          <div className="text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2 border border-neutral-300 rounded-full flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Governo de MG
          </div>
          <div className="text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2 border border-neutral-300 rounded-full flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Lei de Incentivo
          </div>
          <div className="text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2 border border-neutral-300 rounded-full flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Fiscalização SEDESE
          </div>
          <div className="text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2 border border-neutral-300 rounded-full flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Prestação de Contas
          </div>
        </div>

      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "Como o dinheiro chega ao GAMELEIRA?",
      a: "As empresas habilitadas pagam um boleto da DAE (Documento de Arrecadação Estadual) específico do projeto. O Estado então repassa o valor para a conta vinculada do projeto."
    },
    {
      q: "Existe risco para a empresa que apoia?",
      a: "Não. O processo é totalmente legalizado e previsto na Lei Estadual 20.824/2013. A empresa apenas redireciona um valor que já seria tributo."
    },
    {
      q: "A marca da minha empresa aparece onde?",
      a: "Em todos os uniformes, placas no CT, redes sociais, banners de eventos e materiais de comunicação oficial do projeto."
    },
    {
      q: "O projeto já começou a captar?",
      a: "Sim, estamos captando e realizando o diagnóstico gratuito de viabilidade fiscal das empresas interessadas para alinhar o melhor formato de contrapartida institucional."
    }
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 bg-black text-white">
      <div className="max-w-3xl mx-auto">
        <SectionHeader title="FAQ" subtitle="Perguntas Frequentes" light />
        
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="border-b border-white/10">
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center py-6 text-left hover:text-neutral-400 transition-colors"
              >
                <span className="text-lg font-bold uppercase tracking-tight italic">{item.q}</span>
                {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <motion.div 
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-neutral-400 text-sm leading-relaxed">
                  {item.a}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-black italic">GAMELEIRA</div>
        <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 text-center md:text-left">
          © {new Date().getFullYear()} Associação Esportiva Gameleira. <br className="md:hidden" /> todos os direitos reservados.
        </div>
        <div>
          <a 
            href="https://www.instagram.com/gameleiraf7/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity group"
          >
            <Instagram className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            <span className="text-xs uppercase font-bold tracking-widest">Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [showFloat, setShowFloat] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloat(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <VideoPitchSection />
      <ProjectSection />
      <InstitutionSection />
      <IncentiveLawSection />
      <FAQSection />
      <Footer />

      {/* Floating CTA */}
      <AnimatePresence>
        {showFloat && (
          <motion.a
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            href="/apoiar"
            className="fixed bottom-8 right-8 z-[60] bg-black text-white p-4 rounded-full shadow-2xl lg:hidden flex items-center justify-center border border-white/20"
          >
            <ArrowRight className="w-6 h-6" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
