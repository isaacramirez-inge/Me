// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import lottie from "astro-integration-lottie";
import react from '@astrojs/react';

export default defineConfig({
    base: '/Me/',
    output: 'static',
    vite: {
        assetsInclude: ['**/*.lottie'],
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