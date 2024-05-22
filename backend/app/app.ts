import { HttpException } from '@app/classes/http.exception';
// import { AdminController } from '@app/admin/controllers/adminControllers';
import { UserController } from '@app/auth/controllers/userControllers';

// import { EventController } from '@app/event/controllers/eventControllers';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from "express";
import { StatusCodes } from 'http-status-codes';
import logger from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { Service } from 'typedi';
// import { ChatController } from './chat/controllers/chatControllers';
import bodyParser from 'body-parser';
// import checkClientsPicDirectoryExists from './auth/multerConfig';
// import { StatControllers } from './auth/controllers/statControllers';
// import { ProfilControllers } from './profil/controllers/profilController';

@Service()
export class Application {
  app: express.Application = express();
  private readonly internalError: number = StatusCodes.INTERNAL_SERVER_ERROR;
  private readonly swaggerOptions: swaggerJSDoc.Options;
  // instancie les routes et swagger 
  constructor(
    // private readonly chatController: ChatController,
    // private readonly eventController: EventController,
    private readonly userController: UserController,
    // private readonly adminController: AdminController,
    // private readonly statController:StatControllers,
    // private readonly profilController:ProfilControllers
  ) {
    this.swaggerOptions = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "Server middleware",
          version: "1.0.0",
        },
      },
      apis: ["**/*.ts"],
    };

    this.config();

    this.bindRoutes();
  }
    // ajouter les controllers
    bindRoutes(): void {
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(this.swaggerOptions)));
        this.app.use('/users', this.userController.router);
        // this.app.use('/admin', this.adminController.router);
        // this.app.use('/events', this.eventController.router);
        // this.app.use('/chats', this.chatController.router);
        // this.app.use('/stat', this.statController.router);
        // this.app.use('/profil', this.profilController.router);
        this.app.use('/', (req, res) => {
            res.redirect('/api/docs');
        });
        this.errorHandling();
    }
    // ajouter la configuration express
    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(bodyParser.json());
    }
  // permet de handle les erreur et éviter le shutdown du serveur
  private errorHandling(): void {
    // When previous handlers have not served a request: path wasn't found
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const err: HttpException = new HttpException("Not Found");
        next(err);
      }
    );

    // development error handler
    // will print stacktrace
    if (this.app.get("env") === "development") {
      this.app.use(
        (err: HttpException, req: express.Request, res: express.Response) => {
          res.status(err.status || this.internalError);
          res.send({
            message: err.message,
            error: err,
          });
        }
      );
    }

    // production error handler
    // no stacktraces leaked to user (in production env only)
    this.app.use(
      (err: HttpException, req: express.Request, res: express.Response) => {
        res.status(err.status || this.internalError);
        res.send({
          message: err.message,
          error: {},
        });
      }
    );
  }
}
