import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                lista: resolve(__dirname, "lista.html"),
                cadastro: resolve(__dirname, "cadastro.html")
            }
        }
    }
});
