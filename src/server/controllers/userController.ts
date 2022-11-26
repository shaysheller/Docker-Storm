import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import db from '../models/dockerStormModel.js';


interface UserController {
    verifyUser: (req: Request, res: Response, next: NextFunction) => void;
    createUser: (req: Request, res: Response, next: NextFunction) => void;
    encrypt: (req: Request, res: Response, next: NextFunction) => void;
    updateUser: (req: Request, res: Response, next: NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: NextFunction) => void;

}




const userController: UserController = {

  verifyUser: async (req, res, next) => {
    const { password } = req.body;

    const username = req.body.username || req.cookies.username;

    const queryStr = 'SELECT * FROM users WHERE username = $1';

    try {
      db.query(queryStr, [username])
        .then((data) => {
          if(data.rows.length === 1){
            const validPassword = bcrypt.compareSync(password, data.rows[0].password);
            if(validPassword) return next();
            else {
              return next({
                log: 'Error caught in userController.verifyUser',
                status: 400,
                message: 'Missing username or password in request',
              });
            }
          } else {
            return next({
              log: 'Error caught in userController.verifyUser',
              status: 400,
              message: 'Missing username or password in request',
            });
          }
        });
    } catch {
      return next({
        log: 'Error caught in userController.verifyUser',
        status: 400,
        message: 'Missing username or password in request',
      });
    }
  },
    

  createUser: async (req, res, next) => {
    const { username, role } = req.body;
    try {
      if(!username || !res.locals.password) {
        return next({
          log: 'Error caught in userController.createUser',
          status: 400,
          message: 'Missing username or password in request',
        });
      }
      const queryStr = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3);';

      db.query(queryStr, [username, res.locals.password, role])
        .then(() => {return next();})
        .catch((err: Error) => {
          return next({
            log: 'Error caught in createUser db call',
            status: 400,
            message: {err: err}
          });
        });

    } catch (error) {
      return next({
        log: 'Error caught in userController.createUser',
        status: 400,
        message: 'Username already taken',
      });
    }
  },

  // if we are creating new password it will be newPassword
  // if we are just verifying password it will be password
  encrypt: async (req, res, next) => {
    const password = req.body.newPassword || req.body.password;

    const saltFactor = bcrypt.genSaltSync(10);
    res.locals.password = bcrypt.hashSync(password, saltFactor);
    return next();
  },

  updateUser: (req, res, next) => {
    const username = req.cookies.username;
    const password = res.locals.password;

    const queryString = 'UPDATE users SET password=($1) WHERE username=($2);';
    
    db.query(queryString, [password, username])
      .then(() => next());
    
  },

  // UPDATE users SET password='asdf' WHERE username='shay';

  deleteUser: (req, res, next) => {
    const { username } = req.body;

    const queryStr = 'DELETE FROM users WHERE username=($1);';

    db.query(queryStr, [username])
      .then(() => {
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  }
};

export default userController;