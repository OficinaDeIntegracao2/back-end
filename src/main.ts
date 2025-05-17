import "reflect-metadata";
import EnvironmentConfiguration from "@configuration/environment.configuration";
import ExpressConfiguration from "@configuration/express.configuration";
import RouteConfiguration from "@configuration/route.configuration";
import { logger } from "@util/logger.util";
import { container } from "tsyringe";

const SERVER_PORT = "SERVER_PORT";

const main = async () => {
  const environmentConfiguration = container.resolve(EnvironmentConfiguration);
  const expressApplication = container.resolve(ExpressConfiguration).getExpressApplication();
  container.resolve(RouteConfiguration);
  const port = environmentConfiguration.getIntValue(SERVER_PORT);
  expressApplication.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });
}

main();