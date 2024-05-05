package ws

type NickMessage struct {
	Nick string `json:"nick"`
}

type WordmashMessage struct {
	Wordmash string `json:"wordmash" binding:"required"`
}

type AnswerMessage struct {
	Answer string `json:"answer"`
}

type SuccessMessage struct {
	Success bool `json:"success"`
}

type ScoreMessage struct {
	Nick  string `json:"nick"`
	Score int    `json:"score"`
}
