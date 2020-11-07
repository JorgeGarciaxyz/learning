# Representational State Transfer (REST)

## 5.1.2 Client-Server

Separation of concerns is the principle behind the client-server constraints.
By separating the user interface concerns from the data storage concerns, we improve the
portability of the user interface across multiple platforms and improve scalability by
simplifying the server components.

This separation of concerns allows the components to evolve independently, supporting
the Internet-Scale requirement of multiple organizational domains.

Client ---- Server

## 5.1.3 Stateless

Communication must be stateless in nature, as in the client-stateless-server (CSS) such
that each request from client to server must contain all of the information necessary to
understand the request, and cannot take advantage of any stored context on the server.
Session state is therefore kept entirely on the client.

This constraint induces the properties of:

**Visibility**
A monitoring system does not have to look beyond a single request in order to determine
the full nature of the request.

**Reliability**
It eases the task of recovering from partial failures.

**Scalability**
Not having to store state between requests allow the server component to free resources
and simplifies the implementation because the server doesn't have to manage resource
usage across requests.

### Disadvantages
It may decrease network performance by increasing the repetitive data
(per-interaction overhead) sent in a series of requests.

Placing the application state on the client-side reduces the server's control over
consistent application behavior, since the application becomes dependent on the correct
implementation of semantics across multiple client versions.

## 5.1.4 Cache
We add cache constraints to form the client-cache-stateless-server. Cache constraints
require that the data within a response to a request be implicitly or explicitly labeled
as cacheable or non-cacheable. If a response is cacheable, then a client cache is given
the right to reuse that response data for later, equivalent requests.

### Advantages
they have the potential to partially or completely eliminate some interactions,
improving efficiency, scalability, and user-perceived performance by reducing the
average latency of a series of interactions.

### Disadvantages
A cache can decrease reliability if stale data within the cache differs significantly
from the data that would have been obtained had the request been sent directly to the
server.

## 5.1.5 Uniform Interface

The central feature that distinguishes the REST architectural style from other
network-based styles is its emphasis on a uniform interface between components.
By applying the software engineering principle of generality to the component interface,
the overall system architecture is simplified and the visibility of interactions
is improved.

Implementations are decoupled from the services they provide, which encourages
independent evolvability.

### Tradeoffs
A uniform interface degrades efficiency, since information is transferred in a
standardized form rather than one which is specific to an application's needs.

The REST interface is designed to be efficient for large-grain hypermedia data transfer,
optimizing for the common case of the Web, but resulting in an interface that is not
optimal for other forms of architectural interaction.

** REST is defined by four interface constraints: identification of resources;
manipulation of resources through representations; self-descriptive messages; and,
hypermedia as the engine of application state.**

## 5.1.6 Layered System

In order to further improve behavior for Internet-scale requirements, we add layered
system constraints.

the layered system style allows an architecture to be composed of hierarchical layers by
constraining component behavior such that each component cannot "see" beyond the
immediate layer with which they are interacting.

By restricting knowledge of the system to a single layer, we place a bound on the overall
system complexity and promote substrate independence. Layers can be used to encapsulate
legacy services and to protect new services from legacy clients, simplifying components
by moving infrequently used functionality to a shared intermediary. Intermediaries can
also be used to improve system scalability by enabling load balancing of services across
multiple networks and processors.

### Disadvantages

They add overhead and latency to the processing of data, reducing user-perceived
performance.
For a network-based system that supports cache constraints, this can be offset by the
benefits of shared caching at intermediaries.

Placing shared caches at the boundaries of an organizational domain can result in
significant performance benefits.
Such layers also allow security policies to be enforced on data crossing the
organizational boundary, as is required by firewalls.

## 5.1.7 Code-On-Demand

REST allows client functionality to be extended by downloading and executing code in the
form of applets or scripts. This simplifies clients by reducing the number of features
required to be pre-implemented. Allowing features to be downloaded after deployment
improves system extensibility. However, it also reduces visibility, and thus is only an
optional constraint within REST.

# 5.2 REST Architectural Elements

The Representational State Transfer (REST) style is an abstraction of the architectural
elements within a distributed hypermedia system. REST ignores the details of component
implementation and protocol syntax in order to focus on the roles of components, the
constraints upon their interaction with other components, and their interpretation of
significant data elements. It encompasses the fundamental constraints upon components,
connectors, and data that define the basis of the Web architecture, and thus the essence
of its behavior as a network-based application.

## 5.2.1 Data Elements

A distributed hypermedia architect has only three fundamental options: 1) render the data
where it is located and send a fixed-format image to the recipient; 2) encapsulate the
data with a rendering engine and send both to the recipient; or, 3) send the raw data to
the recipient along with metadata that describes the data type, so that the recipient can
choose their own rendering engine.

REST provides a hybrid of all three options by focusing on a shared understanding of
data types with metadata.

REST components communicate by transferring a representation of a resource in a format
matching one of an evolving set of standard data types, selected dynamically based on the
capabilities or desires of the recipient and the nature of the resource.

Whether the representation is in the same format as the raw source, or is derived from
the source, remains hidden behind the interface.

REST therefore gains the separation of concerns of the client-server style without the
server scalability problem, allows information hiding through a generic interface to
enable encapsulation and evolution of services, and provides for a diverse set of
functionality through downloadable feature-engines.

REST's data elements

Data element and examples
- Resource
  - the indended conceptual target of a hypertext reference
- resource identifier
  - URL, URN
- representation
  - HTML doc, JPEG image
- representation metadata
  - media type, last-modified time
- resource metadata
  - source link, alternates, vary
- control data
  - if-modified-since, cache-control

## 5.2.1.1 Resources and Resource Identifiers

The key abstraction of information in REST is a resource.

A resource is a conceptual mapping to a set of entities, not the entity that corresponds
to the mapping at any particular point in time.

A resource R is a temporally varying membership function MR(t), which for time t maps to
a set of entities, or values, which are equivalent. The values in the set may be resource
representations and/or resource identifiers.

For example, the "authors' preferred version" of an academic paper is a mapping whose
value changes over time, whereas a mapping to "the paper published in the proceedings of
conference X" is static. These are two distinct resources, even if they both map to the
same value at some point in time. The distinction is necessary so that both resources can
be identified and referenced independently.

REST uses a resource identifier to identify the particular resource involved in an
interaction between components. REST connectors provide a generic interface for accessing
and manipulating the value set of a resource, regardless of how the membership function
is defined or the type of software that is handling the request. The naming authority
that assigned the resource identifier, making it possible to reference the resource, is
responsible for maintaining the semantic validity of the mapping over time
(i.e., ensuring that the membership function does not change).


## 5.2.1.2 Representations

REST components perform actions on a resource by using a representation to capture the
current or intended state of that resource and transferring that representation
between components
A representation is a sequence of bytes, plus representation metadata to describe
those bytes. Other commonly used but less precise names for a representation include:
document, file, and HTTP message entity, instance, or variant.

A representation consists of data, metadata describing the data, and, on occasion,
metadata to describe the metadata.
Metadata is in the form of name-value pairs, where the name corresponds to a standard that
defines the value's structure and semantics. Response messages may include both
representation metadata and resource metadata:
information about the resource that is not specific to the supplied representation.

Control data defines the purpose of a message between components, such as the action being
requested or the meaning of a response. It is also used to parameterize requests and
override the default behavior of some connecting elements. For example, cache behavior
can be modified by control data included in the request or response message.

The data format of a representation is known as a **media type**.
A representation can be included in a message and processed by the recipient according to
the control data of the message and the nature of the media type. Some media types are
intended for automated processing, some are intended to be rendered for viewing by a user,
and a few are capable of both. Composite media types can be used to enclose multiple
representations in a single message.

The design of a media type can directly impact the user-perceived performance of a
distributed hypermedia system. Any data that must be received before the recipient can
begin rendering the representation adds to the latency of an interaction.
A data format that places the most important rendering information up front, such that the
initial information can be incrementally rendered while the rest of the information is
being received, results in much better user-perceived performance than a data format that
must be entirely received before rendering can begin.
