// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    base: '/Me/',
    output: 'static',
    i18n: {
        locales: ['en-us', 'es-es', 'es-sv'],
        defaultLocale: 'en-us',
        routing:{
            prefixDefaultLocale: false,
        }
    }
});
