"use client";

import { usePopup } from "@/lib/popup";
import { ChildrenOnly } from "@/shared/types/react";
import { AnimatePresence, motion } from "motion/react";
import popupLayoutStyles from "./popup-layout.css";

export function PopupLayout({ children }: ChildrenOnly) {
    const { openState } = usePopup();
    const { isOpen } = openState;

    return (
        <>
            <div className={popupLayoutStyles.background} />
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className={popupLayoutStyles.base}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
