/**
 * Exemplo de servidor WebSocket simples para testes
 * 
 * Para usar este exemplo:
 * 1. npm install ws
 * 2. node test-websocket-server.js
 * 3. Configure .env para WS_BASE_URL=ws://localhost:8080
 */

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080, path: '/gps-ws' });

console.log('🚀 Servidor WebSocket de teste rodando em ws://localhost:8080/gps-ws');

// Dados de exemplo para Natal/RN
const generateRandomLocation = () => {
  const baseLatitude = -5.795;  // Latitude de Natal
  const baseLongitude = -35.21; // Longitude de Natal
  
  return {
    latitude: baseLatitude + (Math.random() - 0.5) * 0.02,
    longitude: baseLongitude + (Math.random() - 0.5) * 0.02,
    altitude: 50 + Math.random() * 100,
    speed: Math.random() * 80,
    timestamp: new Date().toISOString()
  };
};

wss.on('connection', (ws) => {
  console.log('📱 Cliente conectado');
  let intervalId = null;

  ws.on('message', (message) => {
    const command = message.toString();
    console.log('📤 Comando recebido:', command);

    if (command === 'start') {
      console.log('▶️ Iniciando envio de localizações');
      
      // Enviar algumas localizações iniciais
      const initialLocations = Array.from({length: 3}, generateRandomLocation);
      ws.send(JSON.stringify(initialLocations));
      
      // Enviar novas localizações a cada 5 segundos
      intervalId = setInterval(() => {
        const newLocations = [generateRandomLocation()];
        ws.send(JSON.stringify(newLocations));
        console.log('📊 Localização enviada:', newLocations[0]);
      }, 5000);
      
    } else if (command === 'stop') {
      console.log('⏹️ Parando envio de localizações');
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  });

  ws.on('close', () => {
    console.log('📱 Cliente desconectado');
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
});
