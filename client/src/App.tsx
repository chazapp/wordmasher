import React from 'react';
import { Box } from "@mui/material";
import Menu from "./components/Menu";
import PlayCard from './components/PlayCard';

function App(props: {apiURL: string, clientVersion: string}) {
  const { apiURL }= props;

  return (
    <Box id="app" sx={{
      width: "100vw",
      height: "100vh",
      backgroundImage: 'url("/background.png")',
      backgroundSize: "cover",
      display: "flex",
      flexDirection: "row"
    }}>
      <Box id="breathing-room" sx={{width: "15vw", height: "100vh"}} />
      <Menu />
      <Box id="play-area" sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%"
      }}>
        <Box id="play-card" sx={{
          backgroundColor: "#5e5d5d",
          width: "50%",
          height: "50%",
          borderRadius: "30px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}>
          <PlayCard apiURL={apiURL} />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
