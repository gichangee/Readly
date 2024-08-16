export default function SimpleReview({ bookImage, reviewText }) {
  return (
    <div className="w-full h-[15rem] flex flex-col bg-[#eeeeee] rounded-lg shadow-md overflow-hidden relative">
      <img src={bookImage} alt="Book cover" className="w-[20rem] h-[11rem] object-fill" />
      <div className="p-3 flex-grow flex flex-col">
        <p className="text-md font-bold line-clamp-3 flex-grow overflow-hidden">{reviewText}</p>
      </div>
    </div>
  );
}