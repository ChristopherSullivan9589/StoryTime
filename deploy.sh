#!/bin/bash

# Get timestamp for unique tag
TAG=$(date +%Y%m%d-%H%M%S)

echo "Building and deploying with tag: $TAG"

# Build and push
docker build -t capstone-project .
docker tag capstone-project:latest 074360086044.dkr.ecr.us-east-1.amazonaws.com/capstone-project:$TAG
docker tag capstone-project:latest 074360086044.dkr.ecr.us-east-1.amazonaws.com/capstone-project:latest
docker push 074360086044.dkr.ecr.us-east-1.amazonaws.com/capstone-project:$TAG
docker push 074360086044.dkr.ecr.us-east-1.amazonaws.com/capstone-project:latest

echo "Image pushed. Update your ECS service to deploy changes."