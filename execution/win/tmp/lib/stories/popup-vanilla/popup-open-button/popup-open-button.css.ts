import { style } from "@vanilla-extract/css";

const popupOpenButtonStyles = {
    button: style({
        padding: "8px 16px",
        backgroundColor: "#e2e8f0",
        borderRadius: 4,
        cursor: "pointer",
        border: "none",
        fontSize: 14,
        selectors: {
            "&:hover": {
                backgroundColor: "#cbd5e1"
            }
        }
    })
};

export default popupOpenButtonStyles;
