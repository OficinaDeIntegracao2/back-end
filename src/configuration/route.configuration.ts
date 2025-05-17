import { glob } from "glob";
import { container, singleton } from "tsyringe";
import { Constant } from "@common/constant.common";
import Router from "@router/router";
import ExpressConfiguration from "./express.configuration";

@singleton()
export default class RouteConfiguration {
  constructor(private readonly expressConfiguration: ExpressConfiguration) {
    this.init();
  }

  private init = () => {
    const routers = glob.sync(Constant.ROUTER_FILES_PATTERN);
    routers.forEach((routerFile) => {
      const routerPathFromCurrentFile = routerFile.replace(Constant.SOURCE_FOLDER, Constant.PARENT_DIRECTORY);
      const router: Router = container.resolve(require(routerPathFromCurrentFile).default);
      this.expressConfiguration.getExpressApplication().use(router.path(), router.get());
    });
  }
}