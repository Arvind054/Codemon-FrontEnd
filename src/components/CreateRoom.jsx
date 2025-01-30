import React, { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from './Context/SocketContext';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
    const [roomId, setRoomId] = useState("");
    const [userName, setUserName] = useState("");
    const {socket, user} = useSocket();
    const navigator = useNavigate();
    useEffect(()=>{
       const id =  uuidv4();
       setRoomId(id);
    }, []);
    const handleCreateRoom = useCallback(()=>{
       if(roomId && userName&& user){
        socket.emit('join-room', {userName, roomId, peerId:user.id});
        navigator(`/room/${roomId}`);
       }else{
          // toast.error("RoomId or Username cannot be empty");
          navigator("/new");
       }
    },[roomId, userName, user]);
  return (
    <div className='main'>
       <div className="Userinput">
         <input type="text"  placeholder='Enter Room id' value={roomId} disabled />
         <input type="text" placeholder='Enter UserName' onChange={(e)=>{setUserName(e.target.value)}} value={userName}/>
         <p><button onClick={handleCreateRoom}>Create Room</button> <i>or </i> <a href="/">Join Room</a> </p>
       </div>
    </div>
  )
}

export default CreateRoom
