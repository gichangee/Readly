import './follow_btn.css';

const FollowButton = ({ onClick }) => {
  return (
    <label className="follow-btn-container" onClick={onClick}>
      <input type="checkbox" defaultChecked />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="50px" width="50px" className="like">
        <path d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"></path>
      </svg>
      <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" className="celebrate">
        <polygon points="0,0 10,10"></polygon>
        <polygon points="0,25 10,25"></polygon>
        <polygon points="0,50 10,40"></polygon>
        <polygon points="50,0 40,10"></polygon>
        <polygon points="50,25 40,25"></polygon>
        <polygon points="50,50 40,40"></polygon>
      </svg>
    </label>
  );
};

export default FollowButton;
