import { EmailTemplate } from '../types';

export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'padrao',
    name: 'Padrão',
    description: 'Um layout limpo e direto, ideal para comunicados gerais e avisos institucionais.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    headerTitle: 'Novidades Especiais',
    greeting: 'Olá, {{nome}}!',
    buttonText: 'Agendar Demonstração',
    buttonUrl: 'https://exemplo.com',
    bodyText: 'Esperamos que este e-mail lhe encontre bem em {{var1}}.\n\nTemos o prazer de apresentar uma oferta desenhada sob medida para as suas necessidades de negócios. Clique no botão abaixo para agendar uma demonstração gratuita conosco.',
    footerText: 'Você está recebendo este e-mail comercial enviado para {{email}}.\n© 2026 Minha Empresa S.A. Todos os direitos reservados.',
    primaryColor: '#4f46e5',
    customCodeHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 20px; -webkit-text-size-adjust: 100%; }
    .card { background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .header { background-color: #4f46e5; color: #ffffff; padding: 32px 24px; text-align: center; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .footer { background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; }
    .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 16px; }
    h2 { color: #1e1b4b; margin-top: 0; }
    img { max-width: 100%; height: auto; border: 0; outline: none; }
    img.emoji, img.CToW4e, img[src*="emoji"], img[src*="emoticons"], img[alt*="emoji"] {
      width: 1.2em !important; height: 1.2em !important; max-width: 1.2em !important; max-height: 1.2em !important; display: inline-block !important; vertical-align: -0.2em !important; margin: 0 0.15em !important;
    }
    
    /* Regras de Visualização Responsiva Mobile */
    @media only screen and (max-width: 600px) {
      body { padding: 10px !important; }
      .card { border-radius: 0 !important; border: none !important; width: 100% !important; }
      .header { padding: 24px 16px !important; }
      .content { padding: 24px 16px !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; padding: 14px 16px !important; box-sizing: border-box !important; font-size: 16px !important; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 style="margin:0; font-size:24px;">Novidades Especiais</h1>
    </div>
    <div class="content">
      <h2>Olá, {{nome}}!</h2>
      <p>Esperamos que este e-mail lhe encontre bem em <strong>{{var1}}</strong>.</p>
      <p>Temos o prazer de apresentar uma oferta desenhada sob medida para as suas necessidades de negócios. Clique no botão abaixo para agendar uma demonstração gratuita conosco.</p>
      <div style="text-align: center;">
        <a href="https://exemplo.com" class="btn">Agendar Demonstração</a>
      </div>
      <p style="margin-top: 24px;">Atenciosamente,<br>Equipe Comercial</p>
    </div>
    <div class="footer">
      Você está recebendo este e-mail comercial enviado para {{email}}.<br>
      © 2026 Minha Empresa S.A. Todos os direitos reservados.
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'boas-vindas',
    name: 'Boas Vindas Elegante',
    description: 'Uma introdução acolhedora e personalizada para novos usuários e alunos.',
    badge: 'BOAS-VINDAS',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    headerTitle: 'Bem-vindo à nossa comunidade!',
    greeting: 'Que bom ter você conosco, {{nome}}!',
    buttonText: 'Conhecer Meu Painel',
    buttonUrl: 'https://exemplo.com/comecar',
    bodyText: 'Seu cadastro associado a {{var1}} foi ativado com sucesso em nossos servidores.\n\nEstamos muito entusiasmados em ajudar você e seu time a alcançar novos patamares de produtividade e segurança de entregas em tempo recorde.',
    footerText: 'Você está recebendo este e-mail como parte do seu cadastro corporativo para {{email}}.\n© 2026 Minha Empresa S.A. Todos os direitos reservados.',
    primaryColor: '#10b981',
    customCodeHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 20px; -webkit-text-size-adjust: 100%; }
    .card { background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background-color: #10b981; color: #ffffff; padding: 40px 24px; text-align: center; }
    .content { padding: 36px 28px; line-height: 1.6; }
    .footer { background-color: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; }
    .btn { display: inline-block; background-color: #10b981; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; box-shadow: 0 2px 4px rgba(16,185,129,0.2); }
    h1 { margin: 0; font-size: 26px; font-weight: 800; }
    h2 { color: #064e3b; margin-top: 0; font-size: 20px; }
    
    /* Regras de Visualização Responsiva Mobile */
    @media only screen and (max-width: 600px) {
      body { padding: 10px !important; }
      .card { border-radius: 0 !important; border: none !important; width: 100% !important; }
      .header { padding: 30px 16px !important; }
      .content { padding: 24px 16px !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; padding: 14px 16px !important; box-sizing: border-box !important; font-size: 16px !important; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Bem-vindo à nossa comunidade!</h1>
    </div>
    <div class="content">
      <h2>Que bom ter você conosco, {{nome}}!</h2>
      <p>Seu cadastro associado a <strong>{{var1}}</strong> foi ativado com sucesso em nossos servidores.</p>
      <p>Estamos muito entusiasmados em ajudar você e seu time a alcançar novos patamares de produtividade e segurança de entregas em tempo recorde.</p>
      <div style="text-align: center;">
        <a href="https://exemplo.com/comecar" class="btn">Conhecer Meu Painel</a>
      </div>
      <p>Como primeiro passo recomendado, clique no botão acima para acessar o tutorial de introdução que preparamos para você.</p>
      <p style="margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 13px; color: #64748b;">
        Abraços,<br>
        <strong>Equipe de Sucesso do Cliente</strong>
      </p>
    </div>
    <div class="footer">
      Você está recebendo este e-mail como parte do seu cadastro corporativo para {{email}}.<br>
      © 2026 Minha Empresa S.A. Todos os direitos reservados.
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Formato de leitura focado em conteúdo denso, notícias e curadoria de links.',
    badge: 'NEWSLETTER',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80',
    headerTitle: 'Informativo Semanal de {{var1}}',
    greeting: 'Olá, {{nome}}!',
    buttonText: 'Acessar Nosso Blog Completo',
    buttonUrl: 'https://exemplo.com/blog',
    bodyText: 'Preparamos uma curadoria de conteúdos e dicas especiais para acelerar os resultados de seu time nesta semana.',
    footerText: 'Este informativo foi enviado para o e-mail cadastrado de {{nome}} ({{email}}).\nCaso não queira mais receber nossos boletins, clique aqui para sair.\n© 2026 {{var1}}. Todos os direitos reservados.',
    primaryColor: '#3b82f6',
    customCodeHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155; margin: 0; padding: 20px; -webkit-text-size-adjust: 100%; }
    .card { background-color: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
    .header { background-color: #3b82f6; color: #ffffff; padding: 32px; text-align: left; }
    .content { padding: 32px; line-height: 1.6; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .badge { display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px; }
    .item-row { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px dashed #e2e8f0; }
    .item-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    h1 { margin: 0; font-size: 22px; font-weight: bold; }
    h3 { margin: 0 0 8px 0; color: #1e3a8a; font-size: 16px; }
    
    /* Regras de Visualização Responsiva Mobile */
    @media only screen and (max-width: 600px) {
      body { padding: 10px !important; }
      .card { border-radius: 0 !important; border: none !important; width: 100% !important; }
      .header { padding: 24px 16px !important; }
      .content { padding: 24px 16px !important; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">CONTEÚDO EXCLUSIVO</div>
      <h1>Informativo Semanal de {{var1}}</h1>
    </div>
    <div class="content">
      <p>Olá, {{nome}}! Preparamos uma curadoria de conteúdos e dicas especiais para acelerar os resultados de seu time nesta semana.</p>
      
      <div style="margin-top: 28px;">
        <div class="item-row">
          <h3>🚀 1. Como contornar filtros anti-spam corporativos</h3>
          <p style="margin: 0; font-size: 14px; color: #475569;">Entenda as principais regras de SPF, DKIM e DMARC que garantem que seus e-mails cheguem diretamente na caixa de entrada principal do seu cliente.</p>
        </div>
        
        <div class="item-row">
          <h3>📊 2. Novas métricas de engajamento no painel</h3>
          <p style="margin: 0; font-size: 14px; color: #475569;">A partir de hoje, você pode acompanhar as taxas de abertura e rejeição diretamente de seu painel de relatórios integrados.</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 24px;">
        <a href="https://exemplo.com/blog" style="display: inline-block; background-color: #3b82f6; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Acessar Nosso Blog Completo</a>
      </div>
    </div>
    <div class="footer">
      Este informativo foi enviado para o e-mail cadastrado de {{nome}} ({{email}}).<br>
      Caso não queira mais receber nossos boletins, <a href="https://exemplo.com/descadastrar" style="color: #3b82f6; text-decoration: underline;">clique aqui para sair</a>.<br>
      © 2026 {{var1}}. Todos os direitos reservados.
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'oferta',
    name: 'Oferta / Cupom',
    description: 'Design chamativo otimizado para promoções relâmpago e cupons de desconto.',
    badge: 'OFERTA',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
    headerTitle: 'Oferta Especial Imperdível!',
    greeting: 'Olá, {{nome}}! Desconto exclusivo para você.',
    buttonText: 'Ativar Desconto Agora',
    buttonUrl: 'https://exemplo.com/assinar',
    bodyText: 'Temos uma excelente notícia! Como parceiro de destaque de {{var1}}, você acaba de ganhar um cupom especial de 35% de desconto em nossa assinatura anual.',
    footerText: 'Promoção exclusiva enviada para {{email}}.\n© 2026 {{var1}} S.A. Todos os direitos reservados.',
    primaryColor: '#f43f5e',
    customCodeHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fff1f2; color: #334155; margin: 0; padding: 20px; -webkit-text-size-adjust: 100%; }
    .card { background-color: #ffffff; border-radius: 16px; border: 1px solid #fecdd3; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(244,63,94,0.08); }
    .header { background-color: #f43f5e; color: #ffffff; padding: 40px 24px; text-align: center; }
    .content { padding: 32px; line-height: 1.6; text-align: center; }
    .footer { background-color: #fff1f2; padding: 20px; text-align: center; font-size: 11px; color: #9f1239; }
    .coupon { border: 2px dashed #f43f5e; background-color: #fff1f2; padding: 16px; border-radius: 10px; display: inline-block; margin: 20px 0; font-family: monospace; font-size: 22px; font-weight: bold; color: #be123c; letter-spacing: 2px; }
    .btn { display: inline-block; background-color: #f43f5e; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px; box-shadow: 0 4px 6px -1px rgba(244,63,94,0.3); }
    h1 { margin: 0; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    h2 { color: #881337; margin-top: 0; font-size: 22px; }
    
    /* Regras de Visualização Responsiva Mobile */
    @media only screen and (max-width: 600px) {
      body { padding: 10px !important; }
      .card { border-radius: 0 !important; border: none !important; width: 100% !important; }
      .header { padding: 28px 16px !important; }
      .content { padding: 24px 16px !important; }
      .coupon { font-size: 18px !important; padding: 12px !important; display: block !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; padding: 14px 16px !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Oferta Especial Imperdível!</h1>
    </div>
    <div class="content">
      <h2>Olá, {{nome}}! Desconto exclusivo para você.</h2>
      <p>Temos uma excelente notícia! Como parceiro de destaque de <strong>{{var1}}</strong>, você acaba de ganhar um cupom especial de 35% de desconto em nossa assinatura anual.</p>
      
      <div class="coupon">
        DESCONTO35OFF
      </div>
      
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b;">*Válido por tempo limitado. Aproveite para atualizar seu plano hoje!</p>
      
      <div>
        <a href="https://exemplo.com/assinar" class="btn">Ativar Desconto Agora</a>
      </div>
    </div>
    <div class="footer">
      Promoção exclusiva enviada para {{email}}.<br>
      © 2026 {{var1}} S.A. Todos os direitos reservados.
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'pesquisa',
    name: 'Pesquisa e Feedback',
    description: 'Solicite a opinião dos seus clientes de forma amigável e estatística.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    headerTitle: 'Sua opinião é fundamental!',
    greeting: 'Obrigado pela confiança, {{nome}}!',
    buttonText: 'Responder Pesquisa',
    buttonUrl: 'https://exemplo.com/pesquisa',
    bodyText: 'Recentemente você interagiu com a equipe da {{empresa}}. Queremos garantir que estamos fornecendo a melhor experiência de entregas e contatos possíveis.\n\nPoderia nos dedicar 2 minutinhos para responder a uma pesquisa de satisfação rápida? Prometemos que é muito simples!',
    footerText: 'E-mail de controle de qualidade enviado para {{email}}.\n© 2026 {{empresa}} Ltda.',
    primaryColor: '#78350f',
    customCodeHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fafaf9; color: #44403c; margin: 0; padding: 20px; -webkit-text-size-adjust: 100%; }
    .card { background-color: #ffffff; border-radius: 12px; border: 1px solid #e7e5e4; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
    .header { background-color: #78350f; color: #ffffff; padding: 32px 24px; text-align: center; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .footer { background-color: #f5f5f4; padding: 16px 24px; text-align: center; font-size: 11px; color: #78716c; }
    .btn { display: inline-block; background-color: #d97706; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 16px; }
    h1 { margin: 0; font-size: 22px; font-weight: bold; }
    h2 { color: #451a03; margin-top: 0; font-size: 18px; }
    
    /* Regras de Visualização Responsiva Mobile */
    @media only screen and (max-width: 600px) {
      body { padding: 10px !important; }
      .card { border-radius: 0 !important; border: none !important; width: 100% !important; }
      .header { padding: 24px 16px !important; }
      .content { padding: 24px 16px !important; }
      .btn { display: block !important; width: 100% !important; text-align: center !important; padding: 14px 16px !important; box-sizing: border-box !important; font-size: 16px !important; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Sua opinião é fundamental!</h1>
    </div>
    <div class="content">
      <h2>Obrigado pela confiança, {{nome}}!</h2>
      <p>Recentemente você interagiu com a equipe da <strong>{{empresa}}</strong>. Queremos garantir que estamos fornecendo a melhor experiência de entregas e contatos possíveis.</p>
      <p>Poderia nos dedicar 2 minutinhos para responder a uma pesquisa de satisfação rápida? Prometemos que é muito simples!</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://exemplo.com/pesquisa" class="btn">Responder Pesquisa</a>
      </div>
      <p>Seus feedbacks ajudam diretamente a moldar as novas updates do nosso sistema de envios.</p>
      <p style="margin-top: 24px; font-size: 13px; color: #78716c;">Com carinho,<br><strong>Equipe de Relacionamento</strong></p>
    </div>
    <div class="footer">
      E-mail de controle de qualidade enviado para {{email}}.<br>
      © 2026 {{empresa}} Ltda.
    </div>
  </div>
</body>
</html>`,
  },
];

