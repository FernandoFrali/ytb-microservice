import { ElysiaRoutes } from "../Application/Routes";
import { envVariables } from "./Config/Env";

const port = envVariables.PORT ?? 5000;

ElysiaRoutes.listen(port);

console.log("Streaming Service initialized ✅");
