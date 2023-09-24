import jwt from 'jsonwebtoken';
import { IUser } from '../models/userModel/user.interface';

const JWT_SECRET  = "some-key-here"

export const generateToken = (user: IUser): string => {
    return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token:string): Promise<any> =>{
    return new Promise((reject,resolve)=>{
        jwt.verify(token, JWT_SECRET, (err, decoded)=>{
            if (err) {
                reject(err);
                return;
              }
              resolve(decoded as {id: string});
        });
    });
}

