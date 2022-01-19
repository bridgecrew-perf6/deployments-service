#!/bin/bash

# This is only for my convinience, nothing functional.

PORT=${PORT:-3000}

echo "Update Data"
echo ""

for i in {1..3}; do
    echo "Creating image with id $i"

    curl -XPOST "localhost:$PORT/api/v1/image" \
        -H "content-type: application/json" \
        -d "{\"id\": \"$i\", \"version\": \"version of $i\", \"name\": \"name of $i\", \"repository\": \"repository of $i\"}"

    for j in {1..2}; do
        echo " - Creating deployment for this image"

        curl -XPUT "localhost:$PORT/api/v1/deployment" \
            -H "content-type: application/json" \
            -d "{\"imageId\": \"$i\"}"
    done
done

echo ""
echo "QUERUIES"
echo ""

deployments_count=$(curl -XGET "localhost:$PORT/api/v1/deployment/count" 2>/dev/null | jq ".count")
echo "Deployments Count: $deployments_count"

echo "Image Combinations of size 3:"
curl -XGET "localhost:$PORT/api/v1/image/combinations?length=2"