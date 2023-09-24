import { IUser } from "../models/userModel/user.interface";
import User from "../models/userModel/user.model";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/auth";
import { io } from '../../main';
const resolvers = {
    Query: {
        getAllUser: async () => {
            return await User.find();
        },
        getUser: async (_:any, { id}:{id:string}) => {
            return await User.find({ id: id });
        }
    }, 
    Mutation: {
        createUser: async (_:any, { name, email, password }:{name:string, email:string, password:string}) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const body = await User.create({ name, email, password:hashedPassword });
                await body.save();
                io.emit('userCreated', body);
                return body;
            } catch (error) {
                throw new Error('User creation failed');
            }
        },
        login:async (_:any, args: { email: string; password: string }) => {
            const user = await User.findOne({
                email: args.email,
              });
              console.log(user,"usererrrr");
              if (!user) {

                throw new Error('User not found');
              }
              if (!user.password) {
                console.error('User password is missing or undefined');
                throw new Error('User password is missing or undefined');
              }
        
              const isPasswordValid =  await bcrypt.compare(args.password, user.password);

              if (!isPasswordValid) {
                throw new Error('Invalid password');
              }
        
              // Generate and return a JWT token
              const token = generateToken(user);
              return token;
        },
        updateUser: async (_:any, { id, name, email }:{id:string, name:string, email:string}) => {
            const updateData = await User.findByIdAndUpdate(id, { name, email }, { new: true });
            return updateData;

        },
        deleteUser: async (_:any,{id}:{id:string}) => {
            try {
                await User.findByIdAndDelete(id);
            } catch (error) {
                return false;
            }
            
            return true
        }
    }
}
export default resolvers