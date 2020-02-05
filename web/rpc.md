# RPC

[article](https://www.smashingmagazine.com/2016/09/understanding-rest-and-rpc-for-http-apis/)

## Meaning
RPC stands for "remote procedure call" its essentially the same as calling a function and sending arguments.

Example of RPC call
```
POST /sayHello HTTP/1.1
HOST: api.example.com
Content-Type: application/json
{"name": "Racey McRacerson"}
```

### REST vs RPC

> RPC-based APIs are great for actions (that is, procedures or commands). Most uses only POST and GET

> REST-based APIs are great for modeling your domain (that is, resources or entities), making CRUD (create, read, update, delete) available for all of your data.

For example, given the case "send message to user" can be created as

RPC
```
POST /sendMessage
{ "id": 1, "message": "hello"}
```

REST
```
POST /user/:id/messages
{ "message": "hello" }
```

### Rule of thumb
- *RPC*: its mostly actions
- *REST*: its mostly CRUD and manipulating related data

## Extra insights

- You can have multiple APIs managing CRUD on REST services and few RPC services for actios
- Use REST when makes sense or RPC if its more appropiate

Given the next problem: 
> We have a REST API to manage a web hosting company. We can create new server instances and assign them to users, which works nicely, but how do we restart servers and run commands on batches of servers via the API in a RESTful way?

Best thing you can do is create 2 RPC style (it can be on REST but its gonna be ugly)services
- `POST /restartServer`
- `POST /execServer`
