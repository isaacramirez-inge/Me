
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
    empty_captcha: string;
    email_field: string,
    message_field: string,
    message_placeholder: string,
    send_button: string,
    success_title: string,
    success_message: string,
    error_captcha: string,
    error_message: string,
    confirmation_subject: string,
    confirmation_greeting: string,
    confirmation_bot_intro: string,
    confirmation_message_received: string,
    confirmation_delivered: string,
    confirmation_thanks: string,
    confirmation_footer: string,
  },
  chat:{
      bot_name: string,
      i_am_bot_message: string,
      its_a_pleasure: string,
      askme_placeholder: string,
      error_chatting: string,
      error_response: string,
      hit_limit_1: string,
      hit_limit_2: string,
      captcha_message: string
  },
  policy:{
    title: string,
    last_updated: string,
    introduction_title: string,
    introduction_text: string,
    cookies_title: string,
    cookies_text: string,
    data_title: string,
    data_text: string,
  },
  cookies:{
    title: string,
    message: string,
    accept: string,
    policy: string,
  }

};
