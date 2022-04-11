#!/bin/bash
BUNDLE='test'
rm -rf bundle
mkdir bundle
mkdir ./bundle/app
mv ./scripts ./bundle
mv ./app.config.js ./bundle
mv ./bundles/$BUNDLE/* ./bundle/app/
mv ./appspec.yml ./bundle
gulp bundle --client=$BUNDLE