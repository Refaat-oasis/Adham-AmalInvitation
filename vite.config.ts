import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function autoImagesPlugin(): Plugin {
  const virtualModuleId = 'virtual:images';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const getImageFiles = () => {
    const dir = path.resolve(__dirname, 'public/images');
    if (!fs.existsSync(dir)) return [];
    const validExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
    return fs.readdirSync(dir)
      .filter((f) => validExts.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map((f) => `/images/${f}`);
  };

  const syncImagesJson = () => {
    try {
      const images = getImageFiles();
      const jsonPath = path.resolve(__dirname, 'public/images/images.json');
      fs.writeFileSync(jsonPath, JSON.stringify(images, null, 2), 'utf-8');
      return images;
    } catch {
      return getImageFiles();
    }
  };

  return {
    name: 'auto-images-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const images = syncImagesJson();
        return `export const autoImages = ${JSON.stringify(images)};\nexport default autoImages;`;
      }
    },
    buildStart() {
      syncImagesJson();
    },
    configureServer(server) {
      const imgDir = path.resolve(__dirname, 'public/images');
      server.watcher.add(imgDir);
      server.watcher.on('all', (event, filePath) => {
        if (
          filePath.startsWith(imgDir) &&
          !filePath.endsWith('images.json') &&
          !filePath.endsWith('README.txt')
        ) {
          syncImagesJson();
          const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: 'full-reload' });
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), autoImagesPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5101',
        changeOrigin: true,
      },
    },
  },
});
