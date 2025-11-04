import { createStateContext } from "../../../lib/context/state-context";
import { ChildrenOnly } from "../../../shared/types/react";

export const createLoadingProvider = createStateContext<boolean>({
    initialState: false,
    errorMessage: "LoadingProvider not found"
});

interface LoadingProviderProps extends ChildrenOnly {}

export function LoadingProvider({ children }: LoadingProviderProps) {
    const { Provider } = createLoadingProvider;
    return <Provider>{children}</Provider>;
}
