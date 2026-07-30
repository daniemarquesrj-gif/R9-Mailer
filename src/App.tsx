import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen, TransitionType, EmailData } from './types';
import { DEFAULT_TEMPLATES } from './data/templates';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { EditorScreen } from './screens/EditorScreen';
import { VisualizacaoScreen } from './screens/VisualizacaoScreen';
import { GeradorScreen } from './screens/GeradorScreen';
import { GeradorProScreen } from './screens/GeradorProScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('editor');
  const [transitionType, setTransitionType] = useState<TransitionType>('none');

  const defaultTmpl = DEFAULT_TEMPLATES[0];

  const [emailData, setEmailData] = useState<EmailData>({
    headerTitle: defaultTmpl.headerTitle,
    greeting: defaultTmpl.greeting,
    buttonText: defaultTmpl.buttonText,
    buttonUrl: defaultTmpl.buttonUrl,
    bodyText: defaultTmpl.bodyText,
    footerText: defaultTmpl.footerText,
    primaryColor: defaultTmpl.primaryColor,
    activeTemplateId: defaultTmpl.id,
    customCodeHtml: defaultTmpl.customCodeHtml,
  });

  const handleNavigate = (screen: Screen, transition: TransitionType = 'none') => {
    setTransitionType(transition);
    setCurrentScreen(screen);
  };

  const getVariants = () => {
    if (transitionType === 'push') {
      return {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 },
      };
    }
    if (transitionType === 'push_back') {
      return {
        initial: { x: '-100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 },
      };
    }
    // 'none' transition
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  };

  const getSubtitle = () => {
    switch (currentScreen) {
      case 'editor':
        return '/ editor-de-codigo.html';
      case 'visualizacao':
        return '/ visualizacao-real.html';
      case 'gerador':
        return '/ gerador-visual.html';
      case 'gerador_pro':
        return '/ gerador-pro-blocos.html';
      default:
        return '/ modelo-de-email.html';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body-md overflow-x-hidden">
      {/* Shared Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        subtitle={getSubtitle()}
      />

      {/* Screen Content Container with Motion Animations */}
      <main className="flex-grow flex flex-col relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={getVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: transitionType === 'none' ? 0.15 : 0.35, ease: 'easeInOut' }}
            className="flex-grow flex flex-col w-full"
          >
            {currentScreen === 'editor' && (
              <EditorScreen
                emailData={emailData}
                setEmailData={setEmailData}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'visualizacao' && (
              <VisualizacaoScreen
                emailData={emailData}
                setEmailData={setEmailData}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'gerador' && (
              <GeradorScreen
                emailData={emailData}
                setEmailData={setEmailData}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'gerador_pro' && (
              <GeradorProScreen
                emailData={emailData}
                setEmailData={setEmailData}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Footer */}
      <Footer
        onConcluir={
          currentScreen !== 'visualizacao'
            ? () => handleNavigate('visualizacao', 'push')
            : undefined
        }
      />
    </div>
  );
}
