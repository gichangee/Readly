import levelIcon1 from "../../assets/level/lv1.png";
import levelIcon2 from "../../assets/level/lv2.png";
import levelIcon3 from "../../assets/level/lv3.png";
import levelIcon4 from "../../assets/level/lv4.png";
import catCoin from "../../assets/level/cat_coin.png";
import LogoutButton from "../Login/Logout";
import useUserStore from "../../store/userStore";

export default function Myheader() {
  const user = useUserStore((state) => state.user);

  const calculateLevel = (point) => {
    if (point < 1000) return 1;
    if (point < 2000) return 2;
    if (point < 3000) return 3;
    return 4;
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 1:
        return levelIcon1;
      case 2:
        return levelIcon2;
      case 3:
        return levelIcon3;
      case 4:
        return levelIcon4;
      default:
        return levelIcon1;
    }
  };

  const userLevel = calculateLevel(user.point);
  const levelIcon = getLevelIcon(userLevel);

  return (
    <header className="flex justify-between items-center py-1 px-3 bg-white">
      <div className="flex-cols items-center mr-2">
        <img className="w-13 h-10 mr-2" src={levelIcon} alt="level" />
        <p className="font-bold text-center text-xl">Lv{userLevel}</p>
      </div>
      <div>
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">{user.nickname}</h2>
          <a href="/update" className="ml-2 text-lg">
            ✏️
          </a>
        </div>
        <p className="text-base">{user.introduction}</p>
      </div>
      <div className="flex-1 flex flex-col justify-end items-end mr-6">
        <div className="flex-col items-center">
          <div className="flex justify-end mb-2">
            <span className="text-base font-bold">{user.point}</span>
            <img className="w-6 h-6 ml-2" src={catCoin} alt="coin" />
          </div>

          <div className="flex">
            <LogoutButton textColor="#878787" textSize="base" />
          </div>
        </div>
      </div>
    </header>
  );
}
