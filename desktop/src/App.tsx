//import { invoke } from "@tauri-apps/api/core";
import { Sidebar, useSidebar } from "./features/sidebar";
import appStyle from "./App.css";
import { useMemo } from "react";
import { ExportButton } from "./features/export/ExportButton";

function App() {
    const { sidebarState } = useSidebar();

    const MainComponent = useMemo(() => {
        switch (sidebarState) {
            case "cli":
                return <ExportButton />;
            case "gui-react":
                return <div>React Template Component</div>;
            default:
                return <div>Default Component</div>;
        }
    }, [sidebarState]);

    return (
        <main className={appStyle.container}>
            <Sidebar />
            <section className={appStyle.sectionBox}>
                <h1>Create React Template</h1>
                {MainComponent}
            </section>
        </main>
    );
}

export default App;
