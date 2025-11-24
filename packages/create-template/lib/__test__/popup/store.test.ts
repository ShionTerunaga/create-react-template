import { describe, it, expect, vi } from "vitest";
import { popupStore } from "../../lib/popup/store";

describe("popupStore", () => {
    it("starts closed", () => {
        const s = popupStore.getSnapshot();
        expect(s.isOpen).toBe(false);
    });

    it("open sets isOpen true and stores children", () => {
        popupStore.open("hello");
        const s = popupStore.getSnapshot();
        expect(s.isOpen).toBe(true);
        // @ts-ignore
        expect((s as any).children).toBe("hello");
        popupStore.close();
    });

    it("listeners are notified on open/close", () => {
        const cb = vi.fn();
        const unsub = popupStore.subscribe(cb);

        popupStore.open("x");
        expect(cb).toHaveBeenCalled();

        cb.mockClear();
        popupStore.close();
        expect(cb).toHaveBeenCalled();

        unsub();
    });
});
