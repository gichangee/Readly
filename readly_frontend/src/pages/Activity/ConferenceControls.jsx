// ConferenceControls.jsx
const ConferenceControls = ({
  isRoomCreated,
  openShareModal,
  isMicOn,
  toggleMic,
  isVideoOn,
  toggleVideo
}) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 ml-16 font-bold text-[#F0F0F0]">
    {isRoomCreated && (
      <>
        <button
          onClick={openShareModal}
          className="bg-[#a9dcf7] px-3 py-1 rounded-full shadow-lg text-sm"
        >
          공유하기
        </button>
        <button
          onClick={toggleMic}
          className={`${
            isMicOn ? "bg-[#a0faa0]" : "bg-[#808080]"
          } text-[#000000] px-3 py-1 rounded-full shadow-lg text-sm`}
        >
          {isMicOn ? "마이크 OFF" : "마이크 ON"}
        </button>
        <button
          onClick={toggleVideo}
          className={`${
            isVideoOn ? "bg-[#FF0000]" : "bg-[#808080]"
          } px-3 py-1 rounded-full shadow-lg text-sm`}
        >
          {isVideoOn ? "카메라 OFF" : "카메라 ON"}
        </button>
      </>
    )}
  </div>
);

export default ConferenceControls;