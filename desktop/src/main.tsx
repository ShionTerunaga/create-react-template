import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SidebarProvider } from "./features/sidebar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <SidebarProvider>
            <App />
        </SidebarProvider>
    </React.StrictMode>
);
