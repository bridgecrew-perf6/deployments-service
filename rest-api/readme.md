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