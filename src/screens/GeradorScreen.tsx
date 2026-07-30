import React, { useState, useRef } from 'react';
import { EmailData, Screen, TransitionType } from '../types';
import { compileEmailToHtml } from '../utils/compiler';
import { parseHtmlToEmailData } from '../utils/htmlParser';

interface GeradorScreenProps {
  emailData: EmailData;
  setEmailData: React.Dispatch<React.SetStateAction<EmailData>>;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
}

const COLOR_PALETTE = [
  { name: 'Indigo', hex: '#4f46e5', bgClass: 'bg-indigo-600' },
  { name: 'Esmeralda', hex: '#10b981', bgClass: 'bg-emerald-500' },
  { name: 'Azul', hex: '#2563eb', bgClass: 'bg-blue-600' },
  { name: 'Rosa', hex: '#ec4899', bgClass: 'bg-pink-500' },
  { name: 'Laranja', hex: '#f97316', bgClass: 'bg-orange-500' },
  { name: 'Grafite', hex: '#334155', bgClass: 'bg-slate-700' },
  { name: 'Roxo', hex: '#9333ea', bgClass: 'bg-purple-600' },
];

export const GeradorScreen: React.FC<GeradorScreenProps> = ({
  emailData,
  setEmailData,
  onNavigate,
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm') && file.type !== 'text/html') {
      alert('Por favor, selecione um arquivo de texto com extensão .html ou .htm');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseHtmlToEmailData(content, emailData);
        setEmailData((prev) => ({
          ...prev,
          ...parsed,
          customCodeHtml: content,
        }));
        triggerToast(`Arquivo HTML "${file.name}" importado e carregado no Gerador Visual!`);
      }
    };
    reader.onerror = () => {
      alert('Ocorreu um erro ao ler o arquivo. Tente novamente.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Set default fallback values if empty
  const headerTitle = emailData.headerTitle ?? 'Parceria e Novidades';
  const greeting = emailData.greeting ?? 'Olá, {{nome}}!';
  const buttonText = emailData.buttonText ?? 'Agendar Demonstração';
  const buttonUrl = emailData.buttonUrl ?? 'https://exemplo.com/demonstracao';
  const bodyText =
    emailData.bodyText ??
    'Temos o prazer de apresentar uma oferta desenhada sob medida para as necessidades de negócios da empresa {{empresa}}.\n\nClique no botão abaixo para agendar uma demonstração gratuita e sem compromisso conosco nesta semana.';
  const footerText =
    emailData.footerText ??
    'Você está recebendo este e-mail como parte da nossa lista de contatos profissionais para {{email}}.\n© 2026 Minha Empresa S.A. Todos os direitos reservados.';
  
  const alignment = emailData.alignment ?? 'center';
  const mobileButtonWidth = emailData.mobileButtonWidth ?? 'full';
  const cardBorderRadius = emailData.cardBorderRadius ?? 'modern';
  const fontSizeLevel = emailData.fontSizeLevel ?? 'normal';
  const primaryColor = emailData.primaryColor ?? '#4f46e5';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCompileAndApply = () => {
    const compiledHtml = compileEmailToHtml({
      ...emailData,
      headerTitle,
      greeting,
      buttonText,
      buttonUrl,
      bodyText,
      footerText,
      primaryColor,
      alignment,
      mobileButtonWidth,
      cardBorderRadius,
      fontSizeLevel,
    });

    setEmailData((prev) => ({
      ...prev,
      headerTitle,
      greeting,
      buttonText,
      buttonUrl,
      bodyText,
      footerText,
      primaryColor,
      alignment,
      mobileButtonWidth,
      cardBorderRadius,
      fontSizeLevel,
      customCodeHtml: compiledHtml,
    }));

    triggerToast('✓ Código HTML e estilos inline compilados e aplicados no Editor!');

    // Smooth navigation to Editor after slight delay
    setTimeout(() => {
      onNavigate('editor', 'push');
    }, 600);
  };

  const handleCompileAndGoToVisualizacao = () => {
    const compiledHtml = compileEmailToHtml({
      ...emailData,
      headerTitle,
      greeting,
      buttonText,
      buttonUrl,
      bodyText,
      footerText,
      primaryColor,
      alignment,
      mobileButtonWidth,
      cardBorderRadius,
      fontSizeLevel,
    });

    setEmailData((prev) => ({
      ...prev,
      headerTitle,
      greeting,
      buttonText,
      buttonUrl,
      bodyText,
      footerText,
      primaryColor,
      alignment,
      mobileButtonWidth,
      cardBorderRadius,
      fontSizeLevel,
      customCodeHtml: compiledHtml,
    }));

    onNavigate('visualizacao', 'push');
  };

  return (
    <div className="flex-grow bg-slate-50/60 pt-20 pb-28 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Form Container Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-8">
        
        {/* Header Block */}
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1.5">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <h1 className="text-base md:text-lg font-bold tracking-wide uppercase text-slate-900">
                CONSTRUTOR ASSISTIDO DE LAYOUTS RESPONSIVOS
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-4xl">
              Preencha os campos abaixo de maneira visual. O assistente irá compilar o código HTML, cabeçalhos estruturados e folhas de estilo CSS inline perfeitas para os principais provedores (Gmail, Outlook).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Hidden HTML File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".html,.htm,text/html"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-300 transition-all active:scale-95 flex items-center gap-1.5 text-xs shadow-2xs"
              title="Importar um arquivo HTML para edição"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              <span>Importar HTML</span>
            </button>

            <button
              type="button"
              onClick={handleCompileAndGoToVisualizacao}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 text-xs"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>Ver Visualização</span>
            </button>
          </div>
        </div>

        {/* Section 1: Identity & Header */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Color Identity Selector */}
            <div className="lg:col-span-6 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                COR DE DESTAQUE / IDENTIDADE
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLOR_PALETTE.map((item) => {
                  const isSelected = primaryColor.toLowerCase() === item.hex.toLowerCase();
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() =>
                        setEmailData((prev) => ({ ...prev, primaryColor: item.hex, customCodeHtml: undefined }))
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-semibold shadow-xs ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${item.bgClass}`} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Header Title Input */}
            <div className="lg:col-span-6 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                TÍTULO DO CABEÇALHO
              </label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, headerTitle: e.target.value, customCodeHtml: undefined }))
                }
                placeholder="Parceria e Novidades"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Greeting & Button Text Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                SAUDAÇÃO INICIAL
              </label>
              <input
                type="text"
                value={greeting}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, greeting: e.target.value, customCodeHtml: undefined }))
                }
                placeholder="Olá, {{nome}}!"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                TEXTO DO BOTÃO DE AÇÃO
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) =>
                  setEmailData((prev) => ({ ...prev, buttonText: e.target.value, customCodeHtml: undefined }))
                }
                placeholder="Agendar Demonstração"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Button Destination URL */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              LINK DE DESTINO DO BOTÃO (URL)
            </label>
            <input
              type="text"
              value={buttonUrl}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, buttonUrl: e.target.value, customCodeHtml: undefined }))
              }
              placeholder="https://exemplo.com/demonstracao"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Email Body Text Area */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              MENSAGEM / CORPO DO E-MAIL
            </label>
            <textarea
              rows={4}
              value={bodyText}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, bodyText: e.target.value, customCodeHtml: undefined }))
              }
              placeholder="Temos o prazer de apresentar uma oferta desenhada sob medida..."
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-slate-400 font-normal leading-relaxed resize-y min-h-[100px]"
            />
          </div>

          {/* Footer Text Area */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              TEXTO DO RODAPÉ (TERMOS, REDES SOCIAIS OU UNSUBSCRIBE)
            </label>
            <textarea
              rows={2}
              value={footerText}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, footerText: e.target.value, customCodeHtml: undefined }))
              }
              placeholder="Você está recebendo este e-mail como parte da nossa lista de contatos profissionais para {{email}}..."
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-slate-400 leading-normal resize-y"
            />
          </div>
        </div>

        {/* Section 2: Advanced Layout & Responsive Options */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <span className="material-symbols-outlined text-xl">tune</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              OPÇÕES AVANÇADAS DE LAYOUT & DESIGN RESPONSIVO
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Alignment */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase block">
                ALINHAMENTO GERAL
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, alignment: 'center', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    alignment === 'center'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Centralizado
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, alignment: 'left', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    alignment === 'left'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  À Esquerda
                </button>
              </div>
            </div>

            {/* 2. Mobile Button */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase block">
                BOTÃO NO MOBILE
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, mobileButtonWidth: 'full', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    mobileButtonWidth === 'full'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Largura Cheia
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, mobileButtonWidth: 'auto', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    mobileButtonWidth === 'auto'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Adaptável
                </button>
              </div>
            </div>

            {/* 3. Card Corners */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase block">
                CANTOS DO CARTÃO
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, cardBorderRadius: 'none', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    cardBorderRadius === 'none'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Reto
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, cardBorderRadius: 'soft', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    cardBorderRadius === 'soft'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Suave
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, cardBorderRadius: 'modern', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    cardBorderRadius === 'modern'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Moderno
                </button>
              </div>
            </div>

            {/* 4. Font Size */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase block">
                TAMANHO DA FONTE (LEITURA)
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, fontSizeLevel: 'normal', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    fontSizeLevel === 'normal'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, fontSizeLevel: 'large_mobile', customCodeHtml: undefined }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    fontSizeLevel === 'large_mobile'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Amplo Mobile
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showPreview ? 'visibility_off' : 'visibility'}
            </span>
            <span>{showPreview ? 'Ocultar Pré-Visualização' : 'Exibir Pré-Visualização Ao Vivo'}</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCompileAndApply}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
              <span>COMPILAR E APLICAR NO EDITOR</span>
            </button>

            <button
              type="button"
              onClick={handleCompileAndGoToVisualizacao}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>IR PARA VISUALIZAÇÃO</span>
            </button>
          </div>
        </div>

      </div>

      {/* Collapsible Live Preview Section */}
      {showPreview && (
        <div className="mt-8 bg-slate-100 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-indigo-600 text-lg">devices</span>
              <span>Pré-Visualização em Tempo Real</span>
            </div>

            <div className="flex bg-white p-1 rounded-md border border-slate-200">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                  previewDevice === 'desktop'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                <span>Desktop (600px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center items-start py-4">
            <div
              className={`w-full bg-white shadow-sm border border-slate-200 overflow-hidden transition-all ${
                previewDevice === 'mobile' ? 'max-w-[375px]' : 'max-w-[600px]'
              }`}
              style={{
                borderRadius:
                  cardBorderRadius === 'none' ? '0px' : cardBorderRadius === 'modern' ? '16px' : '8px',
              }}
            >
              {/* Header */}
              <div
                className={`p-8 text-white ${alignment === 'left' ? 'text-left' : 'text-center'}`}
                style={{ backgroundColor: primaryColor }}
              >
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  {headerTitle}
                </h1>
              </div>

              {/* Body */}
              <div className={`p-8 space-y-6 ${alignment === 'left' ? 'text-left' : 'text-center'}`}>
                <p className="text-base font-bold text-slate-800">{greeting}</p>
                <div
                  className={`text-slate-600 whitespace-pre-line leading-relaxed ${
                    fontSizeLevel === 'large_mobile' ? 'text-base' : 'text-sm'
                  }`}
                >
                  {bodyText}
                </div>

                <div>
                  <a
                    href={buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block text-white font-semibold py-3 px-6 rounded-md shadow-xs no-underline transition-opacity hover:opacity-95 ${
                      mobileButtonWidth === 'full' && previewDevice === 'mobile'
                        ? 'w-full text-center'
                        : ''
                    }`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {buttonText}
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div
                className={`p-6 bg-slate-50 border-t border-slate-100 text-slate-500 text-xs whitespace-pre-line ${
                  alignment === 'left' ? 'text-left' : 'text-center'
                }`}
              >
                {footerText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
