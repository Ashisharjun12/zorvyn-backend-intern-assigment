import { App } from "./app.js";


class Main{
    private app:App;
    constructor(){
        this.app = new App();
    }

    public start(){
        this.app.start();
    }
}

const main = new Main();
main.start();