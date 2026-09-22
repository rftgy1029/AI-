import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClassComciganTimetable } from './src/server/comciganService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

import { GoogleGenAI } from '@google/genai';

// Gemini 3.8 Flash Vision AI 기반 시험범위표 실시간 OCR 분석 API
app.post('/api/ocr/exam-scope', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: '서버에 GEMINI_API_KEY 환경변수가 설정되지 않았습니다.',
      });
    }
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: '이미지 데이터가 없습니다.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
              },
            },
            {
              text: '대한민국 고등학교 시험범위표 인쇄물 분석: 각 과목별 subject, scope, textbookPages, supplementary, notice를 포함하는 JSON 형식({ "title": "...", "subjects": [...] })으로만 응답해주세요.',
            },
          ],
        },
      ],
    });

    const responseText = response.text?.trim() || '';
    const cleanJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, ...parsed });
  } catch (err: any) {
    console.error('Server OCR error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'OCR 처리 실패' });
  }
});

// 컴시간 실시간 시간표 API 엔드포인트
app.get('/api/timetable', async (req, res) => {
  try {
    const grade = parseInt(req.query.grade as string, 10) || 2;
    const classNum = parseInt((req.query.class || req.query.classNum) as string, 10) || 1;

    const timetable = await getClassComciganTimetable(grade, classNum);
    if (!timetable) {
      return res.status(404).json({
        success: false,
        error: `서대전고등학교 ${grade}학년 ${classNum}반 시간표 데이터를 찾을 수 없습니다.`,
      });
    }

    return res.json({
      success: true,
      grade,
      classNum,
      school: '서대전고등학교',
      timetable,
    });
  } catch (error: any) {
    console.error('컴시간 시간표 조회 API 오류:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '시간표 조회 중 오류가 발생했습니다.',
    });
  }
});

import {
  getAllSuggestions,
  insertSuggestion,
  toggleSuggestionLike,
  addCommentToSuggestion,
  addReplyToSuggestion,
  deleteSuggestionItem,
} from './src/server/suggestionStore';

// 건의게시판 다자간 실시간 동기화 API
app.get('/api/suggestions', (req, res) => {
  try {
    const list = getAllSuggestions();
    res.json({ success: true, items: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/suggestions', (req, res) => {
  try {
    const item = insertSuggestion(req.body);
    res.json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/suggestions/like', (req, res) => {
  try {
    const { id, currentlyLiked } = req.body;
    const result = toggleSuggestionLike(id, currentlyLiked);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/suggestions/comment', (req, res) => {
  try {
    const { id, comment } = req.body;
    const item = addCommentToSuggestion(id, comment);
    if (!item) return res.status(404).json({ success: false });
    res.json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/suggestions/reply', (req, res) => {
  try {
    const { id, reply } = req.body;
    const item = addReplyToSuggestion(id, reply);
    if (!item) return res.status(404).json({ success: false });
    res.json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/suggestions/delete', (req, res) => {
  try {
    const { id, pin } = req.body;
    const result = deleteSuggestionItem(id, pin);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 프로덕션 dist 정적 파일 제공
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SchoolHub Server] http://localhost:${PORT} 에서 실행 중입니다.`);
});
