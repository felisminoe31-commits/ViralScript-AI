import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Lock, Crown, CheckCircle2, X, Clock, ChevronRight, Calendar, Trash2 } from 'lucide-react';
import { Button } from './components/Button';
import { Input, Select } from './components/Input';
import { ScriptCard } from './components/ScriptCard';
import { generateViralScript } from './services/geminiService';
import { AppState, GeneratedScript, ScriptRequest, HistoryItem } from './types';

// ==========================================
// CONFIGURAÇÃO
// ==========================================
const PAYMENT_LINK = "https://oxapay.com/pay/SEU_CODIGO_AQUI"; 
const VIP_PRICE = "2.50 USDT";
const MAX_HISTORY_ITEMS = 10;

// Ferramentas PRO (Bloqueadas para gratuitos)
const PRO_TOOLS = ['viral_script', 'ideas', 'storytelling', 'vendas', 'polemica'];

// Opções do Select
const TOOL_OPTIONS = [
    { label: "✨ Gerador de Bio (Grátis)", value: "bio" },
    { label: "#️⃣ Gerador de Hashtags (Grátis)", value: "hashtags" },
    { label: "🔥 Ganchos/Headlines (Grátis)", value: "hooks" },
    { label: "🛡️ Resposta para Haters (Grátis)", value: "hater" },
    { label: "🧠 Explicação Simplificada (Grátis)", value: "simples" },
    { label: "🔒 Roteiro Viral TikTok (PREMIUM)", value: "viral_script" },
    { label: "🔒 Calendário 30 Dias (PREMIUM)", value: "ideas" },
    { label: "🔒 ✍️ Legenda Storytelling (PREMIUM)", value: "storytelling" },
    { label: "🔒 💰 Roteiro de Vendas/Stories (PREMIUM)", value: "vendas" },
    { label: "🔒 🌶️ Ideias Polêmicas (PREMIUM)", value: "polemica" }
];

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.FORM);
  const [formData, setFormData] = useState<ScriptRequest>({ 
      tool: 'bio', 
      niche: '', 
      audience: '', 
      tone: 'autoridade' // Default para bio
  });
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isVip, setIsVip] = useState<boolean>(false);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  
  // Controle de scroll para animação do header
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Controle de navegação (saber se veio do histórico para o botão voltar funcionar direito)
  const [fromHistory, setFromHistory] = useState<boolean>(false);

  // Inicialização
  useEffect(() => {
    // 1. Telegram Init
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#1a1a1a');
      window.Telegram.WebApp.setBackgroundColor('#1a1a1a');
    }

    // 2. Verificar URL params (?status=vip)
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    
    if (statusParam === 'vip') {
        localStorage.setItem('viralScript_isVip', 'true');
        setIsVip(true);
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        const storedVip = localStorage.getItem('viralScript_isVip');
        if (storedVip === 'true') {
            setIsVip(true);
        }
    }

    // 3. Carregar Histórico
    try {
        const storedHistory = localStorage.getItem('viralScript_history');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    } catch (e) {
        console.error("Erro ao carregar histórico", e);
    }

    // 4. Scroll Listener
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  }, []);

  // Back Button Logic
  useEffect(() => {
    const handleBack = () => {
      if (appState === AppState.RESULT) {
        if (fromHistory) {
            setAppState(AppState.HISTORY);
        } else {
            setAppState(AppState.FORM);
            setScript(null);
        }
      } else if (appState === AppState.HISTORY) {
        setAppState(AppState.FORM);
      }
    };

    if (window.Telegram?.WebApp?.BackButton) {
      if (appState === AppState.RESULT || appState === AppState.HISTORY) {
        window.Telegram.WebApp.BackButton.show();
        window.Telegram.WebApp.BackButton.onClick(handleBack);
      } else {
        window.Telegram.WebApp.BackButton.hide();
      }
    }
    return () => {
        if (window.Telegram?.WebApp?.BackButton) window.Telegram.WebApp.BackButton.offClick(handleBack);
    };
  }, [appState, fromHistory]);

  // Salvar no Histórico
  const saveToHistory = (newScript: GeneratedScript, request: ScriptRequest) => {
      const newItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          request: request,
          script: newScript
      };

      const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      setHistory(updatedHistory);
      localStorage.setItem('viralScript_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
      if(confirm('Tem certeza que deseja apagar todo o histórico?')) {
          setHistory([]);
          localStorage.removeItem('viralScript_history');
      }
  };

  const getDynamicFields = (tool: string) => {
      let tones = [];

      // Definição dos Tons baseados na ferramenta
      switch(tool) {
          case 'bio':
              tones = [
                  { label: "Autoridade / Líder", value: "autoridade" },
                  { label: "Minimalista / Clean", value: "minimalista" },
                  { label: "Amigável / Acolhedor", value: "amigavel" },
                  { label: "Criativo / Diferentão", value: "criativo" }
              ];
              break;
          case 'hater':
              tones = [
                  { label: "Debochada / Sarcástica", value: "debochado" },
                  { label: "Elegante / Superior", value: "elegante" },
                  { label: "Educativo / Zen", value: "educativo" },
                  { label: "Irônica", value: "ironico" }
              ];
              break;
          case 'vendas':
              tones = [
                  { label: "Persuasivo (Alta Conversão)", value: "persuasivo" },
                  { label: "Urgência / Escassez", value: "urgencia" },
                  { label: "Consultivo / Educativo", value: "consultivo" },
                  { label: "Exclusivo / Premium", value: "exclusivo" }
              ];
              break;
          case 'storytelling':
              tones = [
                  { label: "Emocional / Dramático", value: "emocional" },
                  { label: "Inspirador / Motivacional", value: "inspirador" },
                  { label: "Vulnerável / Realista", value: "vulneravel" },
                  { label: "Engraçado / Leve", value: "engracado" }
              ];
              break;
          case 'simples':
              tones = [
                  { label: "Didático (Professor)", value: "didatico" },
                  { label: "Lúdico / Divertido", value: "ludico" },
                  { label: "Comédia / Humor", value: "comedia" }
              ];
              break;
          case 'polemica':
              tones = [
                  { label: "Polêmico / Ousado", value: "polemico" },
                  { label: "Crítico / Ácido", value: "critico" },
                  { label: "Misterioso", value: "misterioso" }
              ];
              break;
          default: // Roteiro Viral, Hashtags, Hooks, Ideas
              tones = [
                  { label: "Descontraído e Divertido", value: "engracado" },
                  { label: "Profissional e Autoritário", value: "serio" },
                  { label: "Polêmico e Ousado", value: "polemico" },
                  { label: "Inspirador e Emocional", value: "motivacional" },
                  { label: "Sarcástico / Debochado", value: "debochado" },
              ];
              break;
      }

      switch(tool) {
          case 'bio':
              return { 
                  nicheLabel: 'Profissão ou Cargo', nichePlace: 'Ex: Personal Trainer...', 
                  audienceLabel: 'O que oferece?', audiencePlace: 'Ex: Ajudo a emagrecer...',
                  toneOptions: tones 
              };
          case 'hashtags':
              return { 
                  nicheLabel: 'Nicho Principal', nichePlace: 'Ex: Marketing Digital...', 
                  audienceLabel: 'Tópico do Post', audiencePlace: 'Ex: Dicas de Reels...',
                  toneOptions: tones
              };
          case 'viral_script':
          case 'hooks':
              return { 
                  nicheLabel: 'Tema do Vídeo', nichePlace: 'Ex: 3 Dicas para economizar...', 
                  audienceLabel: 'Público Alvo', audiencePlace: 'Ex: Iniciantes...',
                  toneOptions: tones 
              };
          case 'ideas':
              return { 
                  nicheLabel: 'Seu Nicho', nichePlace: 'Ex: Finanças...', 
                  audienceLabel: 'Objetivo', audiencePlace: 'Ex: Vender consultoria...',
                  toneOptions: tones 
              };
          case 'storytelling':
              return { 
                  nicheLabel: 'Sobre o que é a história?', nichePlace: 'Ex: Como comecei minha empresa...', 
                  audienceLabel: 'Lição ou Objetivo', audiencePlace: 'Ex: Inspirar a não desistir...',
                  toneOptions: tones 
              };
          case 'vendas':
              return { 
                  nicheLabel: 'Produto ou Oferta', nichePlace: 'Ex: Curso de Inglês...', 
                  audienceLabel: 'Público Alvo', audiencePlace: 'Ex: Quem quer viajar...',
                  toneOptions: tones 
              };
          case 'hater':
              return { 
                  nicheLabel: 'Comentário do Hater', nichePlace: 'Ex: "Seu conteúdo é horrível"...', 
                  audienceLabel: 'Contexto', audiencePlace: 'Ex: Sou especialista...',
                  toneOptions: tones 
              };
          case 'polemica':
              return { 
                  nicheLabel: 'Nicho / Tema', nichePlace: 'Ex: Nutrição...', 
                  audienceLabel: 'Público Alvo', audiencePlace: 'Ex: Veganos...',
                  toneOptions: tones 
              };
          case 'simples':
              return { 
                  nicheLabel: 'Conceito Complexo', nichePlace: 'Ex: Blockchain...', 
                  audienceLabel: 'Para quem explicar?', audiencePlace: 'Ex: Crianças...',
                  toneOptions: tones 
              };
          default:
              return { 
                  nicheLabel: 'Nicho', nichePlace: '...', 
                  audienceLabel: 'Público', audiencePlace: '...',
                  toneOptions: tones
              };
      }
  };

  const dynamicFields = getDynamicFields(formData.tool);

  // Manipuladores
  const handleToolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTool = e.target.value;
      const newConfig = getDynamicFields(newTool); // Pega a config da nova ferramenta para saber o tom padrão
      
      const updatedFormData = { 
          ...formData, 
          tool: newTool,
          tone: newConfig.toneOptions[0].value // Reseta o tom para o primeiro da lista válida
      };

      setFormData(updatedFormData);

      if (PRO_TOOLS.includes(newTool) && !isVip) {
          setShowPremiumModal(true);
      }
  };

  const handleGenerate = async () => {
    if (!formData.niche) return;
    
    if (PRO_TOOLS.includes(formData.tool) && !isVip) {
        setShowPremiumModal(true);
        return;
    }

    setAppState(AppState.LOADING);
    setFromHistory(false); // Nova geração, não veio do histórico

    try {
      const result = await generateViralScript(formData);
      setScript(result);
      saveToHistory(result, formData); // Salva automaticamente
      setAppState(AppState.RESULT);
    } catch (e) {
      setAppState(AppState.FORM);
      alert("Erro ao conectar com a IA. Tente novamente.");
    }
  };

  const handleUnlockClick = () => {
    if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(PAYMENT_LINK);
    else window.open(PAYMENT_LINK, '_blank');
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
      setScript(item.script);
      setFromHistory(true); // Marca que veio do histórico para o botão voltar funcionar
      setAppState(AppState.RESULT);
  };

  // Helper para formatar data
  const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const getToolLabel = (value: string) => {
      const option = TOOL_OPTIONS.find(o => o.value === value);
      let label = option ? option.label : value;
      // Remove emojis e textos extras para ficar limpo na lista
      return label.replace(/✨|#️⃣|🔥|🛡️|🧠|🔒|💰|✍️|🌶️|\(Grátis\)|\(PREMIUM\)/g, '').trim();
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative font-inter" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        
        {/* Header Animado */}
        <header 
            className={`flex justify-between items-center border-b border-gray-800 bg-[#1a1a1a] z-10 sticky top-0 transition-all duration-300 ease-in-out ${
                isScrolled ? 'py-3 px-5 shadow-lg bg-[#1a1a1a]/95 backdrop-blur-md' : 'p-5'
            }`}
        >
            <div className="flex items-center gap-2" onClick={() => setAppState(AppState.FORM)}>
                <div className={`bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg cursor-pointer transition-all duration-300 ${isScrolled ? 'p-1' : 'p-1.5'}`}>
                    <Sparkles size={isScrolled ? 14 : 16} className="text-white" />
                </div>
                <h1 className={`font-bold tracking-tight cursor-pointer transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg'}`}>
                    ViralScript AI
                </h1>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setAppState(AppState.HISTORY)}
                    className="p-2 text-gray-400 hover:text-white transition-colors relative"
                >
                    <Clock size={isScrolled ? 18 : 20} />
                    {history.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
                </button>

                {isVip ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                        <Crown size={12} className="text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-500 uppercase">VIP</span>
                    </div>
                ) : (
                    <div className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                        <span className="text-xs font-medium text-gray-400">Grátis</span>
                    </div>
                )}
            </div>
        </header>

        <main className="flex-1 p-5 flex flex-col relative">
            
            {/* Modal Premium */}
            {showPremiumModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#242424] border border-yellow-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-300"></div>
                        <button onClick={() => setShowPremiumModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white"><X size={20} /></button>
                        <div className="flex flex-col items-center text-center space-y-4 pt-2">
                            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-4 rounded-full shadow-lg shadow-yellow-500/20 mb-2"><Lock size={32} className="text-white" /></div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Seja Membro VIP!</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">Acesso ilimitado a <span className="text-yellow-400 font-bold">Roteiros de Vendas</span>, <span className="text-yellow-400 font-bold">Storytelling</span> e +10 ferramentas.</p>
                            </div>
                            <button onClick={handleUnlockClick} className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-bold rounded-xl shadow-lg active:scale-95 flex items-center justify-center gap-2">Desbloquear por {VIP_PRICE}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* FORM SCREEN */}
            {appState === AppState.FORM && (
                <div className="space-y-5 animate-slide-up">
                    <Select 
                        label="O que vamos criar hoje?"
                        value={formData.tool}
                        onChange={handleToolChange}
                        options={TOOL_OPTIONS}
                        className="border-gray-700 bg-[#242424] focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="space-y-4">
                        <Input 
                            label={dynamicFields.nicheLabel}
                            placeholder={dynamicFields.nichePlace}
                            value={formData.niche}
                            onChange={(e) => setFormData({...formData, niche: e.target.value})}
                            className="bg-[#242424] border-gray-700"
                        />
                        <Input 
                            label={dynamicFields.audienceLabel}
                            placeholder={dynamicFields.audiencePlace}
                            value={formData.audience}
                            onChange={(e) => setFormData({...formData, audience: e.target.value})}
                            className="bg-[#242424] border-gray-700"
                        />
                        <Select 
                            label="Tom de Voz"
                            value={formData.tone}
                            onChange={(e) => setFormData({...formData, tone: e.target.value})}
                            options={dynamicFields.toneOptions}
                            className="bg-[#242424] border-gray-700"
                        />
                    </div>
                    <div className="pt-4">
                        {PRO_TOOLS.includes(formData.tool) && !isVip ? (
                             <Button onClick={() => setShowPremiumModal(true)} fullWidth className="bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700 flex items-center justify-center gap-2"><Lock size={18} /> Ferramenta Bloqueada</Button>
                        ) : (
                            <Button onClick={handleGenerate} fullWidth disabled={!formData.niche} className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30"><span className="flex items-center justify-center gap-2 font-semibold"><Sparkles size={18} /> Gerar Conteúdo</span></Button>
                        )}
                    </div>
                </div>
            )}

            {/* LOADING SCREEN */}
            {appState === AppState.LOADING && (
                <div className="flex flex-col items-center justify-center flex-1 space-y-4 animate-pulse">
                    <div className="p-4 bg-blue-500/10 rounded-full"><Loader2 size={40} className="text-blue-500 animate-spin" /></div>
                    <p className="text-gray-400 text-sm">Criando seu roteiro viral...</p>
                </div>
            )}

            {/* HISTORY SCREEN */}
            {appState === AppState.HISTORY && (
                <div className="animate-slide-up pb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-blue-500"/> Histórico
                        </h2>
                        {history.length > 0 && (
                            <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                <Trash2 size={12} /> Limpar
                            </button>
                        )}
                    </div>

                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center opacity-50 space-y-4">
                            <Calendar size={48} className="text-gray-600"/>
                            <p className="text-gray-400">Nenhum histórico ainda.<br/>Gere seu primeiro roteiro!</p>
                            <Button variant="secondary" onClick={() => setAppState(AppState.FORM)} className="mt-4 text-sm py-2">Criar Agora</Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => handleHistoryItemClick(item)}
                                    className="bg-[#242424] border border-gray-800 hover:border-blue-500/50 p-4 rounded-xl cursor-pointer transition-all active:scale-98 group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                            {getToolLabel(item.request.tool)}
                                        </span>
                                        <span className="text-[10px] text-gray-500">{formatTime(item.timestamp)}</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
                                        {item.script.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                        {item.request.niche} • {item.request.tone}
                                    </p>
                                    <div className="mt-3 flex justify-end">
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-blue-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="mt-6">
                        <Button 
                            onClick={() => setAppState(AppState.FORM)} 
                            variant="secondary" 
                            fullWidth
                            className="bg-[#242424] border-gray-700 text-white"
                        >
                            Voltar para o Início
                        </Button>
                    </div>
                </div>
            )}

            {/* RESULT SCREEN */}
            {appState === AppState.RESULT && script && (
                <div className="animate-fade-in pb-10">
                    <div className="mb-4 flex items-center justify-between">
                         <h2 className="text-xl font-bold text-white">Resultado Gerado</h2>
                         <button onClick={() => { setAppState(AppState.FORM); setScript(null); }} className="text-sm text-blue-400 hover:underline">
                            Criar Novo
                         </button>
                    </div>
                    <ScriptCard script={script} />
                    
                    <div className="mt-6">
                        <Button 
                            onClick={() => {
                                // Se veio do histórico, volta para o histórico. Se não, volta pro form.
                                if (fromHistory) setAppState(AppState.HISTORY);
                                else { setAppState(AppState.FORM); setScript(null); }
                            }} 
                            variant="secondary" 
                            fullWidth
                            className="bg-[#242424] border-gray-700 text-white"
                        >
                            {fromHistory ? 'Voltar para Histórico' : 'Voltar'}
                        </Button>
                    </div>
                </div>
            )}

        </main>
    </div>
  );
};