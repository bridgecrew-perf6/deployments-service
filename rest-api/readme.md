# rest-api

## Milestones

__Rampup__

- [x] Baseline typescript project
- [x] Simple rest endpoint using fastify (e.g ```api/v1status/```)
- [x] API documentation mechanism
- [x] Testing platform (mocha)

__API Implementation__

- [x] Implement ```Image``` Route at ```api/v1/image/```
- [x] Implement ```Deployment``` Route ```api/v1/deployment/```

__Refinement__

- [x] Implement hook to write to file on deployment creation
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

**Create new deployment**

    curl -XPUT 'localhost:3000/api/v1/deployment' \
    -H 'content-type: application/json' \
    -d '{ "imageId": "specific-id" }'

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

### Writing to counts.txt file

What we wanted to do

1. When a deployment has been created
2. Incremet the value inside counts.txt

To do this there are couple of approaches, I chose a simple one that works well - It can have some performance impacts on some scenarios though.

The first thing to note is that we need to handle system events. This is a good reason to introduce a local event bus to the system - Otherwise the router will be the entity to invoke filesystem manipulation, pretty bad. Using the event bus approach, we can bootstrap the logic in the server creation and have the logic decoupled from the events themselves. We can even consider having the event emission be in the repository instead of the router (I believe it's preferable but left it as is since currently there is no technical difference).

Another benefit of the decopuling is that we won't do this IO in the route tests. We can, and should add tests to assert that the events are emitted, and have other tests to assert that the increment logic is correct.

The other thing to note is possible race conditions. Take a scenario of the instances running on the same machine, attempting to increment the value of the same file - This operation is obviously not atomic. In the current solution we used a named mutex that is operated the the OS level and is cross processes. It can introduce performance issues (in this scenario there are probably bottlenecks before this).

To summarize, the logic of incrementing the value is scoped inside a mutex lock/unlock and is triggered from the event bus.

### Tests

There are so many tests that can be made. I demonstrated core ones, not intended as a full suite.