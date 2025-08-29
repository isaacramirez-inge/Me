import React from 'react';
import RenderJsonLottie from '../_react/RenderJsonLottie';
import rocket from '../../assets/anim/rocket-init.json';

interface Props{
    langs: {code: string, name: string}[];
    defaultLocale: string;
    base_path: string;
}

const ReactRenderBridge: React.FC<Props> = ({langs, defaultLocale, base_path}) => {
    const goto = (lang: string) => {
        const url = window.location.protocol + '//' + window.location.hostname+`/${base_path}/${lang}/home`;
        window.location.href = url; 
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