import { describe, it, expect } from "vitest";
import { popupAction } from "../../lib/popup/popup.action";
import { popupStore } from "../../lib/popup/store";

describe("popupAction", () => {
    it("open/close delegates to popupStore", () => {
        popupAction.open(<div />);
        const s1 = popupStore.getSnapshot();
        expect(s1.isOpen).toBe(true);

        popupAction.close();
        const s2 = popupStore.getSnapshot();
        expect(s2.isOpen).toBe(false);
    });
});
