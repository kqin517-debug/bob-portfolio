import { useEffect, useState } from 'react';
import { content, type Language } from './content';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Sections } from './components/Sections';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const copy = content[language];

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = language === 'en' ? 'Bob — Portfolio' : 'Bob — 个人主页';
  }, [language]);

  return (
    <div id="top">
      <a className="skip-link" href="#main-content">{language === 'en' ? 'Skip to content' : '跳到主要内容'}</a>
      <Header copy={copy} language={language} onLanguageChange={() => setLanguage((current) => current === 'en' ? 'zh' : 'en')} />
      <main id="main-content">
        <Hero copy={copy.hero} />
        <Sections copy={copy} />
      </main>
      <Footer copy={copy} />
    </div>
  );
}
