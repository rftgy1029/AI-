import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { getClassComciganTimetable } from './src/server/comciganService';

function comciganApiPlugin(): Plugin {
  return {
    name: 'comcigan-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/timetable', async (req, res) => {
        try {
          const url = new URL(req.url || '', 'http://localhost');
          const grade = parseInt(url.searchParams.get('grade') || '2', 10);
          const classNum = parseInt(url.searchParams.get('class') || url.searchParams.get('classNum') || '1', 10);

          const timetable = await getClassComciganTimetable(grade, classNum);
          if (!timetable) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({
              success: false,
              error: `서대전고등학교 ${grade}학년 ${classNum}반 시간표를 찾을 수 없습니다.`,
            }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({
            success: true,
            grade,
            classNum,
            school: '서대전고등학교',
            timetable,
          }));
        } catch (error: any) {
          console.error('[Vite Comcigan Middleware Error]:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({
            success: false,
            error: error?.message || '컴시간 시간표 조회 실패',
          }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), comciganApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
