package ws

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/chazapp/wordmasher/server/metrics"
	"github.com/chazapp/wordmasher/server/models"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

var (
	WsReadBufferSize  = 1024
	WsWriteBufferSize = 1024
	WsTimeoutSeconds  = 10
	ChannelSize       = 255
	writeWait         = 10 * time.Second
	pongWait          = 10 * time.Second
	pingPeriod        = (pongWait * 9) / 10
	wsupgrader        = websocket.Upgrader{
		ReadBufferSize:  WsReadBufferSize,
		WriteBufferSize: WsWriteBufferSize,
		CheckOrigin: func(_ *http.Request) bool {
			return true
		},
	}
)

type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	nickname *string
}

type Hub struct {
	clients map[*Client]bool
	db      *gorm.DB
}

func NewHub(db *gorm.DB) *Hub {
	metrics.WSClients.Set(0)

	return &Hub{
		clients: make(map[*Client]bool),
		db:      db,
	}
}

// This methods checks heartbeats of every connection and
// closes connections that do not answer ping messages
func (h *Hub) Heartbeat() {
	ticker := time.NewTicker(pingPeriod)
	defer ticker.Stop()

	log.Info().Msg("Starting heartbeat loop")
	for {
		select {
		case <-ticker.C:
			for client := range h.clients {
				go func(client *Client) {
					client.conn.SetWriteDeadline(time.Now().Add(writeWait))
					if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
						log.Err(err)
						delete(h.clients, client)
					}
				}(client)
			}
		}
	}
}

// HTTP Handler for /ws endpoint
func (h *Hub) WsHandler(c *gin.Context) {
	conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Err(err)
		return
	}
	log.Info().Msg("User has connected")
	conn.SetReadDeadline(time.Now().Add(pongWait))
	conn.SetPongHandler(func(string) error { conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	client := &Client{hub: h, conn: conn}
	h.clients[client] = true
	go client.GameSession()
}

// GameSession handles the business logic for a connected client
func (c *Client) GameSession() {
	defer c.conn.Close()

	log.Info().Msg("Created Game Session")
	// Get user nickname
	nickMessage := NickMessage{}
	log.Info().Msg("Waiting for player nickname")
	err := c.conn.ReadJSON(&nickMessage)
	if err != nil {
		log.Err(err).Msg("")
		return
	}
	c.nickname = &nickMessage.Nick
	log.Info().Msgf("Nick joined: %s", *c.nickname)
	// Game loop
	for {
		// Create a wordmash
		w := models.Word{}
		c.hub.db.Order("random()").Find(&w)
		wmM := WordmashMessage{Wordmash: ShuffleWord(w.Word)}
		for {
			// Send wordmash
			log.Info().Msgf("Sending mash")
			if err := c.conn.WriteJSON(&wmM); err != nil {
				log.Err(err).Msg("")
				return
			}
			// Await answer
			aM := AnswerMessage{}
			log.Info().Msgf("Awaiting answer")
			if err := c.conn.ReadJSON(&aM); err != nil {
				log.Err(err).Msg("")
				return
			}
			if aM.Answer == w.Word {
				// Send success message
				if err := c.conn.WriteJSON(SuccessMessage{Success: true}); err != nil {
					log.Err(err).Msg("")
					return
				}
				break
			}
			if err := c.conn.WriteJSON(SuccessMessage{Success: false}); err != nil {
				log.Err(err).Msg("")
				return
			}
		}
		// Score up
		c.ScoreUp()
	}
}

func (c *Client) ScoreUp() {

}

func ShuffleWord(word string) string {
	characters := []rune(word)
	rand.Shuffle(len(characters), func(i, j int) {
		characters[i], characters[j] = characters[j], characters[i]
	})
	if string(characters) == word {
		return ShuffleWord(word)
	}
	return string(characters)
}
