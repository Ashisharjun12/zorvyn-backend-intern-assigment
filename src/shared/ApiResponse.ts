

export class ApiResponse<T>{
    public readonly success:boolean;
    public readonly statusCode:number;
    public readonly data:T;
    public readonly message:string;

    constructor(statusCode:number,data:T,message:string){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
      this.success=statusCode<400
    }

}