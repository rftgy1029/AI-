import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClassComciganTimetable } from './src/server/comciganService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

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

// 프로덕션 dist 정적 파일 제공
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SchoolHub Server] http://localhost:${PORT} 에서 실행 중입니다.`);
});
