import React, { useState, useCallback } from 'react'
import { useSocket } from './Context/SocketContext';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const {socket, user} = useSocket();
  const navigator = useNavigate();
  
  const handleJoinRoom = useCallback(() => {
    if (roomId && userName&&user ) {
      socket.emit('join-room', { userName, roomId, peerId:user.id });
      navigator(`/room/${roomId}`);
    } else {
      // toast.error("RoomId or Username cannot be empty");
      navigator("/");
    }
    
  }, [roomId, userName, user])
  return (
    <div className='main'>
      <div className="Userinput">
        <input type="text" placeholder='Enter Room id' value={roomId} onChange={(e) => { setRoomId(e.target.value) }} />
        <input type="text" placeholder='Enter UserName' onChange={(e) => { setUserName(e.target.value) }} value={userName} />
        <p><button onClick={handleJoinRoom}>Join Room</button > <i>or </i> <a href="/new">Create Room</a> </p>

      </div>
    </div>
  )
}

export default JoinRoom
