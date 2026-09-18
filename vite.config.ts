import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import {
  getAllSuggestions,
  insertSuggestion,
  toggleSuggestionLike,
  addCommentToSuggestion,
  addReplyToSuggestion,
  deleteSuggestionItem,
} from './src/server/suggestionStore';
import { getClassComciganTimetable } from './src/server/comciganService';

function parseJsonBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function suggestionsApiPlugin(): Plugin {
  return {
    name: 'suggestions-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/suggestions')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        try {
          const url = new URL(req.url, 'http://localhost');
          const pathname = url.pathname;

          if (req.method === 'GET' && pathname === '/api/suggestions') {
            const list = getAllSuggestions();
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, items: list }));
          }

          if (req.method === 'POST') {
            const body = await parseJsonBody(req);

            if (pathname === '/api/suggestions') {
              const item = insertSuggestion(body);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, item }));
            }

            if (pathname === '/api/suggestions/like') {
              const result = toggleSuggestionLike(body.id, body.currentlyLiked);
              res.statusCode = 200;
              return res.end(JSON.stringify(result));
            }

            if (pathname === '/api/suggestions/comment') {
              const item = addCommentToSuggestion(body.id, body.comment);
              res.statusCode = item ? 200 : 404;
              return res.end(JSON.stringify({ success: !!item, item }));
            }

            if (pathname === '/api/suggestions/reply') {
              const item = addReplyToSuggestion(body.id, body.reply, body.status);
              res.statusCode = item ? 200 : 404;
              return res.end(JSON.stringify({ success: !!item, item }));
            }

            if (pathname === '/api/suggestions/delete') {
              const result = deleteSuggestionItem(body.id, body.pin);
              res.statusCode = result.success ? 200 : 400;
              return res.end(JSON.stringify(result));
            }
          }

          next();
        } catch (error: any) {
          console.error('[Vite Suggestions Middleware Error]:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: error?.message }));
        }
      });
    },
  };
}

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
    plugins: [react(), tailwindcss(), comciganApiPlugin(), suggestionsApiPlugin()],
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
