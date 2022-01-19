# rest-api

## Milestones

__Rampup__

- [x] Baseline typescript project
- [x] Simple rest endpoint using fastify (e.g ```api/v1/status/```)
- [x] API documentation mechanism
- [x] Testing platform (mocha)

__API Implementation__

- [x] Implement ```Image``` Route at ```api/v1/image/```
- [x] Implement ```Deployment``` Route ```api/v1/deployment/```

__Refinement__

- [x] Implement hook to write to file on deployment creation
- [ ] Implement an Authentication solution

__Left out__

- [ ] Monitoring Infrastructure
- [ ] Logging Infrastructure

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

## Docker

The container receives all available configurations through environment variables. Docker is docker and this scenario is no special - Still, some examples on how to run are below

Build the image

    # cwd is rest-api/
    docker build -t tglanz/rest-api .

Run the server using default configuration (with memory storage) which will receive remote request and will listen on port 4545

    docker run --rm -p 3000:4545 \
        -e DEPLOYMENTS_SERVICE_API_HOST=0.0.0.0 \
        tglanz/rest-api


Run the server at port 3000, listen on external requests and configure to use mogno as storage 

    docker run --rm -p 3000:3000
        -e DEPLOYMENTS_SERVICE_API_HOST=0.0.0.0 \
        -e DEPLOYMENTS_SERVICE_REPOSITORY_TYPE=mongo \
        -e DEPLOYMENTS_SERVICE_REPOSITORY_HOST=mongohost \
        tglanz/rest-api

### Compose

Provided a ```docker-compose.yaml``` definition at the root of the project which ramps a mongo instance and 3 instances of the rest apis, with a mounted directory containing the ```counts.txt``` file. Ideally we could use the ```--scale``` feature to scale the rest-api but there are some issues in the current compose version and I didn't want to downgrade (related to the port allocation using ranges).

To compose run

    docker-compose up

The 3 rest api instances will listen on ports 5000, 5001 and 5002 and the ```counts.txt``` will be located at ```mount/counts.txt``` and is pracitcally shared among the instances.

## Concepts and general comments

General guideline - Fastify and json-schema are new to me. I don't think that I capitalized on them the most elegantly, but my attempt was to isolate features from technologies, and features/technologies from one another. This approach will hopefuly prove good when improving the codebase (when learning more about those tools) and modifying/implementing features.

### Models seperation

I Chose to differentiate between different models for the (seemingly) same concepts. Meaning, If we take the ```Image``` model for example, we have multiple definitions for it

1. Type definition - Used throughout the system
1. Schema for the routes (json-schema)
1. Schema for mongoose

Those are not the same, Their similiarity is coincidential and is not a DRY violation, but a following of the Single Responsibility Principle.

To prove the point, we can tell in the code that Mongo related code is only at ```mongo-repository```. Json serialization/validation only exists in the routers (Except some that are used by multiple routes so are externalized).

From an architecture pov, the ```Image``` type model the core domain, json-schema's Schema and mongoose's schemas are supportive and are implementation details.

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

Using this patter creates overhead than just use ```fastify-mongodb``` and ```this.mongo.db.do_something``` (for example) but I strongly believe this is an important abstraction - "The dependencies should point towards the abstraction".

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
