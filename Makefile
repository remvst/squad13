.PHONY: build

build:
	node build.js

update: install
	git submodule update --init --recursive
	cd js13k-compiler && git checkout master && git pull && npm install

install:
	git submodule update --init --recursive

	if which brew ; then
		brew install \
			node \
			advancecomp \
			cmake
	else
		sudo apt-get install -y \
			nodejs \
			advancecomp \
			cmake
	fi

	cd js13k-compiler && npm install
	./install-ect.sh
	mkdir -p build
