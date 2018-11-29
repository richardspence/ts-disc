type IHandler = () => void;

type ISubscriber<T> = {
    [K in keyof T]: IHandler;
};

class MyPublisher {
    public event1() {

    }

    public event2() {

    }
}

class MySubscriber implements ISubscriber<MyPublisher>{
    public event1() {

    }

    public event2(/*num:number */) {

    }

    public event3(){
        
    }
}