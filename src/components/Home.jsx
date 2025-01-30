import React, { useEffect, useState } from 'react'
import { useSocket } from './Context/SocketContext'
import { useParams } from 'react-router-dom';
import UserVideos from './UserVideos';
import Editor from '@monaco-editor/react'
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState("");
  const { socket, user, stream, remoteStreams, setRemoteStreams } = useSocket();
  const { id } = useParams();
  const homeNavigator = useNavigate();
  async function handleCopyRoomId(){
    await navigator.clipboard.writeText(id);
  }
  const handleCodeChange = (newCode)=>{
    //console.log("current code is ->", newCode);
    setCode(newCode);
    socket.emit('code-change', {roomId:id, code:newCode});
  }
  const handleLanguageChange = (e)=>{
   setLanguage(e.target.value);
  
   socket.emit("langChange", {roomId:id, newLanguage: e.target.value});
  }
  const handleLeaveRoom = ()=>{
    socket.emit('leaveRoom', {roomId:id});
    homeNavigator("/");
  }
  useEffect(()=>{
     if(socket){
      socket.emit("sync-code", {roomId:id});
     }
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on('user-left', ({ peerId }) => {
        const updatedPeers = remoteStreams.filter((stream) => stream.peerId != peerId);
        setRemoteStreams(updatedPeers);
      });
      socket.on("codeUpdate", (code)=>{
        setCode(code);
      });
      socket.on("langChange", (newLaguage)=>{
        setLanguage(newLaguage);
      });
      socket.on("sync-code", (code)=>{
           setCode(code);
      })
      return ()=>{
        socket.off("codeUpdate");
        socket.off("user-left");
        socket.off("langChange");
      }
    }
  }, [socket,code])
  return (
    <div className='MainContainer'>
      <div className="sidebar">
        <div className="videoPannel">
          <b>Me</b>
          <UserVideos stream={stream}></UserVideos>
          <b>Other Participants</b>
          {remoteStreams.map(({ peerId, stream }) => (
            <UserVideos key={peerId} stream={stream}></UserVideos>
          ))}
        </div>
        <div className="extras">
          <div className="language-selection">
         <label htmlFor="language-selection">Select language: </label>
        <select name="language-selection" id="language-selection" value={language} onChange={handleLanguageChange}>
          <option value="cpp">C++</option>
          <option value="python">python</option>
          <option value="java">java</option>
          <option value="javascript">javascript</option>
        </select>
        </div>
          <button style={{background:"green"}} onClick={handleCopyRoomId}>Copy Room Id</button>
          <br />
          <button style={{background:"red"}} onClick={handleLeaveRoom}>Leave Room</button>
        </div>
      </div>
      <div className='EditorContainer'>
          <Editor height={"100%"}  defaultLanguage={language} language={language} value={code} onChange={handleCodeChange} theme='vs-dark' options={{minimap:{enabled:false}, fontSize: 25} } ></Editor>
      </div>
    </div>
  )
}

export default Home
