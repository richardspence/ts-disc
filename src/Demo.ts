//interaces

interface ISquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: ISquareConfig): { color: string; area: number } {
    let newSquare = { color: "white", area: 100 };
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({ color: "black" });


//functions

//rest parameters
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}


//spread
function clone<T extends { id?: number }>(obj: T): T {
    return {
        ...(obj as object),
        id: -1
    } as T;
}
clone({
    foo: 3,
    id: 1
}).foo;

let suits = ["hearts", "spades", "clubs", "diamonds"];
interface ISuit {
    suit: string; card: number;
};

//overloads
function pickCard(input: ISuit[]): number;
function pickCard(input: number): ISuit;
function pickCard(input: ISuit[] | number): ISuit | number {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof input == "object") {
        let pickedCard = Math.floor(Math.random() * input.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof input == "number") {
        let pickedSuit = Math.floor(input / 13);
        return { suit: suits[pickedSuit], card: input % 13 };
    }
}


// classes

class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");


//inheritence

class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();


//constructor defintions

class CtorDef {
    /**
     *
     */
    constructor(private readonly _foo: string, public bar: number) {
    }

    public returnFoo() {
        return this._foo;
    }
}

new CtorDef('foo', 3).bar;
new CtorDef('foo', 3).returnFoo();

// generics

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a'); // okay, returns 1
//getProperty(x, 'notExist'); // error, returns 1

// type constraints
function moveAnimal<T extends Animal>(animal: T): T {
    animal.move();
    return animal;
}

moveAnimal(dog).bark();


// type guards

function isNumber(x: any): x is number {
    return typeof x === "number";
}

function isString(x: any): x is string {
    return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
    if (isNumber(padding)) {
        return Array(padding + 1).join(" ") + value;
    }
    if (isString(padding)) {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}

// discriminated union types w/Never

interface ISquare {
    kind: "square";
    size: number;
}
interface IRectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface ICircle {
    kind: "circle";
    radius: number;
}

interface ITriangle {
    kind: "triangle";
    radius: number;
}
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

type Shape = ISquare | IRectangle | ICircle //| ITriangle;
function area(s: Shape): number {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
        default:
            return assertNever(s);
    }
}