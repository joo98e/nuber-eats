type NuberEatsServiceType = "delivery" | "takeOut" | "inner";

type UpperNuberEatsServiceType = Capitalize<NuberEatsServiceType>;
type OnUpper = `on${UpperNuberEatsServiceType}`;

type Test = {
  [key in UpperNuberEatsServiceType]: string;
};

type OnUpperCase = {
  [key in OnUpper]: string;
};

const onUpperCase: OnUpperCase = {
  onDelivery: "",
  onTakeOut: "",
  onInner: ""
};

const testingConstant: Test = {
  Delivery: "",
  TakeOut: "",
  Inner: ""
};

// ------------------------------------------------------------------------------------------------------------

class Tester {
  static A = new Tester("A", "테스터1");
  static B = new Tester("B", "테스터2");
  static C = new Tester("C", "테스터3");

  constructor(readonly _name: string, readonly _desc: string) {
  }

  static values(): Tester[] {
    return [this.A, this.B, this.C];
  }

  static keys(): string[] {
    return this.values().map((tester) => tester._name);
  }
}

type isValues = ReturnType<typeof Tester.values>;

// ------------------------------------------------------------------------------------------------------------

class Model {
  static A = new Model({ name: "apple", age: 29 });

  constructor(
    readonly options: {
      name: string;
      age: number;
    }
  ) {
  }

  static values() {
  }
}

function create<Class, Optional>(C: { new(U): Class }, options: Optional): Class {
  return new C(options);
}

create<
  Model,
  {
    name: string;
    age: number;
  }
>(Model, {
  name: "good",
  age: 29
});

// ------------------------------------------------------------------------------------------------------------
type RegisterType = "email" | "kakao";

class Person {
  constructor(_name) {
  }
}

class User extends Person {
  constructor(readonly _name: string, readonly _register: RegisterType) {
    super(_name);
  }
}

const user1 = new User("john", "email");
const user2 = new User("katalina", "kakao");
const user3 = new Person("cay");

type UserOrPerson = User extends Person ? RegisterType : Person;

function getUserRegisterKind(user: User | Person): UserOrPerson {
  // @ts-ignore
  if (user._register === "email") {
    return "email";
  }

  return <"email" | "kakao">user;
}

getUserRegisterKind(user1);

const arr = ["ab", "bc", "cd", "de"] as const;
type ArrType = {
  [key in Capitalize<typeof arr[number]>]: any;
};

type PartialArrType = Partial<ArrType>;

const imply: ArrType = {
  Ab: "",
  Bc: "",
  Cd: "",
  De: ""
};

const partialImply: PartialArrType = {
  Bc: "",
  Cd: ""
};

const t = [0, null, undefined, "a"];

interface Example {
  foo: string;
}

type Good = {
  a: NonNullable<{
    name: string | null;
    age: number;
  }>;
};

const good: Good = {
  a: {
    name: null,
    age: undefined
  }
};

/**
 * declare
 * namespace
 * never
 * infer
 * ReturnType
 * Capitalize
 *
 * Partial<T>
 *     ArrayLike<T>
 * Required<T>
 *     Readonly<T>
 *         Pick<T, K extends keyof T>
 *             Record<K extends keyof any, T>
 *                 Exclude<T, U> = T extends U ? never : T
 *                 Extract<T, U> = T extends U ? T : never;
 *                 Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
 *                 NonNullable<T> = T & {};
 */

// type CustomKeyType = "apple" | "banana";
const customKeyType = ["apple", "banana", "grape", "very"] as const;
export type CustomKeyType<T extends typeof customKeyType[number]> = CustomKeyMap[T];

type CustomKeyMap = {
  apple: () => boolean;
  banana: (num: number) => number;
  grape: () => void;
  very: () => string;
};


const a: CustomKeyType<"apple"> = () => false;