import { style, keyframes } from "@vanilla-extract/css";

// shared rotation keyframes used by multiple loaders
const rotation = keyframes({
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
});

const loadingStyle = {
    container: style({
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    }),
    spinner: style({
        width: "48px",
        height: "48px",
        border: "5px solid #FFF",
        borderBottomColor: "#3498db",
        borderRadius: "50%",
        display: "inline-block",
        boxSizing: "border-box",
        animation: `${rotation} 1s linear infinite`
    })
};

export default loadingStyle;
