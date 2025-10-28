import { useSidebar } from "../hooks/sidebar.hooks";
import { SidebarState } from "../provider/sidbar.provider";
import sidebarStyle from "./sidebar.css";

interface SidebarMenuItem {
    id: string;
    label: string;
    type: SidebarState;
}

export function Sidebar() {
    const { sidebarState, setSidebarState } = useSidebar();

    const menuItems: Array<SidebarMenuItem> = [
        { id: "first", label: "CLI Tool", type: "cli" },
        { id: "secound", label: "React Template", type: "gui-react" }
    ];

    return (
        <aside className={sidebarStyle.container}>
            <nav className={sidebarStyle.nav}>
                <ul className={sidebarStyle.list}>
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            className={`
                            ${sidebarStyle.menuItem}
                            ${sidebarState === item.type ? sidebarStyle.menuItemActive : ""}
                        `}
                        >
                            <button
                                className={sidebarStyle.menuButton}
                                type="button"
                                onClick={() => setSidebarState(item.type)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
