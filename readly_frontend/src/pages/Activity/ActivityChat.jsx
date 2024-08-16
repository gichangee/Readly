import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import useUserStore from '../../store/userStore';
import { BASE_URL } from '../../api/authAPI';

let stompClient = null;

const ActivityChat = ({ groupId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useUserStore(); // Access user data from the store

  useEffect(() => {
    if (groupId) {
      connect(groupId);
    }
    return () => {
      disconnect();
    };
  }, [groupId]);

  useEffect(() => {
    if (isConnected && groupId) {
      stompClient.subscribe(`/topic/messages/${groupId}`, (message) => {
        if (!isHistoryLoading) {
          showMessage(JSON.parse(message.body));
        }
      });

      fetchHistory(groupId);
    }
  }, [isConnected, groupId]);

  const connect = () => {
    stompClient = new Client({
      brokerURL: 'wss://i11c207.p.ssafy.io/gs-guide-websocket',
    });

    stompClient.onConnect = (frame) => {
      setIsConnected(true);
      console.log('Connected: ' + frame);
    };

    stompClient.onWebSocketError = (error) => {
      console.error('Error with websocket', error);
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
  };

  const fetchHistory = async (roomId) => {
    try {
      setIsHistoryLoading(true);
      const response = await axios.get(`${BASE_URL}/history/${roomId}`);
      const fetchedMessages = Array.isArray(response.data) ? response.data : [];
      showHistory(fetchedMessages);
      setIsHistoryLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setIsHistoryLoading(false);
    }
  };

  const disconnect = () => {
    if (stompClient !== null) {
      stompClient.deactivate();
    }
    setIsConnected(false);
    console.log('Disconnected');
  };

  const sendMessage = () => {
    if (stompClient !== null && message.trim() !== '') {
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify({
          roomId: groupId,
          from: user.nickname,
          content: message,
        }),
      });
      setMessage('');
    }
  };

  const showMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const showHistory = (messages) => {
    setMessages(messages);
  };

  return (
    <div className="container mt-3" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
      <div className="card" style={{ flex: 1, overflowY: 'scroll', marginBottom: '1rem' }}>
        <div className="card-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${msg.from === user.nickname ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className="p-2 rounded"
                style={{
                  backgroundColor: msg.from === user.nickname ? '#ADD8E6' : '#f8f9fa', // 연한 파란색: '#ADD8E6'
                  color: msg.from === user.nickname ? '#000' : '#000', // 글자색 검정으로 통일
                }}
              >
                <strong>{msg.from}:</strong> {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ActivityChat;
