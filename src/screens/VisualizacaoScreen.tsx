import React, { useState } from 'react';
import { EmailData, Screen, TransitionType } from '../types';
import { generateEmailHtml } from '../utils/htmlGenerator';
import { DEFAULT_TEMPLATES } from '../data/templates';

interface VisualizacaoScreenProps {
  emailData: EmailData;
  setEmailData: React.Dispatch<React.SetStateAction<EmailData>>;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
}

export const VisualizacaoScreen: React.FC<VisualizacaoScreenProps> = ({
  emailData,
  setEmailData,
  onNavigate,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [readingMode, setReadingMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(emailData.activeTemplateId || 'padrao');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExportHtml = () => {
    const htmlString = emailData.customCodeHtml || generateEmailHtml(emailData);
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-template-${emailData.activeTemplateId || 'custom'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMessage('✓ Arquivo HTML exportado e baixado com sucesso!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBoasVindasClick = () => {
    // Spec requirement: //button[contains(text(), 'BOAS-VINDAS')] -> Gerador Visual (push)
    const tmpl = DEFAULT_TEMPLATES.find((t) => t.id === 'boas-vindas');
    setEmailData((prev) => ({
      ...prev,
      headerTitle: tmpl?.headerTitle || 'Bem-vindo à nossa comunidade!',
      greeting: tmpl?.greeting || 'Que bom ter você conosco, {{nome}}!',
      buttonText: tmpl?.buttonText || 'Conhecer Meu Painel',
      buttonUrl: tmpl?.buttonUrl || 'https://exemplo.com/comecar',
      bodyText: tmpl?.bodyText || 'Seu cadastro associado à empresa {{empresa}} foi ativado...',
      footerText: tmpl?.footerText || 'Você está recebendo este e-mail...',
      primaryColor: tmpl?.primaryColor || '#10b981',
      activeTemplateId: 'boas-vindas',
      customCodeHtml: tmpl?.customCodeHtml,
    }));
    onNavigate('gerador', 'push');
  };

  const handleSelectTemplate = (id: string, name: string, title: string, color: string) => {
    setActiveTab(id);
    const tmpl = DEFAULT_TEMPLATES.find((t) => t.id === id);
    setEmailData((prev) => ({
      ...prev,
      activeTemplateId: id,
      headerTitle: tmpl?.headerTitle || title,
      greeting: tmpl?.greeting || prev.greeting,
      buttonText: tmpl?.buttonText || prev.buttonText,
      buttonUrl: tmpl?.buttonUrl || prev.buttonUrl,
      bodyText: tmpl?.bodyText || prev.bodyText,
      footerText: tmpl?.footerText || prev.footerText,
      primaryColor: tmpl?.primaryColor || color,
      customCodeHtml: tmpl?.customCodeHtml,
    }));
  };

  return (
    <div className={`flex-grow flex flex-col pt-16 pb-20 w-full min-h-[calc(100vh-64px)] transition-colors relative ${
      readingMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-emerald-600 text-white font-semibold px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Canvas Toolbar */}
      <div className={`flex flex-wrap justify-between sm:justify-end items-center px-4 md:px-6 py-2.5 gap-3 border-b backdrop-blur-md sticky top-16 z-30 ${
        readingMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-md p-1 border border-slate-200/80">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded flex items-center justify-center transition-all ${
              device === 'desktop'
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Visualização Desktop"
          >
            <span className="material-symbols-outlined text-[20px]">desktop_windows</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded flex items-center justify-center transition-all ${
              device === 'mobile'
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Visualização Smartphone"
          >
            <span className="material-symbols-outlined text-[20px]">smartphone</span>
          </button>
        </div>

        <button
          onClick={() => setReadingMode(!readingMode)}
          className={`flex items-center gap-1.5 border px-3.5 py-1.5 rounded-md font-semibold text-xs transition-colors ${
            readingMode
              ? 'bg-slate-700 border-slate-600 text-amber-400 hover:bg-slate-600'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>{readingMode ? 'MODO NORMAL' : 'MODO LEITURA'}</span>
        </button>

        <button
          onClick={handleExportHtml}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md font-bold text-xs transition-all shadow-xs active:scale-95"
          title="Exportar código HTML"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>EXPORTAR HTML</span>
        </button>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start custom-scroll my-4">
        <div
          className={`transition-device w-full bg-white rounded-xl shadow-xs border overflow-hidden min-h-[580px] flex flex-col ${
            device === 'mobile' ? 'max-w-[375px]' : 'max-w-[700px]'
          } ${readingMode ? 'border-slate-700 shadow-2xl' : 'border-slate-200'}`}
        >
          {emailData.customCodeHtml ? (
            <div dangerouslySetInnerHTML={{ __html: emailData.customCodeHtml }} />
          ) : (
            <>
              {/* Email Header Banner */}
              <div
                className="px-6 py-12 text-center transition-colors duration-300"
                style={{ backgroundColor: emailData.primaryColor || '#2563eb' }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
                  {emailData.headerTitle}
                </h2>
              </div>

              {/* Email Content Body */}
              <div className="p-6 md:p-10 flex flex-col items-center text-center">
                <div className="w-full max-w-lg">
                  <p className="text-lg font-bold text-slate-800 mb-4">
                    {emailData.greeting}
                  </p>
                  <div className="text-sm text-slate-600 mb-8 whitespace-pre-line leading-relaxed">
                    {emailData.bodyText}
                  </div>

                  <a
                    href={emailData.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-white font-semibold text-sm px-8 py-3 rounded-md shadow-xs hover:opacity-90 transition-all mb-8 no-underline"
                    style={{ backgroundColor: emailData.primaryColor || '#2563eb' }}
                  >
                    {emailData.buttonText}
                  </a>

                  <div className="w-full border-t border-slate-100 pt-6">
                    <p className="text-xs text-slate-400 italic">
                      Você está recebendo este e-mail pois está cadastrado em nossa base de usuários.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Footer */}
              <div className="mt-auto bg-slate-50 p-6 flex flex-col items-center border-t border-slate-200">
                <div className="flex gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">language</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-semibold">Estácio de Sá — Educação Digital</p>
                <p className="text-xs text-slate-400">Rua Bispo, 83 - Rio de Janeiro, RJ</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Template Selector (Bottom Bar) */}
      <div className={`border-t px-4 md:px-6 py-3 overflow-x-auto flex gap-3 items-center h-20 shrink-0 ${
        readingMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block mr-2">
          MODELOS:
        </span>

        {/* PADRÃO */}
        <button
          onClick={() => handleSelectTemplate('padrao', 'Padrão', 'Aviso Importante', '#2563eb')}
          className={`min-w-[140px] sm:min-w-[160px] h-11 rounded-md flex items-center justify-center px-4 relative transition-all font-semibold text-xs uppercase ${
            activeTab === 'padrao'
              ? 'bg-blue-50 border-2 border-blue-600 text-blue-700 shadow-xs'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          <span>PADRÃO</span>
          {activeTab === 'padrao' && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        {/* BOAS-VINDAS - triggers push navigation to Gerador Visual as required by spec */}
        <button
          onClick={handleBoasVindasClick}
          className={`min-w-[140px] sm:min-w-[160px] h-11 rounded-md flex items-center justify-center px-4 relative transition-all font-semibold text-xs uppercase ${
            activeTab === 'boas-vindas'
              ? 'bg-blue-50 border-2 border-blue-600 text-blue-700 shadow-xs'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          <span>BOAS-VINDAS</span>
          {activeTab === 'boas-vindas' && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        {/* NEWSLETTER */}
        <button
          onClick={() => handleSelectTemplate('newsletter', 'Newsletter', 'Boletim Informativo Estácio', '#0284c7')}
          className={`min-w-[140px] sm:min-w-[160px] h-11 rounded-md flex items-center justify-center px-4 relative transition-all font-semibold text-xs uppercase ${
            activeTab === 'newsletter'
              ? 'bg-blue-50 border-2 border-blue-600 text-blue-700 shadow-xs'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          <span>NEWSLETTER</span>
          {activeTab === 'newsletter' && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        {/* OFERTA */}
        <button
          onClick={() => handleSelectTemplate('oferta', 'Oferta / Cupom', 'GARANTA SUA VAGA AGORA!', '#f59e0b')}
          className={`min-w-[140px] sm:min-w-[160px] h-11 rounded-md flex items-center justify-center px-4 relative transition-all font-semibold text-xs uppercase ${
            activeTab === 'oferta'
              ? 'bg-blue-50 border-2 border-blue-600 text-blue-700 shadow-xs'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          <span>OFERTA</span>
          {activeTab === 'oferta' && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};
