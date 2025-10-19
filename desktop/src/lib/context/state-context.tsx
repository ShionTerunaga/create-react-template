import {
    createContext,
    Dispatch,
    JSX,
    ReactNode,
    SetStateAction,
    useMemo,
    useState
} from "react";
import { Result, resultUtility } from "../../utils/result";
import { useContext } from "react";

interface StateContext<T> {
    errorMessage: string;
    initialState: T;
}

interface ProviderProps {
    children: ReactNode;
}

export function createStateContext<T>({
    errorMessage,
    initialState
}: StateContext<T>) {
    const { createNg, createOk, isNG } = resultUtility;
    const ContextProvider = createContext<
        Result<[T, Dispatch<SetStateAction<T>>], Error>
    >(createNg(new Error(errorMessage)));

    const Provider = ({ children }: ProviderProps): JSX.Element => {
        const state = useState<T>(initialState);

        const result = useMemo(() => createOk(state), [state]);

        return <ContextProvider value={result}>{children}</ContextProvider>;
    };

    const useStateContext = () => {
        const context = useContext(ContextProvider);

        if (isNG(context)) {
            throw context.err;
        }

        return context.value;
    };

    return { Provider, useStateContext };
}
