package models

type Score struct {
	ID       uint   `json:"id" gorm:"primary_key"`
	Username string `json:"username"`
	Score    int64  `json:"score"`
}
