import express from "express";
import {graphqlHTTP } from "express-graphql";
import {schema} from "./schemas/index.schemas.js";
import dotenv from "dotenv";
import connectDb from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const app = express()

const PORT = 5000


// middlewares

app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  )


  async function startServer(){
    try{
      await connectDb()
      app.listen(PORT,()=>{console.log(`Listenign to server on port:${PORT}`)})
    }catch(err){
      console.log(`Db Error:${err}`)
    }
  }

  startServer()

