import { Box, Typography } from "@mui/material";

export default function Menu(props: any) {
    return (
        <Box id="menu" sx={{
            width: "20vw",
            height: "100vh",
            backgroundColor: "#973302",
            display: "flex",
            flexDirection: "column",
            gap: "5vh",
            alignItems: "center"
        }}>
            <Box id="logo" component="img"
            alt="logo"
            src="/logo_chaz.png"
            sx={{
                width: "100%",
                height: "10%",
                objectFit: "contain"
            }}
            />
            <Typography variant="h2">Scores</Typography>
        </Box>
    );
}