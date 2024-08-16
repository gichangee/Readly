import Modal from "react-modal";

Modal.setAppElement("#root");

const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    width: "80%",
    maxWidth: "800px",
    height: "80%",
    maxHeight: "80vh",
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#F5F5F5",
    padding: "20px",
    overflow: "auto",
  },
};

export default function BookshelfList({ isOpen, onRequestClose, books }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      closeTimeoutMS={300}
    >
      <button
        onClick={onRequestClose}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
      <h2 className="text-2xl font-bold mb-4">읽은 책들이에요!</h2>
      <div className="space-y-6">
        {books && books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="flex bg-[#fdf9f9] p-4 rounded-lg shadow">
              <img
                src={book.image}
                alt={book.title}
                className="w-32 h-48 object-cover mr-4"
              />
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-2 mb-2">
                  <p className="font-bold text-xl">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {book.detail}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>아직 읽은 책이 없습니다.</p>
        )}
      </div>
    </Modal>
  );
}