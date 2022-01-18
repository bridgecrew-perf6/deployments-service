# rest-api

## Milestones

__Rampup__

- [x] Baseline typescript project
- [x] Simple rest endpoint using fastify (e.g ```api/v1status/```)
- [x] API documentation mechanism
- [x] Testing platform (mocha)

__API Implementation__

- [ ] Implement ```Image``` Route at ```api/v1/image/```
- [ ] Implement ```Deployment``` Route ```api/v1/deployment/```

__Refinement__

- [ ] Implement an Authentication solution

## Project Layout

- _src/_ - Source code (typescript)
- _build/_ - Compiled code (javascript)

## Build / Run

Common tasks are configured in the [package file](./package.json).

To build the source code into the ```build/``` diectory run

    npm run build

To run the compiled code which resides in ```build/``` run

    npm start

## Usage 

Assuming the endpoint is at ```localhost:3000```

**Get Server Status**

    curl localhost:3000/api/v1/status

## Concepts

### Repository Pattern

According to requirements, we want the storage layer to be implemented using [Mongo](https://docs.mongodb.com/).

We will use the Repository pattern to abstract the implementation from the usage for 2 main reasons

1. Decoupling. Allow ourselves to change/explore technologies in the future
1. Tests. By abstracting the implementation, we can use different ones for testing.
1. Design by contract. We want to design the capabilities independent of the technology

For now, we provide the abstraction but only implement what we use - which is the ```MongoRepository``` and ```MemoryRepository```.

The ```MongoRepository``` is an implementation of the repository using a Mongo client.

The ```MemoryRepository``` is an implementation of the repository using a simple in-memory data structure - no persitence at all.
