# rest-api

## Milestones

__Rampup__

- [x] Baseline typescript project
- [x] Simple rest endpoint using fastify (e.g ```api/v1status/```)
- [x] API documentation mechanism
- [x] Testing platform (mocha)

__API Implementation__

- [x] Implement ```Image``` Route at ```api/v1/image/```
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

**Upsert an image, without metadata**

    curl -XPOST 'localhost:3000/api/v1/image' \
        -H 'content-type: application/json' \
        -d '{"id": "someid", "version": "someversion", "name": "somename", "repository": "somerepository"}'

**Get get image by id**

    curl 'localhost:3000/api/v1/image/specific-id'

**Get page of 4 images offsetted by 3**

    curl 'localhost:3000/api/v1/image?offset=3&limit=4

**Get images combinations**

> Note - The api will return the image ids, not the images themselves

> Another Note - The k-combinations algorithm was taken from elsewhere, Not I am the writer

    curl 'localhost:3000/api/v1/image/combinations

## Concepts and general comments

### Route Schemas

The schemas are defined close to usage (an owner in some sense).

The attempt here is to have each resource owned by it's router.

There are some upsides and some downsides

Upsides

1. Schemas are defined close to usage. i.e, organize by feature rather than by technique

Downsides

1. No centralization of the schemas
1. In bigger systems, routes will need to know about schemas defined/owned by other routes which might cause some coherency issues in the organization


### Repository Pattern

According to requirements, we want the storage layer to be implemented using [Mongo](https://docs.mongodb.com/).

This creates overhead than just use ```fastify-mongodb``` and ```this.mongo.db.do_something``` (for example) but I strongly believe this is an important abstraction - "The dependencies should point towards the abstraction".

We will use the Repository pattern to abstract the implementation from the usage for 2 main reasons

1. Decoupling. Allow ourselves to change/explore technologies in the future
1. Tests. By abstracting the implementation, we can use different ones for testing.
1. Design by contract. We want to design the capabilities independent of the technology

For now, we provide the abstraction but only implement what we use - which is the ```MongoRepository``` and ```MemoryRepository```.

The ```MongoRepository``` is an implementation of the repository using a Mongo client.

The ```MemoryRepository``` is an implementation of the repository using a simple in-memory data structure - no persitence at all.

### Tests

There are so many tests that can be made. I demonstrated core ones, not intended as a full suite.