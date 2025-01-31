import React, { useEffect, useRef } from 'react'
const UserVideos = ({stream}) => {
  const videoRef = useRef(null);
  useEffect(()=>{
   if(videoRef.current && stream){
    videoRef.current.srcObject = stream;
   }
  }, [stream])
  return (
    <video ref={videoRef} style={{width:'200px'}} muted autoPlay className="remoteVideos"></video>
  )
}

export default UserVideos
