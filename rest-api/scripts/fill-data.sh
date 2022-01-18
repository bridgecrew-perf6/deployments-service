#!/bin/bash

PORT=${PORT:-3000}

for i in {1..3}; do
    curl -XPOST "localhost:$PORT/api/v1/image" \
        -H "content-type: application/json" \
        -d "{\"id\": \"$i\", \"version\": \"someversion\", \"name\": \"somename\", \"repository\": \"somerepository\"}"

    for j in {1..2}; do
        curl -XPUT "localhost:$PORT/api/v1/deployment" \
            -H "content-type: application/json" \
            -d "{\"imageId\": \"$i\"}"
    done
done

