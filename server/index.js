import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db/mongoose.js'
import { errorHandler } from './middleware/errorHandler.js'
import categoryRoutes from './routes/category.routes.js'
import impactRoutes from './routes/impact.routes.js'

dotenv.config();
connectDB();

const app = express();
app.use(cors())
app.use(express.json());

app.get('/health',(req,res)=>res.json({status:'ok'}));
app.use('/api/category',categoryRoutes);
app.use('/api/impact',impactRoutes);

app.use(errorHandler);

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})