import express, { Application } from "express";

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
      
    }


    //routes
    private setupRoutes(){
      
    }

    //error handling
    private setupErrorHandling(){
      
    }

    public getApp() {
        return this.app;
    }
}
