const ranking = [
  { id: 1, ranking: "🥇" },
  { id: 2, ranking: "🥈" },
  { id: 3, ranking: "🥉" },
];

const PersonalRanking = ({ personalRanking, currentUser, userSpecificRank }) => {
  console.log("PersonalRanking props:", { personalRanking, currentUser, userSpecificRank });

  return (
    <ol className="space-y-4">
      {personalRanking.slice(0, 3).map((item, index) => (
        <li
          key={item.id}
          className={`flex items-center justify-between ${
            index === 0 ? "text-3xl font-bold" : "text-lg"
          }`}
        >
          <div className="flex items-center">
            <span className="text-2xl mr-2">{ranking[index].ranking}</span>{" "}
            {item.memberName}
          </div>
          <span className={index === 0 ? "text-[#B73D3D]" : "text-[#868686]"}>
            {item.readBookCount}권
          </span>
        </li>
      ))}
      <li className="ml-2">...</li>
      <li className="ml-2.5">..</li>
      {userSpecificRank && (
        <li className="text-sm font-bold p-2 text-[#878787] flex items-center justify-between">
          <div>
            현재 {currentUser.nickname}님의 전체 랭킹은 {userSpecificRank.rank}등 입니다
          </div>
          <span className="text-[#868686]">
            {userSpecificRank.readBookCount}권
          </span>
        </li>
      )}
    </ol>
  );
};

export default PersonalRanking;