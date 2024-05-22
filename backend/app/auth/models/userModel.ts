import db from "../../db";
import { transporter } from "../controllers/userControllers";
import { inactiveUserText } from "../emailText";
import {
  Client,
  Admin,
  Interest,
  Search,
  Contact,
  User,
  ClientQuestion,
  ClientCompany,
} from "./User";
import bcrypt from "bcrypt";
import path from "path";

class UserModel {
  //Crée un nouvel utilisateur en vérifiant d'abord s'il existe. Utilise bcrypt pour hacher le mot de passe. Renvoie l'ID de l'utilisateur créé.
  async createUser(user: User) {
    return new Promise<any>(async (resolve, reject) => {
      this.checkIfUserExists(user)
        .then(async (existingUser) => {
          if (existingUser) {
            reject("User already exists");
          } else {
            const sql =
              "INSERT INTO Users ( email, firstName, lastName, password, isConnected, isAdmin,accountState ) VALUES ( ?, ?, ?, ?, ?, ?, ?)";

            const hashedPassword = await bcrypt.hash(user.password, 10);
            const values = [
              user.email,
              user.firstName,
              user.lastName,
              hashedPassword,
              user.isConnected,
              user.isAdmin,
              0,
            ];

            db.query(sql, values, (err: any, userResults: any) => {
              if (err) {
                reject(err);
              } else {
                const clientSql =
                  "INSERT INTO Clients (userID, registrationStep) VALUES (?, ?)";
                const clientValues = [userResults.insertId, 2];

                db.query(
                  clientSql,
                  clientValues,
                  (clientErr: any, clientResults: any) => {
                    if (clientErr) {
                      reject(clientErr);
                    } else {
                      resolve(userResults.insertId);
                    }
                  }
                );
              }
            });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  //Vérifie si un utilisateur avec l'e-mail fourni existe déjà. Renvoie les détails de l'utilisateur s'il existe, sinon null.
  async checkIfUserExists(user: User): Promise<User | null> {
    const sql = "SELECT * FROM Users WHERE email = ?";
    const values = [user.email];

    try {
      const [rows] = await db.promise().query(sql, values);

      if (rows && rows.length > 0) {
        return rows[0] as User;
      } else {
        return null;
      }
    } catch (error) {
      return error;
    }
  }
  //Implémente le Single Sign-On (SSO) en vérifiant l'existence de l'utilisateur. Met à jour le statut de connexion ou crée un nouvel utilisateur.
  async SSO(user: User): Promise<any> {
    const existingUser = await this.checkIfUserExists(user);

    if (existingUser) {
      await this.updateUserIsConnected("email", existingUser.email);
      const infos = await this.getLoginInfoSSO(existingUser.email);
      return { type: "infos", data: infos };
    } else {
      const newUser: User = {
        ...user,
        isConnected: true,
        isAdmin: false,
      };
      const userId = await this.createUser(newUser);
      return { type: "id", data: userId };
    }
  }
  //Met à jour les détails du client dans la base de données. Renvoie un message de succès ou d'échec.
  async updateClient(client: Client) {
    const sql =
      "UPDATE Clients SET birthDate = ?, city = ?, description = ?, picture = ?, status = ?, registrationStep = ? WHERE userID = ?";

    const values = [
      client.birthDate,
      client.city,
      client.description,
      client.picture,
      client.status,
      client.registrationStep,
      client.userID,
    ];

    try {
      const [result] = await db.promise().query(sql, values);

      if (result.affectedRows > 0) {
        return "update sucess";
      } else {
        return "update failed";
      }
    } catch (error) {
      return error;
    }
  }
  //Crée un nouvel administrateur avec des détails sécurisés. Renvoie les résultats de l'insertion.
  createAdmin(admin: Admin) {
    return new Promise<any>(async (resolve, reject) => {
      const sql =
        "INSERT INTO Users ( email, firstName, lastName, password, isConnected ,isAdmin) VALUES ( ?, ?, ?, ?, ?, ?)";

      const hashedPassword = await bcrypt.hash(admin.user.password, 10);
      const values = [
        admin.user.email,
        admin.user.firstName,
        admin.user.lastName,
        hashedPassword,
        admin.user.isConnected,
        admin.user.isAdmin,
      ];

      db.query(sql, values, (err: any, userResults: any) => {
        if (err) {
          reject(err);
        } else {
          // Insérez l'administrateur dans la table Admin
          const adminSql =
            "INSERT INTO Admins (userID, isSuperAdmin) VALUES (?, ?)";
          const adminValues = [userResults.insertId, admin.isSuperAdmin];

          db.query(
            adminSql,
            adminValues,
            (adminErr: any, adminResults: unknown) => {
              if (adminErr) {
                reject(adminErr);
              } else {
                resolve(adminResults);
              }
            }
          );
        }
      });
    });
  }
  //Met à jour le statut isConnected de l'utilisateur à 0 pour simuler une déconnexion.
  logoutUser(userID: number) {
    return new Promise<any>((resolve, reject) => {
      const checkUserSql = "SELECT * FROM Users WHERE userID = ?";
      db.query(
        checkUserSql,
        [userID],
        (checkUserErr: any, checkUserResults: any) => {
          if (checkUserErr) {
            reject(checkUserErr);
          } else if (checkUserResults.length === 0) {
            reject({ message: "User not found" });
          } else {
            const sql = "UPDATE Users SET isConnected = 0 WHERE userID = ?";
            db.query(sql, [userID], (err: any, results: any) => {
              if (err) {
                reject(err);
              } else {
                resolve({ message: "User logged out successfully" });
              }
            });
          }
        }
      );
    });
  }
  //Récupère les informations sur les clients à partir des tables Clients et Users. Renvoie les résultats.
  getUsersClients() {
    return new Promise(async (resolve, reject) => {
      const sql =
        "SELECT U.userID, C.description, C.picture, U.isConnected, U.firstName, U.lastName FROM Clients C LEFT JOIN Users U ON U.userID = C.userID WHERE C.isRegistrationComplete = 1";
      db.query(sql, (err: any, results: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  //Construit et renvoie le chemin du fichier pour une image en fonction du nom de fichier fourni.
  async getImagePath(filename: string): Promise<string> {
    const authDirectory = path.resolve(__dirname, "..", "..", "..");

    const imagePath = path.join(authDirectory, "clientPictures", filename);
    return imagePath;
  }
  //Récupère les informations de connexion en fonction de l'e-mail fourni, y compris les détails de l'utilisateur et du client.
  private getLoginInfoByEmail(email: string) {
    return new Promise<any>((resolve, reject) => {
      const sql = `
        SELECT Users.userID, Users.email, Users.firstName, Users.lastName, Users.password, Users.isAdmin, Users.accountState,
               CASE WHEN Users.isAdmin = 0 THEN Clients.picture ELSE NULL END AS picture, Clients.registrationStep,Clients.isRegistrationComplete
        FROM Users
        LEFT JOIN Clients ON Users.userID = Clients.userID
        WHERE Users.email = ?
      `;
      const values = [email];

      db.query(sql, values, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  //Récupère des informations sur un utilisateur et un client en fonction de l'ID de l'utilisateur.
  public getInfoByUserId(userId: number) {
    return new Promise<any>((resolve, reject) => {
      const sql = `
      SELECT
      U.userID,
      U.email,
      U.firstName,
      U.lastName,
      U.isAdmin,
      U.accountState,
      C.picture,
      C.registrationStep,
      C.isRegistrationComplete
  FROM
      Users U
  inner join
      Clients C ON U.userID = C.userID WHERE U.userID = ?
`;
      const values = [userId];

      db.query(sql, values, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  //Récupère les informations de connexion pour le SSO en fonction de l'e-mail fourni.
  public getLoginInfoSSO(email: string) {
    return new Promise<any>((resolve, reject) => {
      const sql = `
      SELECT
      U.userID,
      U.email,
      U.firstName,
      U.lastName,
      U.isAdmin,
      U.accountState,
      C.picture,
      C.registrationStep,
      C.isRegistrationComplete
  FROM
      Users U
  inner join
      Clients C ON U.userID = C.userID WHERE U.email = ?
`;
      const values = [email];

      db.query(sql, values, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  //Vérifie si le mot de passe fourni correspond au mot de passe haché stocké.
  private async checkPassword(password: string, storedPasswordHash: string) {
    try {
      return await bcrypt.compare(password, storedPasswordHash);
    } catch (error) {
      return error;
    }
  }
  //Met à jour le statut isConnected de l'utilisateur en fonction de l'e-mail ou de l'ID de l'utilisateur.
  async updateUserIsConnected(field, value) {
    return new Promise((resolve, reject) => {
      let sqlUpdate;
      if (field === "email") {
        sqlUpdate = "UPDATE Users SET isConnected = 1 WHERE email = ?";
      } else if (field === "userID") {
        sqlUpdate = "UPDATE Users SET isConnected = 1 WHERE userID = ?";
      } else {
        reject("invalid attribute");
        return;
      }

      const valuesUpdate = [value];

      db.query(sqlUpdate, valuesUpdate, (errUpdate, resultsUpdate) => {
        if (errUpdate || resultsUpdate.affectedRows === 0) {
          reject(errUpdate);
        } else {
          resolve("update IsConnected successfuly");
        }
      });
    });
  }
  //Authentifie un utilisateur en fonction de l'e-mail et du mot de passe fournis.
  public async loginUser(email: string, password: string) {
    try {
      const user = await this.getLoginInfoByEmail(email);

      if (!user) {
        return { message: "email ou mot de passe erroné" };
      }

      const passwordMatch = await this.checkPassword(password, user.password);

      if (passwordMatch && user.accountState !== 3) {
        await this.updateUserIsConnected("email", email);

        const result = {
          userID: user.userID,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          isAdmin: user.isAdmin,
          accountState: user.accountState,
          registrationStep: user.registrationStep,
          isRegistrationComplete: user.isRegistrationComplete,
        };
        return result;
      } else if (user.accountState === 3 && passwordMatch) {
        return { message: "Compte suspendu" };
      } else {
        return { message: "email ou mot de passe erroné" };
      }
    } catch (error) {
      return error;
    }
  }
}

export default UserModel;
