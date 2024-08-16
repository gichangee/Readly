const VideoConferenceView = ({
  publisher,
  subscribers,
  sharedItems,
  isMicOn,
  isIShared,
  notification,
}) => {
  const allParticipants = publisher ? [publisher, ...subscribers] : subscribers;
  const hasSharedItems = sharedItems.length > 0;

  const getGridDimensions = (count) => {
    if (count <= 3) return { cols: 3, rows: 1 };
    if (count <= 6) return { cols: 3, rows: 2}
    if (count <= 9) return { cols: 4, rows: 2 };
    if (count <= 12) return { cols: 4, rows: 3}
    return { cols: 4, rows: Math.ceil(count / 4) };
  };

  const { cols, rows } = getGridDimensions(allParticipants.length);

  const ParticipantVideo = ({ stream, clientData, isMicOn }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative w-full h-full">
      <video
        autoPlay={true}
        ref={(video) => video && stream.addVideoElement(video)}
        className="object-cover w-full h-full"
      />
      <p className="absolute bottom-1 left-1 text-white bg-black bg-opacity-50 px-1 py-0.5 rounded text-xs">
        {clientData}
      </p>
      <p className="absolute bottom-1 right-1 text-white bg-black bg-opacity-50 px-1 py-0.5 rounded text-xs">
        {isMicOn ? "Mic On" : "Mic Off"}
      </p>
    </div>
  );

  return (
    <div className="bg-[#F5F5F5] rounded-lg p-4 mb-4 h-[600px] overflow-hidden relative">
      {notification && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded z-50">
          {notification}
        </div>
      )}
      <div className="flex h-full">
        {hasSharedItems && (
          <div className="w-3/4 pr-2 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-3">공유된 아이템</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {sharedItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden relative h-36 sm:h-52 md:h-60"
                >
                  <img
                    src={item.photocardImage || item.bookImage}
                    alt={item.photocardText || item.bookTitle}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover"
                  />
                  <p className="absolute bottom-1 left-1 text-white bg-black bg-opacity-50 px-1 py-0.5 rounded text-xs sm:text-sm">
                    {item.photocardText || item.reviewText}
                  </p>
                  {isIShared(item)}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={`${hasSharedItems ? 'w-3/4' : 'w-full '} pl-2`}>
          <h3 className="text-xl font-semibold mb-3">참가자</h3>
          <div 
            className="grid gap-2 h-[calc(55%)] overflow-y-auto"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 2fr)`,
            }}
          >
            {allParticipants.map((participant, index) => (
              <ParticipantVideo
                key={index}
                stream={participant}
                clientData={JSON.parse(participant.stream.connection.data).clientData}
                isMicOn={participant === publisher ? isMicOn : participant.stream.audioActive}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConferenceView;