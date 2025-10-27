import { main } from "./change-version-upgrade";

const MAC = "execution/mac";

main(MAC).catch((e) => {
    console.error("❌ Upgrade failed:", e);
    process.exit(1);
});
