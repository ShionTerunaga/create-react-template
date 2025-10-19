import { JSX, ReactNode } from 'react';
import context from '../../../lib/context'

export type SidebarState = "cli" | "gui-react"



export const sidebarContext = context.createStateContext<SidebarState>({
    errorMessage: "Sidebar context not found",
    initialState: "cli",
});


export function SidebarProvider({children}: {children:ReactNode}):JSX.Element{
    const {Provider} = sidebarContext;

    return (
        <Provider>
            {children}
        </Provider>
    )
}