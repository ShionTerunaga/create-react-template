"use client";

import * as React from "react";
import { usePopup } from "@/lib/popup/popup-vanilla";
import { CheckerProps } from "@/shared/types/object";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import "../style.css";

type ButtonProps = Omit<
    DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >,
    "onClick"
>;

export function PopupCloseButton<T extends ButtonProps>(
    props: CheckerProps<
        T,
        ButtonProps,
        "Not Expect In Close Popup Button Props"
    >
) {
    if (typeof props !== "object") {
        throw new Error("This is not props expected elements.");
    }

    const { close } = usePopup();

    return (
        <button
            {...(props as any)}
            onClick={() => close()}
            className="px-2 py-1 bg-gray-200 rounded"
        >
            {(props as any).children}
        </button>
    );
}

export default PopupCloseButton;
