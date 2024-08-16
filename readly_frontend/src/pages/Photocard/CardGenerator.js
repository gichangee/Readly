export const CardGenerator = (
  title,
  author,
  quote,
  fontName,
  selectedCardUrl
) => {
  return new Promise((resolve) => {
    document.fonts.ready.then(async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 700;
      const ctx = canvas.getContext("2d");

      function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
      }

      function wrapText(context, text, maxWidth, maxLines = Infinity) {
        const words = text.split(/\s+/);
        const lines = [];
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine + (currentLine ? " " : "") + word;
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && i > 0) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        while (lines.length > maxLines) {
          const shortestLineIndex = lines.reduce(
            (minIndex, line, index, arr) =>
              arr[index].length < arr[minIndex].length ? index : minIndex,
            0
          );
          const longestLineIndex = lines.reduce(
            (maxIndex, line, index, arr) =>
              arr[index].length > arr[maxIndex].length ? index : maxIndex,
            0
          );

          if (shortestLineIndex < longestLineIndex) {
            const words = lines[longestLineIndex].split(" ");
            if (words.length > 1) {
              const word = words.pop();
              lines[longestLineIndex] = words.join(" ");
              lines[shortestLineIndex] += " " + word;
            }
          } else {
            break;
          }
        }

        return lines;
      }

      function adjustTitleFontSize(ctx, title, maxWidth, initialFontSize) {
        let fontSize = initialFontSize;
        ctx.font = `bold ${fontSize}px "${fontName}", sans-serif`;
        let metrics = ctx.measureText(title);

        while (metrics.width > maxWidth && fontSize > 20) {
          fontSize -= 2;
          ctx.font = `bold ${fontSize}px "${fontName}", sans-serif`;
          metrics = ctx.measureText(title);
        }

        return fontSize;
      }

      // 배경 설정 (F8F8F8 + 둥근 모서리)
      ctx.save();
      roundRect(ctx, 0, 0, 500, 700, 20);
      ctx.fillStyle = "#F8F8F8";
      ctx.fill();
      ctx.restore();

      // 텍스트 색상 설정
      ctx.fillStyle = "black";

      // 날짜 추가 (우상단)
      ctx.font = `bold 18px "${fontName}", sans-serif`;
      const date = new Date().toISOString().split("T")[0];
      ctx.textAlign = "right";
      ctx.fillText(date, 480, 60);

      // 날짜 아래 구분선 추가
      ctx.beginPath();
      ctx.moveTo(20, 80);
      ctx.lineTo(480, 80);
      ctx.stroke();

      // 제목 추가 (동적 폰트 크기 적용)
      const titleFontSize = adjustTitleFontSize(ctx, title, 460, 28);
      ctx.font = `bold ${titleFontSize}px "${fontName}", sans-serif`;
      ctx.textAlign = "left";
      const titleLines = wrapText(ctx, title, 460);
      titleLines.forEach((line, index) => {
        ctx.fillText(line, 20, 130 + index * (titleFontSize + 7));
      });

      // 첫 번째 구분선 추가 (간격 조정)
      const titleHeight = titleLines.length * (titleFontSize + 7);
      ctx.beginPath();
      ctx.moveTo(20, 140 + titleHeight);
      ctx.lineTo(480, 140 + titleHeight);
      ctx.stroke();

      // 작가 추가
      ctx.font = `bold 22px "${fontName}", sans-serif`;
      const authorLines = wrapText(ctx, author, 460);
      authorLines.forEach((line, index) => {
        ctx.fillText(line, 20, 190 + titleHeight + index * 30);
      });

      // 두 번째 구분선 추가 (간격 조정)
      ctx.beginPath();
      ctx.moveTo(20, 210 + titleHeight + authorLines.length * 30);
      ctx.lineTo(480, 210 + titleHeight + authorLines.length * 30);
      ctx.stroke();

      // 글귀 추가 (개선된 버전)
      ctx.font = `bold 24px "${fontName}", sans-serif`;
      const maxQuoteWidth = 460;
      const quoteLines = wrapText(ctx, quote, maxQuoteWidth, 5); // 최대 5줄로 제한
      const quoteY = 370 + titleHeight + authorLines.length * 30;

      // 글귀 정렬 설정 (여기서 'left' 또는 'center'로 변경 가능)
      const quoteAlign = "center";
      ctx.textAlign = quoteAlign;
      const quoteX = quoteAlign === "center" ? canvas.width / 2 : 20;
      const lineHeight = quoteLines.length > 3 ? 35 : 40;
      quoteLines.forEach((line, index) => {
        const y = quoteY + index * lineHeight;
        ctx.fillText(line, quoteX, y);
      });

      // 저작권 정보 추가
      ctx.font = `bold 14px "${fontName}", sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Copyright © READLY All rights reserved", 250, 680);

      // 첫 번째 이미지 생성 (info card)
      const infoCardDataUrl = canvas.toDataURL("image/png");

      // 두 번째 이미지 생성 (combined card)
      const combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = 1700;
      combinedCanvas.height = 1400; // 높이를 줄임

      const combinedCtx = combinedCanvas.getContext("2d");

      // 캔버스를 투명하게 만듭니다
      combinedCtx.clearRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      const [infoCardImg, selectedCardImg] = await Promise.all([
        loadImage(infoCardDataUrl),
        loadImage(selectedCardUrl),
      ]);

      const cardWidth = 500; // 카드의 고정 너비
      const cardHeight = 700; // 카드의 고정 높이

      // 두 번째 카드 (infoCard) 그리기
      combinedCtx.save();
      combinedCtx.translate(combinedCanvas.width * 0.72, combinedCanvas.height * 0.6); // 위치를 아래로 조정
      combinedCtx.rotate((15 * Math.PI) / 180);
      roundRect(combinedCtx, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 20);
      combinedCtx.clip();
      combinedCtx.drawImage(infoCardImg, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
      combinedCtx.restore();

      // 첫 번째 카드 (selectedCard) 그리기
      combinedCtx.save();
      combinedCtx.translate(combinedCanvas.width * 0.35, combinedCanvas.height * 0.6); // 위치를 아래로 조정
      combinedCtx.rotate((-15 * Math.PI) / 180);
      roundRect(combinedCtx, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 20);
      combinedCtx.clip();
      combinedCtx.drawImage(selectedCardImg, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
      combinedCtx.restore();

      const combinedDataUrl = combinedCanvas.toDataURL("image/png");

      resolve({ infoCard: infoCardDataUrl, combinedCard: combinedDataUrl });
    });
  });
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // CORS 요청을 가능하게 합니다.
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
