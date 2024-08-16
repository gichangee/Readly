import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import useUserStore from "../../store/userStore.js";
import { getFollowerInfo } from "../../api/memberAPI.js";

const PhotocardBack = ({
  photoCardText,
  memberId,
  bookTitle,
  bookAuthor,
  photoCardCreatedDate,
}) => {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useUserStore();
  const [userInfo, setUserInfo] = useState(null);
  console.log(user)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getFollowerInfo(memberId);
        setUserInfo(data);
        console.log("Fetched User Info:", data);
        console.log("Fetched User Info:", data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (memberId) {
      fetchUserInfo();
    }
  }, [memberId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 360;
    canvas.height = 500;

    ctx.fillStyle = "#F8F8F8";
    ctx.fillRect(0, 0, 360, 500);

    ctx.fillStyle = "black";

    ctx.font = "bold 14px sans-serif";
    const date = new Date(photoCardCreatedDate).toISOString().split("T")[0];
    ctx.textAlign = "right";
    ctx.fillText(date, 340, 30);

    ctx.beginPath();
    ctx.moveTo(20, 45);
    ctx.lineTo(340, 45);
    ctx.stroke();

    let titleFontSize = 18;
    if (bookTitle.length > 20) {
      titleFontSize = 16;
    }
    if (bookTitle.length > 30) {
      titleFontSize = 14;
    }
    ctx.font = `bold ${titleFontSize}px sans-serif`;
    ctx.textAlign = "left";
    const titleLines = wrapText(ctx, bookTitle, 320);
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 20, 80 + index * (titleFontSize + 5));
    });

    const titleHeight = titleLines.length * (titleFontSize + 5);
    ctx.beginPath();
    ctx.moveTo(20, 90 + titleHeight);
    ctx.lineTo(340, 90 + titleHeight);
    ctx.stroke();

    let authorFontSize = 16;
    if (bookAuthor.length > 20) {
      authorFontSize = 14;
    }
    if (bookAuthor.length > 30) {
      authorFontSize = 12;
    }
    ctx.font = `bold ${authorFontSize}px sans-serif`;
    const authorLines = wrapText(ctx, bookAuthor, 320);
    authorLines.forEach((line, index) => {
      ctx.fillText(line, 20, 120 + titleHeight + index * (authorFontSize + 5));
    });

    const authorHeight = authorLines.length * (authorFontSize + 5);
    ctx.beginPath();
    ctx.moveTo(20, 135 + titleHeight + authorHeight);
    ctx.lineTo(340, 135 + titleHeight + authorHeight);
    ctx.stroke();

    ctx.font = "16px sans-serif";
    const quoteLines = wrapText(ctx, photoCardText, 320, 7);
    ctx.textAlign = "left";
    quoteLines.forEach((line, index) => {
      ctx.fillText(line, 20, 190 + titleHeight + authorHeight + index * 25);
    });

    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Copyright © READLY All rights reserved", 180, 490);
  }, [photoCardText, memberId, bookTitle, bookAuthor, photoCardCreatedDate]);

  function wrapText(context, text, maxWidth, maxLines = Infinity) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
      if (lines.length === maxLines - 1) {
        break;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  const isCurrentUser = user.loginId === memberId;
  console.log('user',user)
  console.log("Member ID:", memberId);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      {userInfo && (
        isCurrentUser ? (
          <Link
            to="/mypage"
            className="absolute bottom-9 left-5 flex items-center group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <User
              size={16}
              className="text-gray-600 mr-1 transition-transform duration-100 group-hover:scale-125"
            />
            <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">
              작성자: {userInfo.memberResponse.nickname}
            </span>
            {isHovered && (
              <span className="absolute left-full ml-2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap z-10 font-bold">
                마이페이지로 이동
              </span>
            )}
          </Link>
        ) : (
          <Link
            to={`/member/${memberId}`}
            className="absolute bottom-9 left-5 flex items-center group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <User
              size={16}
              className="text-gray-600 mr-1 transition-transform duration-100 group-hover:scale-125"
            />
            <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">
              작성자: {userInfo.memberResponse.nickname}
            </span>
            {isHovered && (
              <span className="absolute left-full ml-2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap z-10 font-bold">
                작성자 페이지로 이동
              </span>
            )}
          </Link>
        )
      )}
    </div>
  );
};

export default PhotocardBack;
