import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { WebSocketHookReturnType } from './useWebSocket.type';

const useWebSocket = (
  url: string,
  eventOnConnect?: string
): WebSocketHookReturnType => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const connectionOptions = {
      secure: true,
      rejectUnauthorized: false,
      transports: ['websocket', 'polling', 'flashsocket'],
    };
    const newSocket = io(url, connectionOptions);

    newSocket.on('connect', () => {
      toast.success('WebSocket connected');
      setIsConnected(true);
      if (eventOnConnect) {
        newSocket.emit(eventOnConnect);
      }
    });

    newSocket.on('disconnect', () => {
      toast.error('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('close', (error: Error) => {
      toast.error(`WebSocket error: ${error}`);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  return { socket, isConnected };
};

export default useWebSocket;
