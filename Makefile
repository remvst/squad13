.PHONY: build

build:
	npm run build

update: install
	git submodule update --init --recursive

install:
	git submodule update --init --recursive
	brew install node || sudo apt-get install -y nodejs
	brew install advancecomp || sudo apt-get install -y advancecomp
	brew install cmake || sudo apt-get install -y cmake
	./install-ect.sh
