interface IInput{
    options: {},
    s:string;
}

export default class Refactoring{
    public run(opt:IInput){
        this.doSomethings(opt);
    }


    private doSomethings(opt: IInput) {
        console.log('options', opt);
    }
}