#!/bin/bash

pushd Efficient-Compression-Tool
git submodule update --init --recursive
mkdir -p build
cd build
cmake ../src
make
popd
