import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
    build: {
        outDir: resolve(__dirname, '../backend/dist'),
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                full: resolve(__dirname, 'src/full.html'),
                simple: resolve(__dirname, 'src/simple.html'),
            },
        },
    },
})