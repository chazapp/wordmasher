import React from 'react';
import { Box, Typography } from "@mui/material";
import Menu from "./components/Menu";
import PlayCard from './components/PlayCard';

function App(props: {apiURL: string, clientVersion: string}) {
  const { apiURL }= props;

  return (
    <Box id="app" sx={{
      width: "100vw",
      height: "100vh",
      backgroundImage: 'url("/textures/blue.png")',
      backgroundSize: "cover",
      display: "flex",
      flexDirection: "row"
    }}>
      <Box id="mobile-title" sx={{
        display: "none", width: "100%", height: "10vh",  backgroundImage: 'url("/textures/orange.png")',
        backgroundColor: "#973302", alignItems: "center", justifyContent: "center"
      }}>
        <Typography variant="h3">WordMasher</Typography>
      </Box>
      <Box id="breathing-room" sx={{width: "5vw", height: "100vh"}} />
      <Menu />
      <Box id="play-area" sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%"
      }}>
        <Box id="play-card" sx={{
          backgroundImage: 'url("/textures/light_blue.png")',
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
