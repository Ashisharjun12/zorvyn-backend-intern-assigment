import express, { Application } from "express";
import { _config } from "./config/config.js";


export class App {
    private app: Application;
    constructor() {
        this.app = express();
    }

    public start() {
        const { PORT } = _config;
        this.app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    }
}
