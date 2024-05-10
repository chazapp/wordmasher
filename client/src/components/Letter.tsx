import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Submit } from "./PlayCard";

export default function Letter(props: { letter: string, submitState: Submit }) {
    const { letter, submitState } = props;
    const [bgAnimClass, setBgAnimClass] = useState<string>("");

    useEffect(() => {
        switch (submitState) {
            case Submit.SUCCESS:
                setBgAnimClass("fade-success");
                break;
            case Submit.FAIL:
                setBgAnimClass("fade-fail");
                break;
            case Submit.NEUTRAL:
                setBgAnimClass("");
                break;
        }
    }, [submitState])
    return (
        <Paper className={bgAnimClass} elevation={3} sx={{
            padding: "5%",
            border: "0.15rem solid black",
            backgroundColor: "yellow"
        }}>
            <Typography sx={{textTransform: "uppercase", fontWeight: "bold"}}>{letter}</Typography>
        </Paper>
    )
}