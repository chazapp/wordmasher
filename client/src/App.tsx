import React from 'react';
import { Box, Typography } from "@mui/material";
import Menu from "./components/Menu";

function App() {
  return (
    <Box id="app" sx={{
      width: "100vw",
      height: "100vh",
      backgroundColor: "black",
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
          backgroundColor: "darkblue",
          width: "50%",
          height: "50%",
          borderRadius: "15px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}>
          <Typography variant="h2">Play</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
