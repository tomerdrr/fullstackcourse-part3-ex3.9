#!/bin/bash

echo "Build script"

cd ./phonebook-backend

npm install

npm run build:ui

cd ../phonebook-backend/

# add the commands here