import { Request, Response, Router } from "express";
import { User } from "../models/User";
import UserModel from "../models/userModel";
import { Service } from "typedi";
import { json } from "body-parser";

const userModel = new UserModel();
const HTTP_STATUS_CREATED = 201;

@Service()
export class UserController {
  router: Router;
  constructor() {
    this.configureRouter();
  }
  // Endpoint pour la connexion d'un utilisateur. Retourne un token d'authentification en cas de succès.
  static generateToken() {
    return Math.random().toString(36).substr(2);
  }

  private configureRouter(): void {
    this.router = Router();
    /**
     * @swagger
     *
     * definitions:
     *   User:
     *     type: object
     *     properties:
     *        username:
     *          type: string
     *        email:
     *          type: string
     *        fullName:
     *          type: string
     *        password:
     *          type: boolean
     *        isConnected:
     *          type: boolean
     *        isAdmin:
     *          type: boolean
     *   Client:
     *     type: object
     *     properties:
     *        birthDate:
     *          type: string
     *        city:
     *          type: string
     *        description:
     *          type: string
     *        user:
     *          type: boolean
     *        picture:
     *          type: boolean
     */

    /**
     * @swagger
     * tags:
     *   - name: User controller API
     *     description: User controller API Documentation
     */
    /**
     * @swagger
     *
     * /user/login:
     *   get:
     *     description: Return 201 statuts and all the event results when created and 500 statuts when Error
     *     tags:
     *       - User controller API
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         schema:
     *           $ref: '#/definitions/User'
     */
    // Endpoint pour la connexion d'un utilisateur.
    this.router.post("/login", async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;
        console.log("login", email);
        const result = await userModel.loginUser(email, password);
        if (!result.message) {
          res.json({ message: "Login successfull", user: result });
        } else {
          res.status(404).json({ message: result.message });
        }
      } catch (error) {
        console.error("Error on login user :", error);
        res.status(401).json({ error });
      }
    });
    /**
     * @swagger
     *
     * /user/logout:
     *   get:
     *     description: Return 201 statuts and all the event results when created and 500 statuts when Error
     *     tags:
     *       - User controller API
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         schema:
     *           $ref: '#/definitions/User'
     */
    // Endpoint pour la déconnexion d'un utilisateur. Enregistre également l'événement de déconnexion.
    this.router.post("/logout", async (req: Request, res: Response) => {
      const { userId } = req.body;
      try {
        const logoutResult = await userModel.logoutUser(userId);
        res.status(200).json(logoutResult);
      } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed" });
      }
    });
    /**
     * @swagger
     *
     * /user/createUser:
     *   get:
     *     description: Return 201 statuts and all the event results when created and 500 statuts when Error
     *     tags:
     *       - User controller API
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         schema:
     *           $ref: '#/definitions/User'
     */
    // Endpoint pour la création d'un nouvel utilisateur avec gestion des erreurs et des doublons.
    this.router.post("/createUser", async (req: Request, res: Response) => {
      try {
        const user = req.body.user as User;
        user.token = UserController.generateToken();
        const result = await userModel.createUser(user);

        res.status(201).json({ message: "Succes", userId: result });
      } catch (error) {
        console.log(error);

        if (error === "User already exists") {
          res.status(400).json({ message: "L'utilisateur existe déjà." });
        } else {
          console.error("Error on creating user:", error);
          res
            .status(500)
            .json({ message: "Erreur lors de la création de l'utilisateur" });
        }
      }
    });
  }
}
