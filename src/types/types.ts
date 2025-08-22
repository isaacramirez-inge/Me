
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
      subttitle_lines: string[],
      descriptions: string[],
    },
  },
  skills:{
    title: string,
  },
  profile:{
    title: string,
    tagline: string
  },
  contact:{
    title: string,
    name_field: string,
    email_field: string,
    message_field: string,
    message_placeholder: string,
    send_button: string,
    success_title: string,
    success_message: string,
    error_captcha: string,
    error_message: string,
  },
  chat:{
      bot_name: string,
      i_am_bot_message: string,
      its_a_pleasure: string,
      askme_placeholder: string,
      error_chatting: string,
      hit_limit_1: string,
      hit_limit_2: string,
      captcha_message: string
  }

};
