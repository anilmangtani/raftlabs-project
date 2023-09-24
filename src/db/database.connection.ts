const mongoose = require('mongoose');

// Database connection with mongoose
const connectDb = async () => {
    try {
        const username = process.env.MONGO_USERNAME;
        if(!username){
            console.log("Username does not exist");
            throw new Error('Username does not exist')
        }
        const password = process.env.MONGO_PASSWORD;
        if(!password){
            console.log("Password Error");
            throw new Error(`Password does not exist`);
        }
        await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.8mlbz5w.mongodb.net/?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Successfully connected to database");
    } catch (error) {
        console.log(error, "Error in connecting to the database");
    }
}

export default connectDb;

