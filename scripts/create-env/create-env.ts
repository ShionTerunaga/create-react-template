import fs from "fs";
import path from "path";

type Target = {
    dir: string;
    content: string;
};

const targets: Target[] = [
    {
        dir: path.resolve(__dirname, "../../example/next/app"),
        content: `NEXT_PUBLIC_API_KEY="https://hp-api.onrender.com/api/characters"
NEXT_PUBLIC_API_KEY2="https://dog.ceo/api/breeds/image/random"
`
    },
    {
        dir: path.resolve(__dirname, "../../main-template/next/app"),
        content: `NEXT_PUBLIC_API_KEY="https://hp-api.onrender.com/api/characters"
NEXT_PUBLIC_API_KEY2="https://dog.ceo/api/breeds/image/random"
`
    },
    {
        dir: path.resolve(__dirname, "../../example/next/pages"),
        content: `NEXT_PUBLIC_API_KEY="https://hp-api.onrender.com/api/characters"
`
    },
    {
        dir: path.resolve(__dirname, "../../main-template/next/pages"),
        content: `NEXT_PUBLIC_API_KEY="https://hp-api.onrender.com/api/characters"
`
    },
    {
        dir: path.resolve(__dirname, "../../example/tanstack-router"),
        content: `VITE_API_KEY="https://hp-api.onrender.com/api/characters"
`
    },
    {
        dir: path.resolve(__dirname, "../../main-template/tanstack-router"),
        content: `VITE_API_KEY="https://hp-api.onrender.com/api/characters"
`
    }
];

function ensureDirExists(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

for (const t of targets) {
    try {
        ensureDirExists(t.dir);
        const filePath = path.join(t.dir, ".env");
        fs.writeFileSync(filePath, t.content, { encoding: "utf8" });
        // Log relative path for user clarity
        console.log(`Wrote ${path.relative(process.cwd(), filePath)}`);
    } catch (err) {
        console.error(`Failed to write .env in ${t.dir}:`, err);
        process.exitCode = 2;
    }
}

// exit normally
process.exitCode = 0;
