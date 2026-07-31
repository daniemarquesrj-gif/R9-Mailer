import React, { useState, useRef, useEffect } from 'react';
import { EmailData, Screen, TransitionType } from '../types';
import { parseHtmlToBlocks } from '../utils/htmlParser';
import { normalizeImage } from '../utils/imageNormalizer';

export type BlockType = 
  | 'header'
  | 'header_text'
  | 'title'
  | 'subtitle'
  | 'text'
  | 'button'
  | 'image'
  | 'coupon'
  | 'divider'
  | 'social'
  | 'footer';

export interface EmailBlock {
  id: string;
  type: BlockType;
  
  // Text content
  text?: string;
  
  // Font and typography formatting
  fontSizePx?: number;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
  bgColor?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikethrough?: boolean;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontFamily?: string;
  lineHeight?: string;

  // Header properties
  headerTitle?: string;
  headerSubtitle?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  headerSubtitleColor?: string;
  headerSubtitleSizePx?: number;

  // Button properties
  buttonLabel?: string;
  buttonUrl?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonWidth?: 'full' | 'auto';

  // Image properties
  imageUrl?: string;
  imageAlt?: string;
  imageLink?: string;
  imageCaption?: string;

  // Coupon properties
  couponCode?: string;
  couponDiscount?: string;
  couponBgColor?: string;
  couponBorderColor?: string;

  // Divider properties
  dividerStyle?: 'solid' | 'dashed' | 'dotted';
  dividerColor?: string;

  // Social properties
  instagramUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;

  // Footer properties
  footerText?: string;
  footerBgColor?: string;
  footerTextColor?: string;
}

interface GeradorProScreenProps {
  emailData: EmailData;
  setEmailData: React.Dispatch<React.SetStateAction<EmailData>>;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
}

const DEFAULT_BLOCKS: EmailBlock[] = [
  {
    id: 'block-1',
    type: 'header_text',
    headerTitle: 'ESTÁCIO\nSUA MATRÍCULA\nCOMEÇA AQUI!',
    headerSubtitle: 'Condições especiais para estudar na Estácio R9 – Taquara',
    headerBgColor: '#003bb3',
    headerTextColor: '#ffffff',
    headerSubtitleColor: '#ffffff',
    alignment: 'center',
    fontSizePx: 28,
    headerSubtitleSizePx: 16,
    isBold: true,
  },
  {
    id: 'block-2',
    type: 'title',
    text: 'Novidades Exclusivas para {{empresa}}',
    fontSizePx: 28,
    textColor: '#1e1b4b',
    alignment: 'left',
    isBold: true,
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  {
    id: 'block-3',
    type: 'subtitle',
    text: 'Olá {{nome}}, temos uma atualização especial para você!',
    fontSizePx: 18,
    textColor: '#475569',
    alignment: 'left',
    isItalic: false,
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  {
    id: 'block-4',
    type: 'text',
    text: 'Estamos muito felizes em apresentar as novas funcionalidades desenvolvidas sob medida para impulsionar os resultados de sua equipe.\n\nCom a nossa nova plataforma, você terá controle total sobre suas entregas, relatórios automatizados e integração simplificada em tempo real.',
    fontSizePx: 15,
    textColor: '#334155',
    alignment: 'left',
    lineHeight: '1.6',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  {
    id: 'block-5',
    type: 'button',
    buttonLabel: 'Conhecer Plataforma Agora',
    buttonUrl: 'https://exemplo.com/plataforma',
    buttonBgColor: '#4f46e5',
    buttonTextColor: '#ffffff',
    buttonWidth: 'full',
    alignment: 'center',
    fontSizePx: 16,
    isBold: true,
  },
  {
    id: 'block-6',
    type: 'divider',
    dividerStyle: 'solid',
    dividerColor: '#e2e8f0',
  },
  {
    id: 'block-7',
    type: 'coupon',
    couponCode: 'ESTACIO30OFF',
    couponDiscount: '30% DE DESCONTO NO PLANO ANUAL',
    couponBgColor: '#e0e7ff',
    couponBorderColor: '#6366f1',
    fontSizePx: 22,
    isBold: true,
  },
  {
    id: 'block-8',
    type: 'footer',
    footerText: 'Você está recebendo este e-mail enviado para {{email}}.\n© 2026 Estácio. Todos os direitos reservados.',
    footerBgColor: '#f8fafc',
    footerTextColor: '#64748b',
    fontSizePx: 12,
    alignment: 'center',
  },
];

// Helper to construct inline CSS string for text blocks
function buildTextStyle(block: EmailBlock, defaultSize: number, defaultColor: string, defaultAlign = 'left'): string {
  const sizeMap: Record<string, number> = { sm: 18, md: 22, lg: 26, xl: 30 };
  const size = block.fontSizePx || (block.fontSize ? sizeMap[block.fontSize] : defaultSize);
  const color = block.textColor || defaultColor;
  const align = block.alignment || defaultAlign;
  const bold = block.isBold ? 'font-weight: bold;' : 'font-weight: normal;';
  const italic = block.isItalic ? 'font-style: italic;' : 'font-style: normal;';
  
  const decos: string[] = [];
  if (block.isUnderline) decos.push('underline');
  if (block.isStrikethrough) decos.push('line-through');
  const decoStr = decos.length > 0 ? `text-decoration: ${decos.join(' ')};` : 'text-decoration: none;';

  const transform = block.textTransform && block.textTransform !== 'none' ? `text-transform: ${block.textTransform};` : '';
  const fontFam = block.fontFamily ? `font-family: ${block.fontFamily};` : 'font-family: Helvetica, Arial, sans-serif;';
  const lHeight = block.lineHeight ? `line-height: ${block.lineHeight};` : 'line-height: 1.5;';
  const bg = block.bgColor ? `background-color: ${block.bgColor};` : '';

  return `color: ${color}; font-size: ${size}px; text-align: ${align}; ${bold} ${italic} ${decoStr} ${transform} ${fontFam} ${lHeight} ${bg}`;
}

export function compileBlocksToHtml(blocks: EmailBlock[]): string {
  let htmlContent = '';

  blocks.forEach((block) => {
    switch (block.type) {
      case 'header_text':
      case 'header': {
        const bg = block.headerBgColor || '#003bb3';
        const rawTitle = block.headerTitle || 'ESTÁCIO\nSUA MATRÍCULA\nCOMEÇA AQUI!';
        const formattedTitle = rawTitle.replace(/\n/g, '<br/>');
        const rawSubtitle = block.headerSubtitle;
        const formattedSubtitle = rawSubtitle ? rawSubtitle.replace(/\n/g, '<br/>') : '';

        const style = buildTextStyle(
          { ...block, textColor: block.headerTextColor || '#ffffff' },
          block.fontSizePx || 28,
          '#ffffff',
          block.alignment || 'center'
        );

        const subColor = block.headerSubtitleColor || '#ffffff';
        const subSize = block.headerSubtitleSizePx || 16;
        const align = block.alignment || 'center';

        htmlContent += `
    <div style="background-color: ${bg}; padding: 36px 24px; text-align: ${align}; font-family: Helvetica, Arial, sans-serif;">
      <h1 style="margin: 0; ${style}; line-height: 1.25; letter-spacing: 0.5px;">${formattedTitle}</h1>
      ${formattedSubtitle ? `<p style="margin: 16px 0 0 0; color: ${subColor}; font-size: ${subSize}px; font-weight: 500; text-align: ${align}; line-height: 1.4;">${formattedSubtitle}</p>` : ''}
    </div>`;
        break;
      }

      case 'title': {
        const align = block.alignment || 'left';
        const txt = block.text || 'Título do Bloco';
        const style = buildTextStyle(block, 28, '#1e1b4b', align);

        htmlContent += `
    <div style="padding: 24px 28px 8px 28px; text-align: ${align};">
      <h2 style="margin: 0; ${style}">${txt}</h2>
    </div>`;
        break;
      }

      case 'subtitle': {
        const align = block.alignment || 'left';
        const txt = block.text || 'Subtítulo complementar';
        const style = buildTextStyle(block, 18, '#475569', align);

        htmlContent += `
    <div style="padding: 4px 28px 12px 28px; text-align: ${align};">
      <p style="margin: 0; ${style}">${txt}</p>
    </div>`;
        break;
      }

      case 'text': {
        const align = block.alignment || 'left';
        const rawTxt = block.text || 'Insira aqui o texto do seu parágrafo...';
        const formattedTxt = rawTxt.replace(/\n/g, '<br/>');
        const style = buildTextStyle(block, 15, '#334155', align);

        htmlContent += `
    <div style="padding: 12px 28px; text-align: ${align};">
      <div style="${style}">${formattedTxt}</div>
    </div>`;
        break;
      }

      case 'button': {
        const align = block.alignment || 'center';
        const bg = block.buttonBgColor || '#4f46e5';
        const color = block.buttonTextColor || '#ffffff';
        const label = block.buttonLabel || 'Clique Aqui';
        const url = block.buttonUrl || '#';
        const isFull = block.buttonWidth === 'full';
        const fontFam = block.fontFamily || 'Helvetica, Arial, sans-serif';
        const size = block.fontSizePx || 15;
        const bold = block.isBold !== false ? 'font-weight: bold;' : 'font-weight: normal;';
        const italic = block.isItalic ? 'font-style: italic;' : '';
        const transform = block.textTransform ? `text-transform: ${block.textTransform};` : '';

        const btnStyle = isFull
          ? `display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: ${bg}; color: ${color} !important; padding: 14px 20px; text-decoration: none; ${bold} ${italic} ${transform} border-radius: 8px; font-size: ${size}px; font-family: ${fontFam};`
          : `display: inline-block; background-color: ${bg}; color: ${color} !important; padding: 12px 28px; text-decoration: none; ${bold} ${italic} ${transform} border-radius: 8px; font-size: ${size}px; font-family: ${fontFam};`;

        htmlContent += `
    <div style="padding: 20px 28px; text-align: ${align};">
      <a href="${url}" class="btn" style="${btnStyle}">${label}</a>
    </div>`;
        break;
      }

      case 'image': {
        const imgUrl = block.imageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80';
        const alt = block.imageAlt || 'Banner Promocional';
        const link = block.imageLink;
        const caption = block.imageCaption;

        let imgHtml = `<img src="${imgUrl}" alt="${alt}" width="100%" style="width: 100% !important; max-width: 100% !important; height: auto !important; display: block; border: 0; outline: none; margin: 0 auto; border-radius: 6px; object-fit: contain;" />`;
        if (link) {
          imgHtml = `<a href="${link}" target="_blank" style="text-decoration: none; display: block; width: 100%;">${imgHtml}</a>`;
        }

        htmlContent += `
    <div class="img-container" style="padding: 16px 28px; text-align: center; font-family: Helvetica, Arial, sans-serif; box-sizing: border-box; width: 100%;">
      ${imgHtml}
      ${caption ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b; font-style: italic;">${caption}</p>` : ''}
    </div>`;
        break;
      }

      case 'coupon': {
        const code = block.couponCode || 'DESCONTO20';
        const discount = block.couponDiscount || '20% OFF NA PRIMEIRA COMPRA';
        const bg = block.couponBgColor || '#f0fdf4';
        const border = block.couponBorderColor || '#16a34a';

        htmlContent += `
    <div style="padding: 20px 28px; font-family: Helvetica, Arial, sans-serif;">
      <div style="background-color: ${bg}; border: 2px dashed ${border}; border-radius: 10px; padding: 20px; text-align: center;">
        <span style="display: block; font-size: 12px; font-weight: bold; color: ${border}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">${discount}</span>
        <div style="font-family: monospace; font-size: 22px; font-weight: bold; color: #0f172a; letter-spacing: 2px; padding: 6px 0;">
          ${code}
        </div>
      </div>
    </div>`;
        break;
      }

      case 'divider': {
        const style = block.dividerStyle || 'solid';
        const color = block.dividerColor || '#e2e8f0';

        htmlContent += `
    <div style="padding: 16px 28px;">
      <hr style="border: none; border-top: 1px ${style} ${color}; margin: 0;" />
    </div>`;
        break;
      }

      case 'social': {
        const insta = block.instagramUrl;
        const linkedin = block.linkedinUrl;
        const fb = block.facebookUrl;
        const web = block.websiteUrl;

        htmlContent += `
    <div class="social-block" style="padding: 16px 28px; text-align: center; font-family: Helvetica, Arial, sans-serif;">
      <div style="display: inline-flex; gap: 16px; align-items: center; font-size: 13px; font-weight: bold;">
        ${insta ? `<a href="${insta}" style="color: #4f46e5; text-decoration: none;">Instagram</a>` : ''}
        ${linkedin ? `<a href="${linkedin}" style="color: #4f46e5; text-decoration: none;">LinkedIn</a>` : ''}
        ${fb ? `<a href="${fb}" style="color: #4f46e5; text-decoration: none;">Facebook</a>` : ''}
        ${web ? `<a href="${web}" style="color: #4f46e5; text-decoration: none;">Website</a>` : ''}
      </div>
    </div>`;
        break;
      }

      case 'footer': {
        const bg = block.footerBgColor || '#f8fafc';
        const rawTxt = block.footerText || '© 2026 Minha Empresa. Todos os direitos reservados.';
        const formatted = rawTxt.replace(/\n/g, '<br/>');
        const style = buildTextStyle(
          { ...block, textColor: block.footerTextColor || '#64748b' },
          12,
          '#64748b',
          'center'
        );

        htmlContent += `
    <div style="background-color: ${bg}; padding: 20px 24px; border-top: 1px solid #f1f5f9;">
      <div style="${style}">${formatted}</div>
    </div>`;
        break;
      }
    }
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 20px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    .card { background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    a { color: #4f46e5; }
    img { max-width: 100% !important; height: auto !important; display: block; border: 0; outline: none; }
    .card img { width: 100% !important; max-width: 100% !important; height: auto !important; object-fit: contain; }
    .img-container { width: 100% !important; box-sizing: border-box !important; }
    @media only screen and (max-width: 600px) {
      body { padding: 8px !important; }
      .card { border-radius: 0 !important; border: none !important; width: 100% !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; padding: 14px 16px !important; box-sizing: border-box !important; font-size: 16px !important; }
      .img-container { padding: 12px 12px !important; }
      .img-container img { width: 100% !important; max-width: 100% !important; height: auto !important; }
    }
  </style>
</head>
<body>
  <div class="card">
    ${htmlContent}
  </div>
</body>
</html>`;
}

export const GeradorProScreen: React.FC<GeradorProScreenProps> = ({
  emailData,
  setEmailData,
  onNavigate,
}) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>(() => {
    if (emailData.customCodeHtml) {
      const parsed = parseHtmlToBlocks(emailData.customCodeHtml);
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    }
    return DEFAULT_BLOCKS;
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string>(() => blocks[0]?.id || 'block-1');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNormalizing, setIsNormalizing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const lastParsedHtmlRef = useRef<string | undefined>(emailData.customCodeHtml);

  // Continuously sync compiled HTML from Gerador Visual blocks to global emailData.customCodeHtml
  useEffect(() => {
    const compiled = compileBlocksToHtml(blocks);
    lastParsedHtmlRef.current = compiled;
    setEmailData((prev) => {
      if (prev.customCodeHtml === compiled) return prev;
      return {
        ...prev,
        customCodeHtml: compiled,
      };
    });
  }, [blocks, setEmailData]);

  // Sync blocks ONLY if emailData.customCodeHtml changes externally (e.g. from template load or external file import)
  useEffect(() => {
    if (emailData.customCodeHtml && emailData.customCodeHtml !== lastParsedHtmlRef.current) {
      lastParsedHtmlRef.current = emailData.customCodeHtml;
      const parsed = parseHtmlToBlocks(emailData.customCodeHtml);
      if (parsed && parsed.length > 0) {
        setBlocks(parsed);
        setSelectedBlockId(parsed[0].id);
      }
    }
  }, [emailData.customCodeHtml]);

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
        setEmailData((prev) => ({
          ...prev,
          customCodeHtml: content,
        }));
        
        const parsedBlocks = parseHtmlToBlocks(content);
        if (parsedBlocks.length > 0) {
          setBlocks(parsedBlocks);
          setSelectedBlockId(parsedBlocks[0].id);
          showToast(`Arquivo HTML "${file.name}" importado e convertido em ${parsedBlocks.length} blocos editáveis no Gerador Visual!`);
        } else {
          showToast(`Arquivo HTML "${file.name}" importado no Gerador Visual!`);
        }
      }
    };
    reader.onerror = () => {
      alert('Ocorreu um erro ao ler o arquivo. Tente novamente.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImageBlockUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setIsNormalizing(true);
    showToast('Normalizando e ajustando imagem para celular e computador...');
    try {
      const normalizedDataUrl = await normalizeImage(file, 1200);
      updateSelectedBlock({ imageUrl: normalizedDataUrl });
      showToast(`✨ Imagem "${file.name}" normalizada e pronta para celular e PC!`);
    } catch (err) {
      console.error('Erro na normalização de imagem:', err);
      // Fallback to standard reader
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          updateSelectedBlock({ imageUrl: dataUrl });
          showToast(`Imagem "${file.name}" enviada com sucesso!`);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsNormalizing(false);
      e.target.value = '';
    }
  };

  const handleNormalizeExistingImage = async () => {
    const selected = blocks.find((b) => b.id === selectedBlockId);
    if (!selected || !selected.imageUrl) {
      showToast('Insira ou envie uma imagem primeiro para normalizar.');
      return;
    }

    setIsNormalizing(true);
    showToast('Ajustando dimensões e proporções para celular e computador...');

    try {
      const normalized = await normalizeImage(selected.imageUrl, 1200);
      updateSelectedBlock({ imageUrl: normalized });
      showToast('✨ Imagem normalizada! Agora ela se ajusta perfeitamente em telas de celular e PC.');
    } catch (err) {
      showToast('Não foi possível ajustar a imagem. Verifique se a URL é acessível.');
    } finally {
      setIsNormalizing(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || blocks[0];

  // Block management handlers
  const handleAddBlock = (type: BlockType) => {
    const newId = `block-${Date.now()}`;
    let newBlock: EmailBlock = { id: newId, type };

    switch (type) {
      case 'header_text':
        newBlock = {
          ...newBlock,
          headerTitle: 'ESTÁCIO\nSUA MATRÍCULA\nCOMEÇA AQUI!',
          headerSubtitle: 'Condições especiais para estudar na Estácio R9 – Taquara',
          headerBgColor: '#003bb3',
          headerTextColor: '#ffffff',
          headerSubtitleColor: '#ffffff',
          fontSizePx: 28,
          headerSubtitleSizePx: 16,
          alignment: 'center',
          isBold: true,
        };
        break;
      case 'header':
        newBlock = {
          ...newBlock,
          headerTitle: 'Novo Cabeçalho',
          headerSubtitle: 'Subtítulo do cabeçalho',
          headerBgColor: '#003bb3',
          headerTextColor: '#ffffff',
          headerSubtitleColor: '#ffffff',
          alignment: 'center',
          fontSizePx: 24,
          headerSubtitleSizePx: 15,
          isBold: true,
        };
        break;
      case 'title':
        newBlock = {
          ...newBlock,
          text: 'Novo Título Principal',
          fontSizePx: 26,
          textColor: '#1e1b4b',
          alignment: 'left',
          isBold: true,
        };
        break;
      case 'subtitle':
        newBlock = {
          ...newBlock,
          text: 'Insira aqui seu subtítulo curto',
          fontSizePx: 18,
          textColor: '#475569',
          alignment: 'left',
        };
        break;
      case 'text':
        newBlock = {
          ...newBlock,
          text: 'Novo parágrafo editável. Adicione variáveis como {{nome}} ou {{empresa}} se desejar.',
          fontSizePx: 15,
          textColor: '#334155',
          alignment: 'left',
          lineHeight: '1.6',
        };
        break;
      case 'button':
        newBlock = {
          ...newBlock,
          buttonLabel: 'Clique Aqui Agora',
          buttonUrl: 'https://exemplo.com',
          buttonBgColor: '#4f46e5',
          buttonTextColor: '#ffffff',
          buttonWidth: 'auto',
          alignment: 'center',
          fontSizePx: 16,
          isBold: true,
        };
        break;
      case 'image':
        newBlock = {
          ...newBlock,
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
          imageAlt: 'Imagem Ilustrativa',
          imageCaption: 'Legenda opcional da imagem',
        };
        break;
      case 'coupon':
        newBlock = {
          ...newBlock,
          couponCode: 'CUPOMPRO2026',
          couponDiscount: 'OFERTA ESPECIAL 25% OFF',
          couponBgColor: '#f0fdf4',
          couponBorderColor: '#16a34a',
        };
        break;
      case 'divider':
        newBlock = {
          ...newBlock,
          dividerStyle: 'solid',
          dividerColor: '#e2e8f0',
        };
        break;
      case 'social':
        newBlock = {
          ...newBlock,
          instagramUrl: 'https://instagram.com',
          linkedinUrl: 'https://linkedin.com',
          websiteUrl: 'https://estacio.br',
        };
        break;
      case 'footer':
        newBlock = {
          ...newBlock,
          footerText: 'Enviado para {{email}} por Estácio S.A.\n© 2026 Todos os direitos reservados.',
          footerBgColor: '#f8fafc',
          footerTextColor: '#64748b',
          fontSizePx: 12,
          alignment: 'center',
        };
        break;
    }

    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newId);
    showToast(`Bloco [${type.toUpperCase()}] adicionado com sucesso!`);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index - 1];
    newBlocks[index - 1] = newBlocks[index];
    newBlocks[index] = temp;
    setBlocks(newBlocks);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index + 1];
    newBlocks[index + 1] = newBlocks[index];
    newBlocks[index] = temp;
    setBlocks(newBlocks);
  };

  const handleDuplicate = (block: EmailBlock) => {
    const dupId = `block-${Date.now()}`;
    const dupBlock = { ...block, id: dupId };
    const index = blocks.findIndex((b) => b.id === block.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, dupBlock);
    setBlocks(newBlocks);
    setSelectedBlockId(dupId);
    showToast('Bloco duplicado!');
  };

  const handleDelete = (id: string) => {
    if (blocks.length <= 1) {
      showToast('O e-mail deve ter pelo menos 1 bloco.');
      return;
    }
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    if (selectedBlockId === id) {
      setSelectedBlockId(newBlocks[0].id);
    }
    showToast('Bloco removido.');
  };

  const updateSelectedBlock = (updatedProps: Partial<EmailBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === selectedBlockId ? { ...b, ...updatedProps } : b))
    );
  };

  const handleApplyToEditor = () => {
    const compiledHtml = compileBlocksToHtml(blocks);
    setEmailData((prev) => ({
      ...prev,
      customCodeHtml: compiledHtml,
    }));
    onNavigate('editor', 'push');
  };

  const handleGoToVisualizacao = () => {
    const compiledHtml = compileBlocksToHtml(blocks);
    setEmailData((prev) => ({
      ...prev,
      customCodeHtml: compiledHtml,
    }));
    onNavigate('visualizacao', 'push');
  };

  const compiledHtml = compileBlocksToHtml(blocks);

  const getBlockLabel = (type: BlockType) => {
    const labels: Record<BlockType, { name: string; icon: string }> = {
      header_text: { name: 'Texto do Cabeçalho / Banner', icon: 'web_asset' },
      header: { name: 'Cabeçalho', icon: 'web_asset' },
      title: { name: 'Título', icon: 'title' },
      subtitle: { name: 'Subtítulo', icon: 'format_size' },
      text: { name: 'Texto', icon: 'notes' },
      button: { name: 'Botão / CTA', icon: 'smart_button' },
      image: { name: 'Imagem / Banner', icon: 'image' },
      coupon: { name: 'Cupom', icon: 'local_offer' },
      divider: { name: 'Divisor', icon: 'horizontal_rule' },
      social: { name: 'Redes Sociais', icon: 'share' },
      footer: { name: 'Rodapé', icon: 'call_to_action' },
    };
    return labels[type] || { name: type, icon: 'extension' };
  };

  const insertVariableToSelectedBlock = (varName: string) => {
    if (!selectedBlock) return;
    if (selectedBlock.type === 'text' || selectedBlock.type === 'title' || selectedBlock.type === 'subtitle') {
      const current = selectedBlock.text || '';
      updateSelectedBlock({ text: current + ` ${varName} ` });
    } else if (selectedBlock.type === 'header' || selectedBlock.type === 'header_text') {
      const current = selectedBlock.headerTitle || '';
      updateSelectedBlock({ headerTitle: current + ` ${varName} ` });
    } else if (selectedBlock.type === 'footer') {
      const current = selectedBlock.footerText || '';
      updateSelectedBlock({ footerText: current + ` ${varName} ` });
    } else if (selectedBlock.type === 'button') {
      const current = selectedBlock.buttonLabel || '';
      updateSelectedBlock({ buttonLabel: current + ` ${varName} ` });
    }
  };

  // Reusable Formatting Controls Component
  const renderFormattingToolbar = (options: {
    showTextColor?: boolean;
    showBgColor?: boolean;
    showAlign?: boolean;
    showFontFamily?: boolean;
    showLineHeight?: boolean;
    defaultColorKey?: 'textColor' | 'headerTextColor' | 'buttonTextColor' | 'footerTextColor';
    defaultBgKey?: 'bgColor' | 'headerBgColor' | 'buttonBgColor' | 'footerBgColor';
  } = {}) => {
    if (!selectedBlock) return null;

    const {
      showTextColor = true,
      showBgColor = true,
      showAlign = true,
      showFontFamily = true,
      showLineHeight = true,
      defaultColorKey = 'textColor',
      defaultBgKey = 'bgColor',
    } = options;

    const currentTextColor = (selectedBlock as any)[defaultColorKey] || selectedBlock.textColor || '#334155';
    const currentBgColor = (selectedBlock as any)[defaultBgKey] || selectedBlock.bgColor || '#ffffff';
    const currentFontSize = selectedBlock.fontSizePx || 16;
    const currentAlign = selectedBlock.alignment || 'left';

    const COLOR_PRESETS = [
      '#1e1b4b', '#0f172a', '#334155', '#64748b',
      '#4f46e5', '#2563eb', '#0284c7', '#16a34a',
      '#dc2626', '#d97706', '#7c3aed', '#ffffff',
    ];

    return (
      <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-indigo-600">format_paint</span>
            <span>Estilização de Texto & Tipografia</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Tamanho, cor e forma</span>
        </div>

        {/* Row 1: Size, Family, Bold, Italic, Underline, Strikethrough, Transform */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Font Size Input & Presets */}
          <div className="lg:col-span-4 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">
              Tamanho da Fonte: <span className="text-indigo-600 font-extrabold">{currentFontSize}px</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="48"
                value={currentFontSize}
                onChange={(e) => updateSelectedBlock({ fontSizePx: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <input
                type="number"
                min="10"
                max="72"
                value={currentFontSize}
                onChange={(e) => updateSelectedBlock({ fontSizePx: parseInt(e.target.value, 10) || 16 })}
                className="w-16 text-xs p-1.5 border border-slate-300 rounded-md font-mono text-center"
              />
            </div>
            {/* Quick Size Pills */}
            <div className="flex gap-1 pt-1">
              {[12, 14, 16, 18, 22, 28, 36].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => updateSelectedBlock({ fontSizePx: sz })}
                  className={`px-1.5 py-0.5 text-[10px] rounded font-semibold transition-all ${
                    currentFontSize === sz ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Text Style Toggle Buttons (Bold, Italic, Underline, Strikethrough) */}
          <div className="lg:col-span-4 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">Forma / Estilo do Texto:</label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
              <button
                type="button"
                onClick={() => updateSelectedBlock({ isBold: !selectedBlock.isBold })}
                className={`w-8 h-8 rounded font-black text-sm flex items-center justify-center transition-all ${
                  selectedBlock.isBold ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
                title="Negrito (Bold)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => updateSelectedBlock({ isItalic: !selectedBlock.isItalic })}
                className={`w-8 h-8 rounded italic font-serif text-sm flex items-center justify-center transition-all ${
                  selectedBlock.isItalic ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
                title="Itálico (Italic)"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => updateSelectedBlock({ isUnderline: !selectedBlock.isUnderline })}
                className={`w-8 h-8 rounded underline font-bold text-sm flex items-center justify-center transition-all ${
                  selectedBlock.isUnderline ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
                title="Sublinhado (Underline)"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => updateSelectedBlock({ isStrikethrough: !selectedBlock.isStrikethrough })}
                className={`w-8 h-8 rounded line-through font-bold text-sm flex items-center justify-center transition-all ${
                  selectedBlock.isStrikethrough ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-200'
                }`}
                title="Riscado / Tachado"
              >
                S
              </button>
            </div>
          </div>

          {/* Text Transform / Capitalization */}
          <div className="lg:col-span-4 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600">Caixa de Texto:</label>
            <select
              value={selectedBlock.textTransform || 'none'}
              onChange={(e) => updateSelectedBlock({ textTransform: e.target.value as any })}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white font-medium"
            >
              <option value="none">Normal (Sem alteração)</option>
              <option value="uppercase">MAIÚSCULAS (UPPERCASE)</option>
              <option value="lowercase">minúsculas (lowercase)</option>
              <option value="capitalize">Primeira Letra Maiúscula</option>
            </select>
          </div>
        </div>

        {/* Row 2: Alignment, Font Family, Line Height */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          
          {/* Alignment */}
          {showAlign && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600">Alinhamento:</label>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => updateSelectedBlock({ alignment: 'left' })}
                  className={`flex-1 py-1 rounded flex items-center justify-center transition-all ${
                    currentAlign === 'left' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Esquerda"
                >
                  <span className="material-symbols-outlined text-[18px]">format_align_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedBlock({ alignment: 'center' })}
                  className={`flex-1 py-1 rounded flex items-center justify-center transition-all ${
                    currentAlign === 'center' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Centralizado"
                >
                  <span className="material-symbols-outlined text-[18px]">format_align_center</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedBlock({ alignment: 'right' })}
                  className={`flex-1 py-1 rounded flex items-center justify-center transition-all ${
                    currentAlign === 'right' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Direita"
                >
                  <span className="material-symbols-outlined text-[18px]">format_align_right</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedBlock({ alignment: 'justify' })}
                  className={`flex-1 py-1 rounded flex items-center justify-center transition-all ${
                    currentAlign === 'justify' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Justificado"
                >
                  <span className="material-symbols-outlined text-[18px]">format_align_justify</span>
                </button>
              </div>
            </div>
          )}

          {/* Font Family */}
          {showFontFamily && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600">Família da Fonte:</label>
              <select
                value={selectedBlock.fontFamily || 'Helvetica, Arial, sans-serif'}
                onChange={(e) => updateSelectedBlock({ fontFamily: e.target.value })}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Helvetica, Arial, sans-serif">Helvetica / Arial (Padrão e-mail)</option>
                <option value="Georgia, serif">Georgia (Serifada Elegante)</option>
                <option value="'Times New Roman', Times, serif">Times New Roman (Clássica)</option>
                <option value="'Courier New', Courier, monospace">Courier New (Monospaçada)</option>
                <option value="Verdana, Geneva, sans-serif">Verdana (Leitura limpa)</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet MS (Moderna)</option>
              </select>
            </div>
          )}

          {/* Line Height */}
          {showLineHeight && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600">Altura de Linha (Espaçamento):</label>
              <select
                value={selectedBlock.lineHeight || '1.5'}
                onChange={(e) => updateSelectedBlock({ lineHeight: e.target.value })}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="1.2">Compacto (1.2)</option>
                <option value="1.4">Normal (1.4)</option>
                <option value="1.6">Confortável (1.6 - Recomendado)</option>
                <option value="1.8">Espaçado (1.8)</option>
                <option value="2.0">Duplo (2.0)</option>
              </select>
            </div>
          )}
        </div>

        {/* Row 3: Colors (Text Color & Background Color) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {showTextColor && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-700">Cor do Texto:</label>
                <span className="text-[11px] font-mono text-slate-500 uppercase">{currentTextColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTextColor}
                  onChange={(e) => updateSelectedBlock({ [defaultColorKey]: e.target.value } as any)}
                  className="w-10 h-8 p-0.5 border border-slate-300 rounded cursor-pointer bg-white"
                />
                <div className="flex flex-wrap gap-1">
                  {COLOR_PRESETS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => updateSelectedBlock({ [defaultColorKey]: hex } as any)}
                      className="w-5 h-5 rounded-full border border-slate-300 transition-transform hover:scale-110 shadow-2xs"
                      style={{ backgroundColor: hex }}
                      title={`Cor: ${hex}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {showBgColor && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-700">Cor de Fundo do Bloco:</label>
                <span className="text-[11px] font-mono text-slate-500 uppercase">{currentBgColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentBgColor}
                  onChange={(e) => updateSelectedBlock({ [defaultBgKey]: e.target.value } as any)}
                  className="w-10 h-8 p-0.5 border border-slate-300 rounded cursor-pointer bg-white"
                />
                <div className="flex flex-wrap gap-1">
                  {['#ffffff', '#f8fafc', '#f1f5f9', '#e0e7ff', '#f0fdf4', '#fef2f2', '#fffbeb', '#1e1b4b'].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => updateSelectedBlock({ [defaultBgKey]: hex } as any)}
                      className="w-5 h-5 rounded-full border border-slate-300 transition-transform hover:scale-110 shadow-2xs"
                      style={{ backgroundColor: hex }}
                      title={`Fundo: ${hex}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow bg-slate-50/60 pt-20 pb-28 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-indigo-600 text-white font-semibold px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-8">
        
        {/* Header Block */}
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1.5">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                extension
              </span>
              <h1 className="text-base md:text-lg font-bold tracking-wide uppercase text-slate-900 flex items-center gap-2">
                <span>GERADOR VISUAL — CONSTRUTOR POR BLOCOS</span>
                <span className="text-[11px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full">
                  MODULAR & FORMATADO
                </span>
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-4xl">
              Monte seu e-mail personalizando textos, tamanhos de fontes, cores, estilos (negrito, itálico, sublinhado) e muito mais.
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
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-300 transition-all active:scale-95 flex items-center gap-1.5 text-xs shadow-2xs"
              title="Importar um arquivo HTML para edição no Editor"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Importar HTML</span>
            </button>

            <button
              type="button"
              onClick={() => setBlocks(DEFAULT_BLOCKS)}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-lg text-xs transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Resetar</span>
            </button>
            <button
              type="button"
              onClick={handleGoToVisualizacao}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-all active:scale-95 flex items-center gap-1.5 text-xs"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>Ver Visualização</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            PARTE 1: ESTRUTURA DOS BLOCOS (Adição e Reordenação)
        ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-2">
              <span className="bg-indigo-600 text-white w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold">1</span>
              <span>Parte de Estrutura (Adicionar & Reordenar Blocos)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">{blocks.length} blocos adicionados</span>
          </div>

          {/* Quick Add Block Bar */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2.5">Adicionar novo bloco ao layout:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAddBlock('header_text')}
                className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-extrabold text-indigo-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">web_asset</span>
                <span>+ Texto do Cabeçalho</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('header')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">web_asset</span>
                <span>+ Cabeçalho Simples</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('title')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">title</span>
                <span>+ Título</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('subtitle')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">format_size</span>
                <span>+ Subtítulo</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('text')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">notes</span>
                <span>+ Texto</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('button')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">smart_button</span>
                <span>+ Botão CTA</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('image')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">image</span>
                <span>+ Banner / Imagem</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('coupon')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">local_offer</span>
                <span>+ Cupom</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('divider')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">horizontal_rule</span>
                <span>+ Divisor</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('social')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>+ Redes Sociais</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock('footer')}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">call_to_action</span>
                <span>+ Rodapé</span>
              </button>
            </div>
          </div>

          {/* Active Structure Blocks List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {blocks.map((block, idx) => {
              const isSelected = block.id === selectedBlockId;
              const { name, icon } = getBlockLabel(block.type);

              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-xs font-bold text-slate-400 shrink-0 w-5">#{idx + 1}</span>
                    <span className="material-symbols-outlined text-indigo-600 shrink-0">{icon}</span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{name}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {block.headerTitle || block.text || block.buttonLabel || block.couponCode || 'Bloco configurável'}
                      </p>
                    </div>
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === blocks.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(block)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200"
                      title="Duplicar bloco"
                    >
                      <span className="material-symbols-outlined text-[15px]">content_copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(block.id)}
                      className="w-6 h-6 rounded flex items-center justify-center text-red-500 hover:bg-red-50"
                      title="Excluir bloco"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            PARTE 2: CONFIGURAÇÃO / EDIÇÃO DO BLOCO SELECIONADO
        ========================================================================= */}
        {selectedBlock && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Editando Bloco: {getBlockLabel(selectedBlock.type).name}</span>
              </h2>

              {/* Variable Injection Chips */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Inserir Variável:</span>
                <button
                  type="button"
                  onClick={() => insertVariableToSelectedBlock('{{nome}}')}
                  className="px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 text-[11px] font-mono rounded hover:bg-indigo-50"
                >
                  &#123;&#123;nome&#125;&#125;
                </button>
                <button
                  type="button"
                  onClick={() => insertVariableToSelectedBlock('{{empresa}}')}
                  className="px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 text-[11px] font-mono rounded hover:bg-indigo-50"
                >
                  &#123;&#123;empresa&#125;&#125;
                </button>
                <button
                  type="button"
                  onClick={() => insertVariableToSelectedBlock('{{email}}')}
                  className="px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 text-[11px] font-mono rounded hover:bg-indigo-50"
                >
                  &#123;&#123;email&#125;&#125;
                </button>
              </div>
            </div>

            {/* HEADER / HEADER_TEXT FORM */}
            {(selectedBlock.type === 'header' || selectedBlock.type === 'header_text') && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título Principal do Cabeçalho (Suporta quebra de linha com Enter)
                    </label>
                    <textarea
                      rows={3}
                      value={selectedBlock.headerTitle || ''}
                      onChange={(e) => updateSelectedBlock({ headerTitle: e.target.value })}
                      placeholder="Ex: ESTÁCIO&#10;SUA MATRÍCULA&#10;COMEÇA AQUI!"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-bold leading-snug"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subtítulo / Texto Complementar do Cabeçalho
                    </label>
                    <textarea
                      rows={3}
                      value={selectedBlock.headerSubtitle || ''}
                      onChange={(e) => updateSelectedBlock({ headerSubtitle: e.target.value })}
                      placeholder="Ex: Condições especiais para estudar na Estácio R9 – Taquara"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white leading-snug"
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Estilização do Subtítulo / Texto Complementar
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tamanho do Subtítulo: <span className="text-indigo-600 font-extrabold">{selectedBlock.headerSubtitleSizePx || 16}px</span>
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="36"
                        value={selectedBlock.headerSubtitleSizePx || 16}
                        onChange={(e) => updateSelectedBlock({ headerSubtitleSizePx: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Cor do Subtítulo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedBlock.headerSubtitleColor || '#ffffff'}
                          onChange={(e) => updateSelectedBlock({ headerSubtitleColor: e.target.value })}
                          className="w-9 h-8 p-0.5 border border-slate-300 rounded cursor-pointer bg-white"
                        />
                        <span className="text-xs font-mono uppercase text-slate-600">{selectedBlock.headerSubtitleColor || '#ffffff'}</span>
                        <div className="flex gap-1 ml-2">
                          {['#ffffff', '#e0e7ff', '#fef08a', '#93c5fd', '#1e1b4b'].map((hex) => (
                            <button
                              key={hex}
                              type="button"
                              onClick={() => updateSelectedBlock({ headerSubtitleColor: hex })}
                              className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: hex }}
                              title={`Cor: ${hex}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {renderFormattingToolbar({
                  defaultColorKey: 'headerTextColor',
                  defaultBgKey: 'headerBgColor',
                })}
              </div>
            )}

            {/* TITLE FORM */}
            {selectedBlock.type === 'title' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texto do Título</label>
                  <input
                    type="text"
                    value={selectedBlock.text || ''}
                    onChange={(e) => updateSelectedBlock({ text: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-bold"
                  />
                </div>
                {renderFormattingToolbar()}
              </div>
            )}

            {/* SUBTITLE FORM */}
            {selectedBlock.type === 'subtitle' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texto do Subtítulo</label>
                  <input
                    type="text"
                    value={selectedBlock.text || ''}
                    onChange={(e) => updateSelectedBlock({ text: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                {renderFormattingToolbar()}
              </div>
            )}

            {/* TEXT FORM */}
            {selectedBlock.type === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Conteúdo do Parágrafo</label>
                  <textarea
                    rows={4}
                    value={selectedBlock.text || ''}
                    onChange={(e) => updateSelectedBlock({ text: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-sans leading-relaxed"
                  />
                </div>
                {renderFormattingToolbar()}
              </div>
            )}

            {/* BUTTON FORM */}
            {selectedBlock.type === 'button' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Texto do Botão</label>
                    <input
                      type="text"
                      value={selectedBlock.buttonLabel || ''}
                      onChange={(e) => updateSelectedBlock({ buttonLabel: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Link de Destino (URL)</label>
                    <input
                      type="text"
                      value={selectedBlock.buttonUrl || ''}
                      onChange={(e) => updateSelectedBlock({ buttonUrl: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Largura no Mobile</label>
                    <select
                      value={selectedBlock.buttonWidth || 'full'}
                      onChange={(e) => updateSelectedBlock({ buttonWidth: e.target.value as any })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="full">100% da Largura (Recomendado)</option>
                      <option value="auto">Largura Automática</option>
                    </select>
                  </div>
                </div>

                {renderFormattingToolbar({
                  defaultColorKey: 'buttonTextColor',
                  defaultBgKey: 'buttonBgColor',
                  showBgColor: true,
                })}
              </div>
            )}

            {/* IMAGE FORM */}
            {selectedBlock.type === 'image' && (
              <div className="space-y-4">
                {/* Hidden Image File Input */}
                <input
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleImageBlockUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-indigo-600">image</span>
                      <span>Imagem / Banner do E-mail</span>
                    </label>
                    {selectedBlock.imageUrl && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        {selectedBlock.imageUrl.startsWith('data:') ? 'Imagem Local Enviada (Base64)' : 'URL Externa'}
                      </span>
                    )}
                  </div>

                  {/* Upload & Normalization Action Area */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100">
                    <button
                      type="button"
                      disabled={isNormalizing}
                      onClick={() => imageFileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-2xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isNormalizing ? 'sync' : 'upload_file'}
                      </span>
                      <span>{isNormalizing ? 'Processando Imagem...' : 'Fazer Upload de Imagem do Computador'}</span>
                    </button>

                    {selectedBlock.imageUrl && (
                      <button
                        type="button"
                        disabled={isNormalizing}
                        onClick={handleNormalizeExistingImage}
                        className="w-full sm:w-auto px-3.5 py-2.5 bg-white hover:bg-slate-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 shadow-2xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        title="Redimensiona e otimiza para ficar visível em qualquer celular e PC"
                      >
                        <span className="material-symbols-outlined text-[16px] text-indigo-600">tune</span>
                        <span>Normalizar para Celular e PC</span>
                      </button>
                    )}

                    <span className="text-xs text-indigo-900/80 font-medium text-center sm:text-left">
                      Suporta PNG, JPG, WEBP, GIF, SVG. A imagem é otimizada e incorporada diretamente no e-mail com resposta adaptativa para Celular e PC.
                    </span>
                  </div>

                  {/* Image Preview Box */}
                  {selectedBlock.imageUrl && (
                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative">
                          <img
                            src={selectedBlock.imageUrl}
                            alt={selectedBlock.imageAlt || 'Preview'}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="min-w-0 text-xs">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 truncate">
                              {selectedBlock.imageAlt || 'Imagem Selecionada'}
                            </p>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                              Visível em Celular e PC
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs md:max-w-md">
                            {selectedBlock.imageUrl.length > 60
                              ? `${selectedBlock.imageUrl.substring(0, 60)}...`
                              : selectedBlock.imageUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateSelectedBlock({ imageUrl: '' })}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg border border-red-200 transition-colors flex items-center gap-1"
                          title="Remover Imagem"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>Remover</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* URL fallback / direct edit */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Ou digite/cole a URL externa da imagem:
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.imageUrl || ''}
                      onChange={(e) => updateSelectedBlock({ imageUrl: e.target.value })}
                      placeholder="https://sua-empresa.com/banner.jpg"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Metadata & Click Link inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Link ao Clicar na Imagem (Opcional)
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.imageLink || ''}
                      onChange={(e) => updateSelectedBlock({ imageLink: e.target.value })}
                      placeholder="https://seusite.com/promocao"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Texto Alternativo (Alt)</label>
                    <input
                      type="text"
                      value={selectedBlock.imageAlt || ''}
                      onChange={(e) => updateSelectedBlock({ imageAlt: e.target.value })}
                      placeholder="Ex: Banner Promocional"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Legenda Opcional</label>
                    <input
                      type="text"
                      value={selectedBlock.imageCaption || ''}
                      onChange={(e) => updateSelectedBlock({ imageCaption: e.target.value })}
                      placeholder="Ex: *Consulte regulamento"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COUPON FORM */}
            {selectedBlock.type === 'coupon' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código do Cupom</label>
                  <input
                    type="text"
                    value={selectedBlock.couponCode || ''}
                    onChange={(e) => updateSelectedBlock({ couponCode: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título da Oferta</label>
                  <input
                    type="text"
                    value={selectedBlock.couponDiscount || ''}
                    onChange={(e) => updateSelectedBlock({ couponDiscount: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cor de Fundo do Cupom</label>
                  <input
                    type="color"
                    value={selectedBlock.couponBgColor || '#f0fdf4'}
                    onChange={(e) => updateSelectedBlock({ couponBgColor: e.target.value })}
                    className="w-full h-9 p-1 border border-slate-300 rounded-lg bg-white cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cor da Borda Tracejada</label>
                  <input
                    type="color"
                    value={selectedBlock.couponBorderColor || '#16a34a'}
                    onChange={(e) => updateSelectedBlock({ couponBorderColor: e.target.value })}
                    className="w-full h-9 p-1 border border-slate-300 rounded-lg bg-white cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* DIVIDER FORM */}
            {selectedBlock.type === 'divider' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estilo da Linha</label>
                  <select
                    value={selectedBlock.dividerStyle || 'solid'}
                    onChange={(e) => updateSelectedBlock({ dividerStyle: e.target.value as any })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="solid">Sólido</option>
                    <option value="dashed">Tracejado</option>
                    <option value="dotted">Pontilhado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cor da Linha</label>
                  <input
                    type="color"
                    value={selectedBlock.dividerColor || '#e2e8f0'}
                    onChange={(e) => updateSelectedBlock({ dividerColor: e.target.value })}
                    className="w-full h-9 p-1 border border-slate-300 rounded-lg bg-white cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* SOCIAL FORM */}
            {selectedBlock.type === 'social' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={selectedBlock.instagramUrl || ''}
                    onChange={(e) => updateSelectedBlock({ instagramUrl: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={selectedBlock.linkedinUrl || ''}
                    onChange={(e) => updateSelectedBlock({ linkedinUrl: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={selectedBlock.facebookUrl || ''}
                    onChange={(e) => updateSelectedBlock({ facebookUrl: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={selectedBlock.websiteUrl || ''}
                    onChange={(e) => updateSelectedBlock({ websiteUrl: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {/* FOOTER FORM */}
            {selectedBlock.type === 'footer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Texto do Rodapé</label>
                  <textarea
                    rows={3}
                    value={selectedBlock.footerText || ''}
                    onChange={(e) => updateSelectedBlock({ footerText: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-sans leading-relaxed"
                  />
                </div>
                {renderFormattingToolbar({
                  defaultColorKey: 'footerTextColor',
                  defaultBgKey: 'footerBgColor',
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PARTE 3: PREVIEW AO VIVO
        ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-2">
              <span className="bg-indigo-600 text-white w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold">3</span>
              <span>Pré-Visualização do E-mail Montado</span>
            </h2>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    previewDevice === 'desktop' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    previewDevice === 'mobile' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">smartphone</span>
                  <span>Mobile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rendered Live HTML Preview Box */}
          <div className="bg-slate-100 rounded-xl p-4 sm:p-8 flex justify-center items-center min-h-[400px]">
            <div
              className={`transition-all duration-300 bg-white rounded-lg shadow-md overflow-hidden ${
                previewDevice === 'mobile' ? 'w-[360px]' : 'w-full max-w-[620px]'
              }`}
            >
              <iframe
                title="Gerador PRO Live Preview"
                srcDoc={compiledHtml}
                className="w-full h-[520px] border-0"
              />
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Pronto para testar seu layout montado? Escolha para onde deseja prosseguir:
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleApplyToEditor}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
              <span>APLICAR NO EDITOR DE CÓDIGO</span>
            </button>

            <button
              type="button"
              onClick={handleGoToVisualizacao}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>IR PARA TELA DE VISUALIZAÇÃO</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
