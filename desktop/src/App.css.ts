import { globalStyle, style } from "@vanilla-extract/css";

globalStyle("body", {
    margin: 0,
    padding: 0,
    backgroundColor: "#0f0f0f",
    color: "#ffffff",
    fontFamily: "Inter, Avenir, Helvetica, Arial, sans-serif"
});

const appStyle = {
    container: style({
        display: "flex"
    }),
    sectionBox: style({
        paddingLeft: 10
    })
};

export default appStyle;
