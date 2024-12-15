import { viteStaticCopy } from 'vite-plugin-static-copy'
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist',
    },
    publicDir: 'public',
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: './v86',
                    dest: ''
                },
                {
                    src: './img',
                    dest: ''
                },
                {
                    src: './bios',
                    dest: ''
                },
                {
                    src: './apps',
                    dest: ''
                },
                {
                    src: './node_modules/chiptune3/*.worklet.js',
                    dest: 'assets'
                }
            ]
        })
    ],
    optimizeDeps: {
        exclude: ['fatfs-wasm', 'chiptune3']
    }
 });
