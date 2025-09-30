import { errorExit, notify, run } from "./main";

run()
    .then(() => notify())
    .catch(() => errorExit());
