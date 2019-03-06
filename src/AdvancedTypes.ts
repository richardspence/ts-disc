class Box<T = string>{
    type: T;
}

type AllBoxes = MediaBox | TrackHeaderBox;

interface Box {
    findBoxes<T extends AllBoxes, K extends string>(boxName: K): T extends { type: K } ? T[] : never;
    findFirst<T extends AllBoxes, K extends string>(boxName: K): T extends { type: K } ? T : never;
}

class MediaBox extends Box<'mdhd'>{
    fields: {
        bar: string;
    }
}

class TrackHeaderBox extends Box<'tkhd'>{
    fields: {
        foo: number;
    }
}

var b = new Box();
const mediaBox = b.findFirst('mdhd');
mediaBox.fields.bar;
mediaBox.toString;
const unkBox = b.findFirst('sdss');
unkBox.toString;


/*** Augmentation */
interface IMixinExample {
    foo: number;
}
interface IMixin<TReturnType, TMixin> {
    new(...args: any[]): TReturnType & TMixin
}

type Constructor = new (...args: any[]) => any;
type Filter<T, U> = { [K in keyof T]: (T[K] extends U ? never : T[K] )};
function mixin<T extends Constructor, TMixin extends Constructor>(ctor: T, mixin: TMixin)
    : T extends (new (...args: any[]) => infer R)
    ? TMixin extends (new () => infer M)
    ? IMixin<R, M> & T & Filter<TMixin, new ()=> M>
    : never
    : never {
    const augmentedClass = class extends ctor {

    } as any;
    for (var i in mixin.prototype) {
        if (mixin.prototype.hasOwnProperty(i) && i !== 'constructor') {
            augmentedClass.prototype[i] = mixin.prototype[i];
        }
    }

    for (var staticProps in mixin) {
        if (mixin.hasOwnProperty(staticProps)) {
            augmentedClass[staticProps] = mixin.prototype[staticProps];
        }
    };
    return augmentedClass as any;
}


function decorator<T extends new (...args: any[]) => any>(ctor: T)
    : T extends (new (...args: any[]) => infer R)
    ? new (...args: any[]) => IMixinExample & R : T {
    //todo: add implementation
    return null;
}

function thingMixin<T extends new (...args: any[]) => ITimestampThing, TMixin>(ctor: T, mixin: new () => TMixin)
    : T extends (new (...args: any[]) => infer R)
    ? IMixin<R, TMixin> : T {
    return null;
}

interface ITimestampThing {
    startPosition: number;
}

class Foo implements ITimestampThing {
    constructor(public startPosition: number) {
    }
}

class ThingToMixin {
    public toMS(): number {
        return this.startPosition / 1000;
    }

    public static Foo() {

    }
}

class Bar {

}

// let AgumentedBar = thingMixin(Bar, ThingToMixin);

//declaration merging based on matching Symbol
// this allows the `this` parameter in ThingToMixin to access members defined in ITimestampThing
interface ThingToMixin extends ITimestampThing {
}

let AugmentedFoo = mixin(Foo, ThingToMixin);
var f = new AugmentedFoo(3);
var f2 = new AugmentedFoo(); //notice it doen't merge in the default constructor of ThingToMixin
f.toMS();
AugmentedFoo.


// typically this would be your decorator definition, but....
@decorator
class Foo2 extends Foo { }

var f2 = new Foo2(3);
f2.baz;
f2.foo;


/***** Transformations */


type IFieldMappings = {
    [key: string]: IReadableType;
}

type MappedFields<T> = {
    [K in keyof T]: MapReturnType<T[K]>
}
type MapReturnType<T> = T extends 'string' ? string
    : T extends 'int32' ? number
    : never;

type IReadableType = 'int32' | 'string';


function mapFields<T extends IFieldMappings>(fieldMappings: T): MappedFields<T> {
    return null;
}


var mappedResult = mapFields({
    baz: 'int32',
    bar: 'string'
});
mappedResult.bar = 'foo';
mappedResult.baz = 3;

/** note: this doesn't work */
var fields: IFieldMappings = {
    baz: 'int32',
    bar: 'string'
};
var mappedResult2 = mapFields(fields);
//notice it lost the typings and foo = string | number
mappedResult2.foo;
