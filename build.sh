#!/bin/bash
tsc --project tsconfig.build.json
node ./build.mjs
