import { Heading } from "@/components/ui";
import { PopupOpenButton } from "@/components/ui/popup/popup-open-button/popup-open-button";
import { ExplainPopup } from "@/features/about";
import { ja } from "@/shared/lang/ja";
import homeStyles from "./home.css";

export default function Home() {
    return (
        <main>
            <Heading>{ja.app.home.title}</Heading>

            <PopupOpenButton
                popupChildren={<ExplainPopup />}
                className={homeStyles.button}
            >
                {ja.app.home.openPopup}
            </PopupOpenButton>
        </main>
    );
}
