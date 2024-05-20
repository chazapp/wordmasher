import React, { useEffect, useState } from 'react';
import { Box, IconButton, TextField, Typography } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import CachedIcon from '@mui/icons-material/Cached';
import { httpUrlToWebSocketUrl } from '../utils';
import Letter from './Letter';
import Quiz from '@mui/icons-material/Quiz';

enum GameState {
    NICKNAME,
    PLAY
}

export enum Submit {
    NEUTRAL,
    SUCCESS,
    FAIL
}

export default function PlayCard(props: {apiURL: string}) {
    const { apiURL } = props;
    const [nickInput, setNickInput] = useState<string>("");
    const [answerInput, setAnswerInput] = useState<string>("");
    const [gameState, setGameState] = useState<GameState>(GameState.NICKNAME);
    const [webSocket, setWebSocket] = useState<WebSocket | undefined>(undefined)
    const [errMessage, setErrMessage] = useState<string>('')
    const [mash, setMash] = useState<string>('');
    const [submitState, setSubmitState] = useState<Submit>(Submit.NEUTRAL);
    const [hint, setHint] = useState<string>("");

    useEffect(() => {
        if (webSocket !== undefined) {
          return
        }
        const ws = new WebSocket(`${httpUrlToWebSocketUrl(apiURL)}/ws`)
        ws.onerror = (event) => {
          setErrMessage('WebSocket error !')
        }
        ws.onmessage = (event) => {
          setGameState(GameState.PLAY);
          const msg = JSON.parse(event.data);
          if (msg.hasOwnProperty("wordmash")) {
            setMash(msg.wordmash);
          } else if (msg.hasOwnProperty("hint")) {
            setHint(msg.hint);
          } else if (msg.hasOwnProperty("success")) {
            if (msg.success === true) {
                setSubmitState(Submit.SUCCESS);
                setHint("");
            } else {
                setSubmitState(Submit.FAIL);
            }
            setTimeout(() => {
                setSubmitState(Submit.NEUTRAL);
            }, 1000);
          } 
        }
        setWebSocket(ws);
      }, [apiURL, webSocket]);


    const handleSubmitNick = ((nick: string) => {
        if (webSocket) {
            webSocket.send(JSON.stringify({nickname: nick}));
        }
    });

    const handleSubmitAnswer = ((answer: string) => {
        if (webSocket) {
            webSocket.send(JSON.stringify({answer: answer}));
        }
    });

    const handleSubmitRefresh = (() => {
        if (webSocket) {
            webSocket.send(JSON.stringify({command: "refresh"}));
            setHint("");
        }
    });

    const handleClientShuffle = (() => {
        const shuffle = () => [...mash].sort(()=>Math.random()-.5).join('');
        setMash(shuffle);
    })

    const handleRequestHint = (() => {
        if (webSocket) {
            webSocket.send(JSON.stringify({command: "hint"}));
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
                        gap: "5vh",
                        width: "100%",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        flexBasis: "auto"
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        flexBasis: "auto",
                        width: "100%",
                    }}>
                        {[...mash].map((c, idx) => {
                            return (
                                <Letter letter={c} submitState={submitState} key={idx} />
                            )
                        })}
                    </Box>
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
                    <Box sx={{
                        margin: "0 auto",
                        width: "80%",
                        textAlign: "center"
                    }}>
                        {hint !== "" && <Typography variant="subtitle1" sx={{fontStyle: "italic"}}>{hint}</Typography>}
                    </Box>    
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        <IconButton aria-label="refresh" size="large" onClick={handleSubmitRefresh}>
                            <RefreshIcon fontSize="inherit"/>
                        </IconButton>
                        <IconButton aria-label="shuffle" size="large" onClick={handleClientShuffle}>
                            <CachedIcon fontSize="inherit"/>
                        </IconButton>
                        <IconButton aria-label="hint" size="large" onClick={handleRequestHint}>
                            <Quiz fontSize="inherit"/>
                        </IconButton>
                    </Box>
                </Box>
            )
    }
}