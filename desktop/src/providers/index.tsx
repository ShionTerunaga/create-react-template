import { LoadingProvider } from "../features/loading";
import { SidebarProvider } from "../features/sidebar";
import { type CheckerProps } from "../shared/types/object";
import { type ChildrenOnly } from "../shared/types/react";

interface ProvidersProps extends ChildrenOnly {}

export function Providers<T extends ProvidersProps>(
    props: CheckerProps<T, ProvidersProps, "ProvidersProps error">
) {
    const { children } = props;

    return (
        <LoadingProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </LoadingProvider>
    );
}
