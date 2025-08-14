
export type Locale = 'en-us' | 'es-es' | 'es-sv';

export type Translation = {
  _info: {
    name: string,
    code: string,
  },
  common: {
    name: string,
    tabtitle: string,
  },
  navbar: {
    this_is_me: string,
  },
  home: {
    welcome: {
      title: string,
      subtitle: string,
      descriptions: string[],
    },
  },
  skills:{
    title: string,
  }
};

export interface Technology {
  id: number;
  name: string;
  logo_path: string;
  extension: string;
  bg_color: string;
  text_color: string;
  border_color: string;
  category: string;
  display_text: string;
}
