import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const getUserStream = async () => {
  
      const myStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setStream(myStream);
  };

  useEffect(() => {
    const id = uuidv4();
    const socketInst = io("http://localhost:3000");
    setSocket(socketInst);
    const newPeer = new Peer(id, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    setUser(newPeer);
    getUserStream(); 

    return () => {
      socketInst.disconnect();
      newPeer.destroy(); 
    };
  }, []);

  useEffect(() => {
    if (!user || !stream) return;
    socket.on('room-update', ({ peerId }) => {
      if (peerId === user.id) return;
      const call = user.call(peerId, stream);
      call.on('stream', (remoteStream) => {
        setRemoteStreams((prevStreams) => {
          if (!prevStreams.find((stream) => stream.peerId === peerId)) {
            return [...prevStreams, { peerId: call.peer, stream: remoteStream }];
          }
          return prevStreams;
        });
      });
    });
    user.on('call', (call) => {
      call.answer(stream);
      call.on('stream', (remoteStream) => {
        setRemoteStreams((prev) => {
          if (!prev.find((stream) => stream.peerId === call.peer)) {
            return [...prev, { peerId: call.peer, stream: remoteStream }];
          }
          return prev;
        });
      });
    });

  }, [user, stream, socket]);

  return (
    <SocketContext.Provider value={{ socket, user, stream, remoteStreams,setRemoteStreams }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
