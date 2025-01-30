# Intro

[Reference](https://www.typescriptlang.org/docs/handbook).

### Defining Types

Basic type definition

```ts
interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "Jorge",
  id: 0
}
```

It can also supports object-oriented programming, using an interface declaration with classes:

```ts
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Jorge", 1);

// Since the UserAccount class has the same properties (name and id) as the User interface,
// the instance of UserAccount is compatible with the User type.

// Explicitly Implementing the Interface:
class UserAccount implements User {
  /// ....
}
```

You can also use the next interface on functions
```ts
function deleteUser(user: User) {
  // ...
}
function getAdminUser(): User {
  //...
}
```

Typescript extend the list of available types:
- `any` Allow anything.
- `unknown` Ensure someone using this type declares what the type is.
- `never` It’s not possible that this type could happen.
- `void` A function which returns undefined or has no return value.

### Composing Types

You can create complex types by combining simple ones, there are 2 main ways, generics and
unions.

**Unions**

A type `could` be of any type, a custom boolean can be either false or true

```ts
type JorgeBool = true | false
```

