import { useLoading } from "../hooks/loading";
import loadingStyle from "./loading.css";

export function LoadingLayout() {
    const { isLoading } = useLoading();

    return (
        <>
            {isLoading && (
                <div className={loadingStyle.container}>
                    <div className={loadingStyle.spinner}></div>
                </div>
            )}
        </>
    );
}
