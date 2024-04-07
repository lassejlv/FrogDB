import WebSocket from 'ws'

const DATBASE_URL = 'ws://localhost:8080/?username=root&password=password123'

const ws = new WebSocket(DATBASE_URL)

ws.on('open', () => {
  console.log('Connected to database')


  ws.send("Hello, database!")
})

ws.on('message', (data) => {
  console.log('Received data:', data.toString())
})

ws.on('close', () => {
  console.log('Connection closed')
})