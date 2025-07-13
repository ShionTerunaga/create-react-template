import { appTheme } from "@/shared/theme/theme";
import { style } from "@vanilla-extract/css";

const popupLayoutStyles = {
    container: style({
        backgroundColor: appTheme.white,
        borderRadius: 8,
        width: 450,
        height: 250
    })
};

export default popupLayoutStyles;
