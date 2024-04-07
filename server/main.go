package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

// const (
// 	STRING  = "string"
// 	NUMBER  = "number"
// 	BOOLEAN = "boolean"
// 	OBJECT  = "object"
// 	ARRAY   = "array"
// 	NULL    = "null"
// )

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
		// show message
		log.Printf("Received message: %s", message)

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

	// var dbUser = os.Getenv("DB_USER")
	// var dbPass = os.Getenv("DB_PASS")

	http.HandleFunc("/", websocketHandler)
	log.Println("Listen on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
