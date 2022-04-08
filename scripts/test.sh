#!/bin/bash

# Install not installed dependencies
echo "Checking dependencies"
# node.js
NODE=$(node -v)
if [ "$NODE" ]
then
  echo "Running nodejs version $NODE"
else
  echo "Installing nodejs ..."
  curl -fsSL https://rpm.nodesource.com/setup_14.x | sudo bash -
  sudo yum install -y nodejs
fi

# typescript
