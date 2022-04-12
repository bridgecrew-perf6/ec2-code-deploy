import {ApplicationBuilder, ColdwaveFacade} from "@imagineon/coldwave-backend-environment";
import {serverHealthModule} from "@imagineon/coldwave-backend-environment/lib/core/modules/health";
import {setLevel} from "@imagineon/coldwave-backend-environment/lib/logger";

setLevel("protocol");

new ApplicationBuilder()
    .addModule(serverHealthModule())
    .build({
        basePath: "/api/v1"
    })
    .then(async (facade: ColdwaveFacade) => {
        await facade.listen(8080)
    });