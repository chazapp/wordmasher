package ws

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
)

type Definition struct {
	Meanings []Meaning `json:"meanings"`
}

type Meaning struct {
	Definitions []Def `json:"definitions"`
}

type Def struct {
	Definition string `json:"definition"`
}

// GetWordDefinition returns the word definition from the Free Dictionary API
func GetWordDefinition(word string) string {
	url := fmt.Sprintf("https://api.dictionaryapi.dev/api/v2/entries/en/%s", word)
	resp, err := http.Get(url)
	if err != nil || resp.StatusCode != 200 {
		return "No definition for this word"
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "No definition for this word"
	}

	var definitions []Definition
	err = json.Unmarshal(body, &definitions)
	if err != nil || len(definitions) == 0 || len(definitions[0].Meanings) == 0 || len(definitions[0].Meanings[0].Definitions) == 0 {
		return "No definition for this word"
	}

	return definitions[0].Meanings[0].Definitions[0].Definition
}

// SanitizeDefinition replaces occurrences of the word in the definition with asterisks
func SanitizeDefinition(word, definition string) string {
	pattern := fmt.Sprintf(`(?i)\b%s\b`, regexp.QuoteMeta(word))
	re := regexp.MustCompile(pattern)
	sanitizedDefinition := re.ReplaceAllStringFunc(definition, func(m string) string {
		return strings.Repeat("*", len(m))
	})
	return sanitizedDefinition
}
