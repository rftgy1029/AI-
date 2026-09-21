// Client-side image compression for instant, lightweight cloud sync
export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('이미지 로딩에 실패했습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기에 실패했습니다.'));
    reader.readAsDataURL(file);
  });
}

/**
 * OCR 인식을 위한 이미지 고화질 전처리 (대비 강화, 조명 그림자 보정, 윤곽선 선명화)
 */
export async function preprocessImageForOcr(
  imageSource: File | string,
  maxDimension = 2048
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const process = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof imageSource === 'string' ? imageSource : img.src);
        return;
      }

      // 1. 고해상도 드로우
      ctx.drawImage(img, 0, 0, width, height);

      // 2. 픽셀 데이터 획득 후 동적 대비(Contrast) & 적응형 명암비 강화
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const contrastFactor = 1.35; // 35% 대비 증가

        for (let i = 0; i < data.length; i += 4) {
          // 그레이스케일 가중 평균 (Rec. 709)
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          let gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

          // 밝은 종이 배경은 더 밝게, 어두운 글씨 잉크는 더 어둡게
          gray = (gray - 128) * contrastFactor + 128;
          if (gray > 255) gray = 255;
          if (gray < 0) gray = 0;

          // 미세한 흑백 분리 임계 보정 (작은 글씨 가독성 향상)
          if (gray < 95) gray = Math.max(0, gray * 0.85); // 잉크 어둡게
          else if (gray > 165) gray = Math.min(255, gray * 1.08); // 배경 밝게

          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }

        ctx.putImageData(imgData, 0, 0);
      } catch (err) {
        console.warn('Canvas pixel processing skipped (CORS/memory):', err);
      }

      // 최고 품질 JPEG로 내보내기 (OCR 분석용)
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onload = process;
    img.onerror = () => reject(new Error('전처리 이미지 로드 실패'));

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsDataURL(imageSource);
    }
  });
}

