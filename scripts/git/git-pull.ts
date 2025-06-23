import { exec } from "child_process";
import { resolve } from "path";
import os from "os";

const repoPath = resolve(os.homedir(), "tools/create-react-template");

exec("git pull origin main", { cwd: repoPath }, (err, stdout, stderr) => {
  if (err) {
    console.error("❌ git pull failed:", err.message);
    process.exit(1);
  }
  if (stderr) console.error("[stderr]", stderr);

  if (stdout) console.log("[stdout]", stdout);
});
