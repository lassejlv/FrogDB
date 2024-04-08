import WebSocket from 'ws'
import crypto from 'crypto'

const ws = new WebSocket(`ws://${process.env.DB_HOST}:${process.env.DB_PORT}/?username=${process.env.DB_USER}&password=${process.env.DB_PASS}`)


function createRequestId() {
  return crypto.randomUUID()
}

const pendingRequests = new Map()

function sendRequest(ws, requestData) {
  return new Promise((resolve, reject) => {
    // Generate a unique request ID
    const requestId =createRequestId();
    
    // Define a timeout for the request
    const timeout = setTimeout(() => {
      reject(new Error('Request timed out'));
      delete pendingRequests[requestId];
    }, 5000); // Adjust timeout duration as needed

    // Store the resolve function (and optionally, reject) in pendingRequests
    pendingRequests[requestId] = (response) => {
      clearTimeout(timeout); // Clear the timeout
      resolve(response); // Resolve the promise with the response
      delete pendingRequests[requestId]; // Cleanup
    };

    // Send the request with the requestId
    ws.send(JSON.stringify({
      id: requestId,
      ...requestData
    }));
  });
}


async function createSchema(ws) {
  try {
    const response = await sendRequest(ws, {
      type: 'SCHEMA_CREATE',
      data: {
        schema: 'test',
      }
    });
    console.log('Schema creation response:', response);
    // Now you can return this response, use it to update UI, etc.
  } catch (error) {
    console.error('Error creating schema:', error);
  }
}

ws.on('open', () => {
  console.log('Connected to database')
createSchema(ws); // Note: this is asynchronous

  
})

ws.on('message', (data) => {
  console.log('Received data:', data.toString())
})

ws.on('close', () => {
  console.log('Connection closed')
  process.exit(1)
})