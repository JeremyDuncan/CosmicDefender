# ==============================================================================
# This script performs a sequence of operations to update and restart the
# Docker environment of your app. It stashes any local changes, pulls the
# latest version from the main branch, applies stashed changes, removes any
# lingering server PID file, rebuilds the Docker images, and brings the
# Docker environment up.
# ------------------------------------------------------------------------------

#!/bin/bash

# Stop and remove all docker containers and networks
sudo docker-compose down

# Stash any local changes
git stash

# Pull the latest version from the main branch
git pull origin main

# Apply the stashed changes
git stash apply

# Remove the server PID file if it exists
rm tmp/pids/server.pid

# Build the Docker images
sudo docker-compose build

# Bring up the Docker environment
sudo docker-compose up
