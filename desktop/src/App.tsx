//import { invoke } from "@tauri-apps/api/core";
import { Sidebar, SidebarProvider, useSidebar } from "./features/sidebar";
import appStyle from "./App.css";
import { useMemo } from "react";

function App() {
    //const [greetMsg, setGreetMsg] = useState("");
    //const [name, setName] = useState("");

    const { sidebarState } = useSidebar();

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        //setGreetMsg(await invoke("greet", { name }));
    }

    const MainComponent = useMemo(() => {
        switch (sidebarState) {
            case "cli":
                return <div>CLI Tool Component</div>;
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
