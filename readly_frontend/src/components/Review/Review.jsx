

export default function Review({ bookImage, title, author, review }) {




  return (
    <div className="w-full h-full flex flex-col bg-[#F5F5F5] rounded-lg shadow-md overflow-hidden relative">
      <img src={bookImage} alt={title} className="w-full h-1/2 object-fill" />
      <div className="p-3 flex-grow flex flex-col">
        <h2 className="text-sm font-bold mb-1 truncate">{title}</h2>
        <p className="text-xs text-gray-600 mb-1">{author}</p>
        <p className="text-xs line-clamp-3 flex-grow overflow-hidden">{review}</p>
      </div>

    </div>
  );
}