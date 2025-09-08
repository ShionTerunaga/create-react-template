"use client";

import { createReducerContext } from "@/utils/context/reducer-context";
import { popupReducer } from "./popup-reducer";
import { type PopupAction, type PopupState } from "./popup.type";
import { type ChildrenOnly } from "@/shared/types/react";
import type { ReactNode } from "react";

export const popupContext = createReducerContext<PopupState, PopupAction>({
    errorMessage: "PopupProviderで初期化がされていません",
    reducer: popupReducer,
    initialState: {
        isOpen: false
    }
});

interface Props {
    layoutPopup: ReactNode;
}

export function PopupProvider({ layoutPopup, children }: Props & ChildrenOnly) {
    const [Provider] = popupContext;

    return (
        <Provider>
            {layoutPopup}
            {children}
        </Provider>
    );
}
