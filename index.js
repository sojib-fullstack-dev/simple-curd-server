
import express from 'express';
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config' 
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())

const client = new MongoClient(`mongodb://${process.env.MDB_NAME}:${process.env.MDB_PASS}@ac-hsudt4e-shard-00-00.buouugs.mongodb.net:27017,ac-hsudt4e-shard-00-01.buouugs.mongodb.net:27017,ac-hsudt4e-shard-00-02.buouugs.mongodb.net:27017/?ssl=true&replicaSet=atlas-q1q3ty-shard-0&authSource=admin`);


export async function connectToMongoDB(){
     try{
         await client.connect();
         console.log('connect successful mongodb')
         return client ;
     }
     catch(err){
         console.dir(err);
     }
}

const connectedClient= await connectToMongoDB();
const db=connectedClient.db('simpleCurdDB')
const users=db.collection('users')

await connectToMongoDB()

 app.get('/',(req, res)=>{
         res.send('Hello World')     
})

app.get('/users',async(req,res)=>{
    const cursor=users.find({});
    const allUsers=await cursor.toArray();
    res.send(allUsers);
})

app.get('/users/:id',async(req,res)=>{
     console.log('req in server',req.params)
     
     const id =req.params.id
     const query={_id: new ObjectId(id) }
     const result=await  users.findOne(query)
     res.send(result)
})

app.post('/users',async (req,res)=>{
    const newUser=req.body;

    console.log('adding user',newUser)

    const result=await users.insertOne(newUser)
    res.send(result)
})

app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await users.deleteOne(query)
      res.send(result)  
})

app.patch('/users/:id',async(req,res)=>{

    const id=req.params.id;
    const updateuser=req.body;
    console.log('update user id ',id ,'update user data ',updateuser)

    const query={
        _id: new ObjectId(id)
    }
    const options = { upsert: true };
    const updateDoc={
        $set:{
            name:updateuser.name,
            email:updateuser.email
        }
    }
    const result = await users.updateOne(query, updateDoc, options);
     res.send(result)
    console.log('rusult',result)
})

app.listen(PORT,()=>{
     console.log(`running  on port ${PORT}`)
})