# The Grand Unified Theory - Jim Weirich

[Link to the talk](https://www.youtube.com/watch?v=NLT7Qcn_PmI)

Acts as Conference 2009

# Coupling & Cohesion

**Cohesion**: How well together your software fits

**Coupling**: How different parts of the program relates to each other

You want high cohesion between your models and low coupling between these.

_Low coupling_: a change on this module has no effect on this other module

Is its impossible to create a working software without any coupling because they need to
talk to each other in a way.

### Coupling levels (from high to low)

**1. Content Coupling**

When you get into the bottom of some module and modify something there
- Monkey Patch
- Violating private scopes

**2. Common Coupling** (Global Data) Structured Data

**3. External Coupling** (Global Data) Simple Data

**4. Control Coupling**
- Method has a flag parameter
- The flag control which algorithm to use

Symptoms:
- The word "OR" in description
- Flag value is arbitrary and not related to problem domain

Examples of this

`Array.instance_methods` return the instance methods based if the param is true or false

```ruby
# There is no way to know which one is which
# The instance methods in mod are returned OTHERWISE (or) the methods in mod and mods
# superclasses are returned
#
# The solution of this is to create two different methods
Array.instance_methods(true)
Array.instance_methods(false)
```

Find method on Rails (this is probably outdated)
```ruby
Customer.find(:first, ...) # first OR...
                           # returns object
Customer.find(:all, ...)   # returns List of objects
```

**5. Stamp Coupling** (Local Data) Structured Data

**6. Data Coupling** (Local Data) Simple Data

### Global Data
When two classes share a common data (fixtures) they have coupling (global data)

### Local Data
Passing parameters is a type of local data

### Structured Data
User objects, complex

### Simple Data
Integers, strings, primitives, etc.

# Recommended lecture

What every programmer should know about object oriented design - Meilir Page-Jones

Part 3 Design principles of object oriented design

# Connascence

Things that are born together and raise together.

Two pieces of software share _connascence_ when a changes in one requires a
corresponding change in the other.

## Connascence of name

```ruby
class Customer
  def email; end
end

def send_mail(customer)
  customer.email
  ...
end
```

^ email is the connascence, _connascence of name_

If you rename the method email, you must change every .email reference.

This can exists between your code or things that are not your code, for example
`email` on the database schema.

There is also a connascence between the parameter `customer` and the usage of this.
Connascence can live everywhere.

continue watching on min 21:49
