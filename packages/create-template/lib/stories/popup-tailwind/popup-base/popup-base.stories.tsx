import { PopupBase } from "./popup-base";
import { popupStore } from "@/lib/popup/store";

export default {
    title: "Popup/Tailwind/PopupBase",
    component: PopupBase
};

export const Default = () => (
    <>
        <button
            onClick={() =>
                popupStore.open(
                    <div className="p-4 bg-white">
                        Story popup content
                        <br />
                        <button
                            onClick={() => popupStore.close()}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Close
                        </button>
                    </div>
                )
            }
            className="px-4 py-2 bg-blue-500 text-white rounded"
        >
            Open Popup
        </button>
        <PopupBase />
    </>
);
