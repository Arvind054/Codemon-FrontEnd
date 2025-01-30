import { createContext, useEffect, useState } from "react";
import peer from 'peerjs'
const PeerContext = createContext();

const PeerProvider = ({children})=>{
    const [peer, setPeer] = useState(null);
    const [myId, setMyId] = useState(null);
    useEffect(()=>{
        
    })
}