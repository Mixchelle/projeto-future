// run-migrations.js
const { execSync } = require("child_process");
const os = require("os");

const isWindows = os.platform() === "win32";

try {
  if (isWindows) {
    execSync("cmd /c run_migrations.bat", { stdio: "inherit" });
  } else {
    execSync("sh run_migrations.sh", { stdio: "inherit" });
  }
} catch (err) {
  console.error("Erro ao rodar as migrações:", err);
  process.exit(1);
}
