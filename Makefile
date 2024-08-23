.PHONY: build

build:
	node build.js

update: install
	git submodule update --init --recursive
	cd js13k-compiler && git checkout master && git pull && npm install

install:
	git submodule update --init --recursive
	brew install node || sudo apt-get install -y nodejs
	brew install advancecomp || sudo apt-get install -y advancecomp
	brew install cmake || sudo apt-get install -y cmake
	cd js13k-compiler && npm install
	./install-ect.sh
	mkdir -p build
