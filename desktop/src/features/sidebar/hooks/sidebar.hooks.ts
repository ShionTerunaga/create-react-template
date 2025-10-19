import { sidebarContext } from "../provider/sidbar.provider";

export function useSidebar() {
    const { useStateContext } = sidebarContext;
    const [sidebarState, setSidebarState] = useStateContext();

    return {
        sidebarState,
        setSidebarState
    };
}
