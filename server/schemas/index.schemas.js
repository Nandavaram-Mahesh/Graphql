import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
} from "graphql";
import { clients, projects } from "../sampleData.js";
import { Client } from "../models/client.models.js";
import { Project } from "../models/project.models.js";

// Schemas

const ClientType = new GraphQLObjectType({
    name:"Client",
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        phone:{type:GraphQLString}
    })
})

const ProjectType = new GraphQLObjectType({
    name:"Project",
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        status:{type:GraphQLString},
        client:{
            type:ClientType,
            resolve(parent,args){
                return clients.find(client=> client.id === parent.clientId)
            }
        }
    })
})


// Api EndPoints to get elements
const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        clients:{
            type: new GraphQLList(ClientType),
            async resolve(parent,args){
                try{
                   const getClients = await Client.find({})
                   return getClients  
                }catch(err){
                    console.log(err)
                }
            }
        },
        client:{
            type:ClientType,
            args:{id:{type:GraphQLID}},
            async resolve(parent,args){
                try{
                    const getClient = await Client.findById(args.id)
                    return getClient
                }catch(err){
                    console.log(err)
                }
                
            }
        },
        projects:{
            type:new GraphQLList(ProjectType),
            async resolve(parent){
                try{
                    const getProjects = await Project.find({})
                    return getProjects
                }catch(err){
                    console.log(err)
                }
            }
        },
        project:{
            type:ProjectType,
            args:{id:{type:GraphQLID}},
            async resolve(parent,args){
                try{
                    const getProject = await Project.findById(args.id)
                    return getProject
                }catch(err){
                    console.log(err)
                }
            }
        }
    }
})


// Api Endpoints to create , update and delete

const mutation= new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addClient:{
            type:ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
              },
               async resolve(parent,args){
                try{
                    const clientAdded = await Client.create({
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                      })
                      return clientAdded
                }
                catch(error){
                    console.error("Error adding client:", error);
                   
                }
                
              }
        },
        deleteClient:{
            type:ClientType,
            args:{
               id:{ type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent,args){
                try{

                    const deletedClient = await Client.findByIdAndDelete(args.id)
                    return deletedClient
                }
                catch(err){
                    console.log(err)
                }


            }
        },
        addProject:{
            type:ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                  type: new GraphQLEnumType({
                    name: 'ProjectStatus',
                    values: {
                      new: { value: 'Not Started' },
                      progress: { value: 'In Progress' },
                      completed: { value: 'Completed' },
                    },
                  }),
                  defaultValue: 'Not Started',
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
              },
              async resolve(parent, args) {
                try{
                    const createdProject = await Project.create({
                        name: args.name,
                        description: args.description,
                        status: args.status,
                        clientId: args.clientId,
                      });
              
                      return createdProject;    
                }
                catch(err){
                    console.log(err)
                }
                
              }
        },
        updateProject:{
            type:ProjectType,
            args:{
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description:{type: GraphQLString},
                status:{
                    type:new GraphQLEnumType({
                        name:"updateProject",
                        values: {
                            new: {value: 'Not Started' },
                            progress: { value: 'In Progress' },
                            completed: { value: 'Completed' },
                          },
                    })
                }
            },
            async resolve(parent,args){
                try{
                    const updatedProject = await Project.findByIdAndUpdate(args.id,{
                        name:args.name,
                        description:args.description,
                        status:args.status
                    })
                    return updatedProject

                }catch(err){
                    console.log(err)
                }
            }
        },
        deleteProject:{
            type:ProjectType,
            args:{
                id:{ type: GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent,args){
                try{
                    const deletedProject = await Project.findByIdAndDelete(args.id)
                    return deletedProject
                }catch(err){
                    console.log(err)
                }
            }
        }
    }
})



const schema = new GraphQLSchema({
    query:RootQuery,
    mutation
});

export {schema}  