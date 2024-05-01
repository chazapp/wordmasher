package models

type Word struct {
	ID   uint   `json:"id" gorm:"primary_key"`
	Word string `json:"word" gorm:"primary_key"`
}
