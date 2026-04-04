import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { httpLogger } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/ratelimit.middleware.js";
import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/users/user.route.js";
import recordRoutes from "./modules/records/record.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";



export class App {
    private app: Application;
    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    //middleware function
    private setupMiddlewares(){
        this.app.use(express.json());
        this.app.use(cookieParser())
        this.app.use(express.urlencoded({extended:true}));
        this.app.use(cors({
            origin:"*"
        }))
        this.app.use(helmet())
        this.app.use(httpLogger)
        this.app.use("/api", apiLimiter)
    
    }


    //routes
    private setupRoutes(){
        this.app.get("/api/health",(req,res)=>{
            res.status(200).json({
                status:"ok",
                message:"server is runninng.",
                timestamp:new Date().toISOString()
            })
        })

        //Api version prefix
        const prefix = "/api/v1";
       
        //module routes
        this.app.use(`${prefix}/auth`,authRoutes)
        this.app.use(`${prefix}/users`,userRoutes)
        this.app.use(`${prefix}/records`,recordRoutes)
        this.app.use(`${prefix}/dashboard`,dashboardRoutes)

    }

    //error handling
    private setupErrorHandling(){
        this.app.use(errorHandler)
    }

    public getApp() {
        return this.app;
    }
}
