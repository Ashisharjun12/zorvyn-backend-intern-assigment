import express, { Application } from "express";
 

export class App{
    private app:Application;
    constructor(){
        this.app = express();
    }

    
    public start(){
        const PORT= 8000;
        this.app.listen(PORT ,()=>{
            console.log(`server is running on port ${PORT}`)
        })
    }
}