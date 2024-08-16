import JSZip from "jszip";
import saveIcon from "../../assets/iconimage/save.png";
import checkIcon from "../../assets/iconimage/check.png";
import "./shareIcon.css";

const ShareIcon = ({ onClick, icon, alt }) => {
  return (
    <button className="share-icon" onClick={onClick}>
      <img src={icon} alt={alt} />
    </button>
  );
};

const CardModal = ({
  isOpen,
  onClose,
  selectedCard,
  infoCard,
  combinedCard,
}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSaveImages = async () => {
    try {
      const [selectedCardBlob, infoCardBlob, combinedCardBlob] =
        await Promise.all([
          fetch(selectedCard).then((r) => r.blob()),
          fetch(infoCard).then((r) => r.blob()),
          fetch(combinedCard).then((r) => r.blob()),
        ]);

      const zip = new JSZip();
      zip.file("selected_card.png", selectedCardBlob);
      zip.file("info_card.png", infoCardBlob);
      zip.file("combined_card.png", combinedCardBlob);

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "photocard_images.zip";
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error);
      alert("이미지 저장에 실패했습니다.");
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl max-w-4xl w-full">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>
        <div className="flex justify-center space-x-8 mb-6">
          <img
            src={selectedCard}
            alt="Selected Card"
            className="w-[300px] h-[420px] object-cover rounded-lg"
          />
          <img
            src={infoCard}
            alt="Info Card"
            className="w-[300px] h-[420px] object-cover rounded-lg"
          />
        </div>
        <div className="flex justify-center space-x-24">
          <ShareIcon
            onClick={handleSaveImages}
            icon={saveIcon}
            alt="이미지 저장"
          />
          <ShareIcon
            onClick={handleCloseModal}
            icon={checkIcon}
            alt="그냥 저장"
          />
        </div>
      </div>
    </div>
  );
};

export default CardModal;