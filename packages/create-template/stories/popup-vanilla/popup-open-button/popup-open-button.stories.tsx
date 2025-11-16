import * as React from "react";
import { PopupOpenButton } from "./popup-open-button";
import { PopupSampleLayout } from "../popup-layout/popup-layout";
import { PopupCloseButton } from "../popup-close-button/popup-close-button";
import { PopupBase } from "../popup-base/popup-base";

export default {
    title: "Popup/Vanilla/PopupOpenButton",
    component: PopupOpenButton
};

const ExamplePopupContent = () => (
    <PopupOpenButton
        popupChildren={
            (
                <PopupSampleLayout>
                    Popup content
                    <PopupCloseButton>Close</PopupCloseButton>
                </PopupSampleLayout>
            ) as any
        }
    >
        Open Popup
    </PopupOpenButton>
);

export const Default = () => (
    <>
        <h1>hello world</h1>
        <ExamplePopupContent />
        <PopupBase />
    </>
);
