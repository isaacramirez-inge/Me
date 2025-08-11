import React from 'react';
import RenderJsonLottie from '../_react/RenderJsonLottie';
import rocket from '../../assets/anim/rocket-init.json';

interface Props{
    langs: {code: string, name: string}[];
    defaultLocale: string;
}

const ReactRenderBridge: React.FC<Props> = ({langs, defaultLocale}) => {
    const goto = (lang: string) => {
        window.location.replace(`/Me/${lang}/`);
    }
    const onComplete = () => {
        const userDetectedLanguages = [navigator.language, ...navigator.languages];
        const langDialect = langs.flatMap((spl) => spl.code).find((spl) => userDetectedLanguages.map(userLang => userLang.toLocaleLowerCase()).includes(spl.toLocaleLowerCase()));
        if(langDialect){
            goto(langDialect);
            return;
        }
        const langMatched = langs.flatMap((spl) => spl.code).find((spl) => userDetectedLanguages.find((userLang) => userLang.toLocaleLowerCase().startsWith(spl.split('-')[0].toLocaleLowerCase())));
        if(langMatched){
            goto(langMatched);
            return;
        }
        goto(defaultLocale);
    }

  return (
    <RenderJsonLottie 
        source={rocket}
        loop={false}
        height={500}
        width={500}
        events={[{e: 'complete', callback: onComplete}]}
    />
  );
};

export default ReactRenderBridge;