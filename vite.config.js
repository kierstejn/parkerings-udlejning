import { defineConfig } from 'vite';
import { existsSync, readFileSync } from 'fs';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const certPath = '/etc/certs/local.crt';
const keyPath  = '/etc/certs/local.key';
const tls = existsSync(certPath) && existsSync(keyPath)
    ? { key: readFileSync(keyPath), cert: readFileSync(certPath) }
    : undefined;

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        https: tls,
        hmr: {
            host: 'localhost',
            protocol: tls ? 'wss' : 'ws',
        },
        watch: {
            usePolling: true,
        },
    },
});
