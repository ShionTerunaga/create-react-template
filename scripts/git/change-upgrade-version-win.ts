import { main } from "./change-version-upgrade";

const WIN = "execution/win";

main(WIN).catch((e) => {
    console.error("❌ Upgrade failed:", e);
    process.exit(1);
});
