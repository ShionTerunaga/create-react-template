import { style } from "@vanilla-extract/css";

const sidebarStyle = {
    container: style({
        width: "200px",
        height: "100vh",
        padding: 10,
        borderRight: "2px solid #333",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        background: "#0b0b0b",
        color: "#fff"
    }),

    nav: style({
        padding: 0,
        margin: 0,
        flex: 1,
        overflowY: "auto"
    }),

    list: style({
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 6
    }),

    menuItem: style({
        margin: 0,
        padding: 0
    }),

    menuItemActive: style({
        background: "rgba(255,255,255,0.04)",
        borderRadius: 6
    }),

    menuButton: style({
        fontSize: 20,
        width: "100%",
        textAlign: "left",
        padding: "8px 10px",
        borderRadius: 6,
        border: "none",
        background: "transparent",
        color: "inherit",
        cursor: "pointer",
        transition: "background 0.12s, transform 0.06s",
        selectors: {
            "&:hover": {
                background: "rgba(255,255,255,0.03)",
                transform: "translateY(-1px)",
                borderRadius: 6
            }
        }
    })
};

export default sidebarStyle;
