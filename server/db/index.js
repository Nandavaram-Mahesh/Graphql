
import mongoose from 'mongoose';

import {DB_NAME} from '../utils/constants.js'

const connectDb=async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

console.log(
      `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
    );
    }
    catch(err){
        console.log(`Db Error:${err}`)
        process.exit(1)
    }
}

export default connectDb