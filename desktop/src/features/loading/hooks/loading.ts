import { createLoadingProvider } from "../provider/loading-provider";

export function useLoading() {
    const { useStateContext } = createLoadingProvider;

    const [isLoading, setIsLoading] = useStateContext();

    const openLoading = () => {
        setIsLoading(true);
    };

    const closeLoading = () => {
        setIsLoading(false);
    };

    return { isLoading, openLoading, closeLoading };
}
