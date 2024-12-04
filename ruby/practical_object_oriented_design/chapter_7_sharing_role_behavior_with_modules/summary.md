# Chapter 7 Sharing Role Behavior with Modules

What can happens when you need to reuse some of the code from inheritance but also a behavior
from other class? Using inheritance isn't always the best solution.

To receive the benefits from inheritance, you also need to know when it makes sense
to do so. Using classical inheritance is optional, every problem it solves can be solved
another way.
Creating the most cost-effective application requires making informed tradeoffs between the relative
costs and likely benefits of alternatives.

## 7.1 Understanding roles

Some problems require sharing behavior among otherwisse unrelated objects. This behavior is
orthogonal to class, it's a `role` an object plays.

It's common to discover unanticipated roles as you write the code.

When unrelated objects begin to play a common role, they enter into a relationship with the
objectss for whom they play the role. These relationships are not as visible as those created
by the subclass/superclass but they exist nonetheless.

### 7.1.1 Finding Roles

The `Preparer` duck type from chapter 5 is a role. Objects that implement `Preparer` interface play
this role. `Mecanic, TripCoordinator, Driver` each implement `prepare_trip` therefore other
objects can interact with them as if they're `Preparers` without concern of their underlying
class.

The existence of a `Preparer` role suggests that there's also a `Preparable` role. The `Trip`
class acts as a `Preparable` it implements the `Preparable` interface.
This interface includess all of the messages that any `Preparer` might expect to send to a
`Preparable`. In this case, the methods `bikes, customers, vehicle`.

The `Preparer` Role has multiple players it's simple defined by its interface. To play this
role, an object need to implement it's own personal version of `prepare_trip`.
Objects that act as `Preparer` have only this interface in common.

On Ruby this is achieved bby `modules`, these are a group of independent methods mixed into
any class.

Once you start putting code into modules and adding modules to objects, you enter a new realm
of complexity.
The total set of messages to which an object can respond includes:
- Those it implements
- Those implemented by objects in the hierarchy
- Those implemented in any module
- Those implemented in any module added to an object in the hierarchy

