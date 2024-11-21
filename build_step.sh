#!/bin/bash

echo "Build script"

cd ./phonebook-backend

npm install

npm run build:ui

cd ../phonebook-backend/

git add . 

git commit -m "uibuild"

git push

# add the commands here