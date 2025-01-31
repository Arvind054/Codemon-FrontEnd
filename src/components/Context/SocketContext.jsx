import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const userRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);  
  const codeRef = useRef(null); 
  const langRef = useState(null);
  const getUserStream = async () => {
  
      const myStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setStream(myStream);
  };

  useEffect(() => {
    const id = uuidv4();
    const socketInst = io("http://localhost:3000");
    socketRef.current = socketInst;
    const newPeer = new Peer(id, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    userRef.current = newPeer;
    getUserStream(); 

    return () => {
      socketInst.disconnect();
      newPeer.destroy(); 
    };
  }, []);
  const handleCodeRef = (code)=>{
     codeRef.current = code;
  }
  const handleLangRef = (lang)=>{
     langRef.current = lang;
  }
  useEffect(() => {
    if (!userRef.current || !stream) return;
    socketRef.current.on('room-update', ({ peerId, socketId }) => {
      if (peerId === userRef.current.id) return;
      const call = userRef.current.call(peerId, stream);
      call.on('stream', (remoteStream) => {
        setRemoteStreams((prevStreams) => {
          if (!prevStreams.find((stream) => stream.peerId === peerId)) {
            return [...prevStreams, { peerId: call.peer, stream: remoteStream }];
          }
          return prevStreams;
        });
        socketRef.current.emit("sync-code", ({socketId, code:codeRef.current,newLanguage:langRef.current}));
      });
    });
    userRef.current.on('call', (call) => {
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

  }, [userRef.current, stream, socketRef.current]);

  return (
    <SocketContext.Provider value={{ socket:socketRef.current, user:userRef.current, stream, remoteStreams,setRemoteStreams,handleCodeRef,handleLangRef}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
