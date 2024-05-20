package ws

type NickMessage struct {
	Nick string `json:"nickname"`
}

type WordmashMessage struct {
	Wordmash string `json:"wordmash"`
}

type AnswerMessage struct {
	Answer  string `json:"answer"`
	Command string `json:"command"`
}

type SuccessMessage struct {
	Success bool `json:"success"`
}

type ScoreMessage struct {
	Nick  string `json:"nick"`
	Score int    `json:"score"`
}

type HintMessage struct {
	Hint string `json:"hint"`
}
