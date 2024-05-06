import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography } from "@mui/material";
import { httpUrlToWebSocketUrl } from '../utils';

enum GameState {
    NICKNAME,
    PLAY
}

export default function PlayCard(props: {apiURL: string}) {
    const { apiURL } = props;
    const [nickInput, setNickInput] = useState<string>("");
    const [answerInput, setAnswerInput] = useState<string>("");
    const [gameState, setGameState] = useState<GameState>(GameState.NICKNAME);
    const [webSocket, setWebSocket] = useState<WebSocket | undefined>(undefined)
    const [errMessage, setErrMessage] = useState<string>('')
    const [mash, setMash] = useState<string>('');

    useEffect(() => {
        if (webSocket !== undefined) {
          return
        }
        const ws = new WebSocket(`${httpUrlToWebSocketUrl(apiURL)}/ws`)
        ws.onerror = (event) => {
          setErrMessage('WebSocket error !')
        }
        ws.onmessage = (event) => {
          console.log(event.data)
          setGameState(GameState.PLAY);
          const msg = JSON.parse(event.data);
          if (msg.hasOwnProperty("wordmash")) {
            setMash(msg.wordmash);
          } else if (msg.hasOwnProperty("success")) {
            if (msg.success) {
                console.log("Success !");
            } else {
                console.log("fail!");
            }
          }

        }
        setWebSocket(ws)
      }, [apiURL, webSocket]);


    const handleSubmitNick = ((nick: string) => {
        if (webSocket) {
            webSocket.send(JSON.stringify({nickname: nick}))
        }
    });

    const handleSubmitAnswer = ((answer: string) => {
        if (webSocket) {
            webSocket.send(JSON.stringify({answer: answer}));
        }
    })


    switch (gameState) {
        case GameState.NICKNAME:
            return (
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "2vh"
                }}>
                    {errMessage && (
                        <Typography variant="h5" color="error">{errMessage}</Typography>
                    )}
                    <TextField 
                        label="Nickname" variant="outlined" autoComplete="off"
                        disabled={errMessage !== "" ? true : false}
                        inputProps={{ style: {textAlign: 'center'} }}
                        sx={{
                            "& label.Mui-focused": {
                                color: "black",
                            },
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "black"
                              }
                            }
                        }}
                        onChange={(event) => setNickInput(event.target.value)}
                        value={nickInput}
                        onKeyDown={(ev) => {
                            if (ev.key === "Enter") {
                                handleSubmitNick(nickInput)
                                ev.preventDefault()
                            }
                        }}
                        />
                </Box>
            );
        case GameState.PLAY:
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "2vh"
                    }}
                >
                    <Typography>{mash}</Typography>
                    <TextField 
                        label="Answer" variant="outlined" autoComplete="off"
                        inputProps={{ style: {textAlign: 'center'} }}
                        sx={{
                            "& label.Mui-focused": {
                                color: "black",
                            },
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "black"
                              }
                            }
                        }}
                        onChange={(event) => setAnswerInput(event.target.value)}
                        value={answerInput}
                        onKeyDown={(ev) => {
                            if (ev.key === "Enter") {
                                handleSubmitAnswer(answerInput);
                                setAnswerInput("");
                                ev.preventDefault();
                            }
                        }}
                        />
                </Box>
            )
    }
}