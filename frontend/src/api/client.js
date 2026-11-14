import axios from 'axios';
import { Platform } from 'react-native';

// REPLACE with your current laptop IPv4 from your hotspot (run ipconfig to check)
const LOCAL_IP = '192.168.68.112'; 
const PORT = '5000';

const baseURL =
  Platform.OS === 'web'
    ? `http://localhost:${PORT}/api/todos`
    : `http://${LOCAL_IP}:${PORT}/api/todos`;

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;