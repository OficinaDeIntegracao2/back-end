import "reflect-metadata";
import EnvironmentConfiguration from "@configuration/environment.configuration";
import ExpressConfiguration from "@configuration/express.configuration";
import RouteConfiguration from "@configuration/route.configuration";
import { Constant } from "@common/constant.common";
import { logger } from "@util/logger.util";
import { container } from "tsyringe";
import { DatabaseConfiguration } from "@configuration/database/database.configuration";
import SwaggerConfiguration from "@configuration/swagger.configuration";


const main = async () => {
  const environmentConfiguration = container.resolve(EnvironmentConfiguration);
  const expressApplication = container.resolve(ExpressConfiguration).getExpressApplication();
  container.resolve(DatabaseConfiguration);
  container.resolve(RouteConfiguration);
  container.resolve(SwaggerConfiguration).setup();
  const port = environmentConfiguration.getIntValue(Constant.SERVER_PORT);
  expressApplication.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });
}

main();