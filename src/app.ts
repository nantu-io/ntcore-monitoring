import { Routes } from "./routes/endpoints";
import { appConfig } from './libs/config/AppConfigProvider';
import { initialize } from "./libs/config/AppModule";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";

export class App 
{
    public app: express.Application;
    private _routes: Routes;

    constructor() {
      this.app = express();
      this.config();
      this._routes = new Routes();
      this._routes.routes(this.app);
    }

    private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json({limit: '50mb'}));
      this.app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
      // config js/css route
      this.app.use('/dsp/monitoring', express.static(path.join(__dirname, '/../webapp/build')));
      // config html route
      this.app.get('/dsp/console/*', (req, res, next) => {
        res.sendFile(path.join(__dirname, '/../webapp/build/index.html'));
      });
      // Listen to port
      const PORT = 8180;
      initialize().then(() => {
        this.app.listen(PORT, () => console.log(`NTCore Monitoring is running with ${appConfig.monitoring.provider} provider`));
      });
    }
}

export default new App().app;