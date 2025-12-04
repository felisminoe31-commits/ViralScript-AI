import React from 'react';
import { GeneratedScript } from '../types';
import { Copy, Video, Target, MessageCircle } from 'lucide-react';

interface ScriptCardProps {
  script: GeneratedScript;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ script }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: Add toast notification logic here
  };

  const fullScriptText = `
Título: ${script.title}
Hook: ${script.hook}
Corpo:
${script.body.map(b => `- ${b}`).join('\n')}
CTA: ${script.cta}
Visual: ${script.visualCues}
  `.trim();

  return (
    <div className="bg-tg-secondaryBg rounded-2xl p-6 shadow-xl border border-gray-800 animate-fade-in space-y-6">
      <div className="flex justify-between items-start border-b border-gray-700 pb-4">
        <div>
           <h3 className="text-xs font-bold text-tg-button uppercase tracking-wider mb-1">Roteiro Gerado</h3>
           <h2 className="text-xl font-bold text-white">{script.title}</h2>
        </div>
        <button 
            onClick={() => copyToClipboard(fullScriptText)}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            title="Copiar tudo"
        >
            <Copy size={18} className="text-white" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Hook */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2 text-yellow-400">
                <Target size={16} />
                <span className="text-xs font-bold uppercase">O Gancho (0-3s)</span>
            </div>
            <p className="text-lg font-medium leading-relaxed">"{script.hook}"</p>
        </div>

        {/* Body */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-2 mb-3 text-blue-400">
                <Video size={16} />
                <span className="text-xs font-bold uppercase">Conteúdo Principal</span>
            </div>
            <ul className="space-y-2">
                {script.body.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                        {point}
                    </li>
                ))}
            </ul>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-tg-button/20 to-transparent p-4 rounded-xl border border-tg-button/30">
            <div className="flex items-center gap-2 mb-1 text-tg-button">
                <MessageCircle size={16} />
                <span className="text-xs font-bold uppercase">Call to Action</span>
            </div>
            <p className="font-bold text-white">"{script.cta}"</p>
        </div>

         {/* Visual Cues */}
         <div className="text-xs text-tg-hint italic mt-4 pt-4 border-t border-gray-800">
            <span className="font-semibold not-italic">💡 Dica Visual:</span> {script.visualCues}
        </div>
      </div>
    </div>
  );
};