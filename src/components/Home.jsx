import React, { useEffect, useState, version } from 'react'
import { useSocket } from './Context/SocketContext'
import { useParams } from 'react-router-dom';
import UserVideos from './UserVideos';
import Editor from '@monaco-editor/react'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
const Home = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState("");
  const { socket, user, stream, remoteStreams, setRemoteStreams, handleCodeRef, handleLangRef } = useSocket();
  const { id } = useParams();
  const [output, setOutput] = useState("//Run Code for Output");
  const [input, setInput] = useState("");
  const [ececuting, setExecuting] = useState(false);
  const homeNavigator = useNavigate();
  async function handleCopyRoomId() {
    await navigator.clipboard.writeText(id);
  }
  const handleCodeChange = (newCode) => {
    handleCodeRef(newCode);
    setCode(newCode);
    socket.emit('code-change', { roomId: id, code: newCode });
  }
  const handleLanguageChange = (e) => {
    handleLangRef(e.target.value);
    setLanguage(e.target.value);

    socket.emit("langChange", { roomId: id, newLanguage: e.target.value });
  }
  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', { roomId: id });
    homeNavigator("/");
  }
  const handleExecuteCode = async () => {
    setExecuting(true);
    socket.emit("ececution-update", { roomId: id, code, language, version: '*', stdin: input });
  }
  useEffect(() => {
    if (socket) {
      socket.on('user-left', ({ peerId }) => {
        const updatedPeers = remoteStreams.filter((stream) => stream.peerId != peerId);
        setRemoteStreams(updatedPeers);
      });
      socket.on("codeUpdate", (code) => {
        handleCodeRef(code);
        setCode(code);
      });
      socket.on("langChange", (newLaguage) => {
        handleLangRef(newLaguage);
        setLanguage(newLaguage);
      });
      socket.on("ececution-update", ({ output }) => {
        setExecuting(false);
        setOutput(output);
      })
      socket.on()
      return () => {
        socket.off("codeUpdate");
        socket.off("user-left");
        socket.off("langChange");
        socket.off("ececution-update");
      }
    }
  }, [socket, code])
  return (
    <>
    <Navbar></Navbar>
    <div className='MainContainer'>
      <div className="sidebar">
        <div className="videoPannel">
          <b>Me</b>
          <UserVideos stream={stream}></UserVideos>
          <b>Other Participants</b>
          {remoteStreams.map(({ peerId, stream }) => (
            <UserVideos key={peerId} stream={stream} ></UserVideos>
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
          <button style={{ background: "green" }} onClick={handleCopyRoomId}>Copy Room Id</button>
          <br />
          <button style={{ background: "red" }} onClick={handleLeaveRoom}>Leave Room</button>
        </div>
      </div>
      <div className='EditorContainer'>
        <Editor height={"100%"} defaultLanguage={language} language={language} value={code} onChange={handleCodeChange} theme='vs-dark' options={{ minimap: { enabled: false }, fontSize: 25 }} ></Editor>
      </div>
      <div className='code-Execution'>
        <button className='runButton' onClick={handleExecuteCode} disabled={ececuting}>{ececuting ? "Executing.." : "RunCode"}</button>
        <div className="input-part">
          <h2>Input</h2>
          <textarea name="" id="" value={input} onChange={(e) => setInput(e.target.value)} placeholder='Add Input'> </textarea>
        </div>
        <div className="output-part">
          <h2>output</h2>
          <p>{ececuting ? "Executing code..." : output}</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home
