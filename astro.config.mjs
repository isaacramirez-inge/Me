// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
    trailingSlash: "never", // opciones: "always" | "never" | "ignore"
    base: '/',
    output: 'static',
    vite: {
        assetsInclude: ['**/*.lottie'],
        define: {
            __CACHE_BUSTER__: JSON.stringify(Date.now().toString(36)),
        },
    },
    i18n: {
        locales: ['en-us', 'es-es', 'es-sv'],
        defaultLocale: 'en-us',
        routing: {
            prefixDefaultLocale: false,
        }
    },
    integrations: [
        tailwind(),
        react()
    ]
});