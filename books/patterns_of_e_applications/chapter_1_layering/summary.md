# Chapter 1 Layering

Layering benefits:
- You can understand a single layer without knowing much about the other layers
- You minimize dependencies between layers

Downsides of layers:
- Encapsulate some but not all things well. You can get sometimes cascading changes.
  The classic example is adding a field that needs to display on the UI must be added
  to every layer in between.
- Extra layers can harm performance. At every layer things typically need to be transformed
  from one representation to another.

The hardest part of a layered architecture is deciding what layers to have
and what the responsibility of each layer should be.

# The Three Principal Layers

**Presentation logic**
Is about how to handle the interaction between the user and the software.

**Data Source**
Is about communicating with other systems that carry out tasks on behalf of the application.
For most enterprise applications, the biggest piece of data source logic is a database.

**Domain Logic**
Or business logic. This is the work that this application needs to do for the domain you’re work-
ing with. It involves calculations, validations and figuring out what data source logic
to dispatch depending on commands received from the presentation.

My general advice is to choose the most appropriate form of separation for your problem
but make sure you do some kind of separation—at least at the sub-routine level.

Together with the separation, there’s also a steady rule about dependencies:
The domain and data source should never be dependent on the presentation.

One of the hardest part of working with domain logic seems to be that ppl often find difficult
ro recognize what is domain logic and what is other forms of logic.
An informal test I like is to imagine adding a radically different layer to an application,
such as a command-line interface to a Web application. If there’s any functionality you
have to duplicate in order to do this, that’s a sign of where domain logic has leaked into the presentation.
