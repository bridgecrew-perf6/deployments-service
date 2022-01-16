# rest-api

## Milestones

__Rampup__

- [x] Baseline typescript project
- [ ] Simple rest endpoint using fastify (e.g ```status/```)
- [ ] API documentation mechanism
- [ ] Testing platform (jest / mocha)
    - How about black boxes for the API?

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
