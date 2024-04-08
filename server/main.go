package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

const (
	SCHEMA_CREATE = "SCHEMA_CREATE"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func websocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	username := r.URL.Query().Get("username")
	password := r.URL.Query().Get("password")

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")

	if username != dbUser || password != dbPass {
		log.Println("Unauthorized")
		conn.WriteMessage(websocket.TextMessage, []byte("Unauthorized"))
		conn.Close()
		return
	}

	fmt.Println(username, password)

	for {
		// read message from client
		_, message, err := conn.ReadMessage()

		if err != nil {
			log.Println(err)
			break
		}

		// get "type" and "data" from message as JSON
		var msg map[string]interface{}

		err = json.Unmarshal(message, &msg)
		if err != nil {
			log.Println(err)
			break
		}

		// get "type" and "data" from message
		msgType := msg["type"].(string)
		msgRequestId := msg["requestId"].(string)
		// msgData := msg["data"]

		switch msgType {
		case SCHEMA_CREATE:
			log.Println("Schema Create")
			// Return response to client with a json object
			obj := map[string]interface{}{
				"requestId": msgRequestId,
				"status":    "success",
				"message":   "Schema Created",
			}

			// Convert object to JSON
			jsonObj, err := json.Marshal(obj)

			if err != nil {
				log.Println(err)
				break
			}

			// Send JSON to client
			conn.WriteMessage(websocket.TextMessage, jsonObj)

		default:
			conn.WriteMessage(websocket.TextMessage, []byte("INVALID_MESSAGE_TYPE"))
		}

		//send message to client
		err = conn.WriteMessage(websocket.TextMessage, []byte("Hello Client"))
		if err != nil {
			log.Println(err)
			break
		}

	}
}

func main() {
	err := godotenv.Load() // 👈 load .env file

	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/", websocketHandler)
	log.Println("Listen on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
