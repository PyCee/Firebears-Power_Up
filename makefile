
all: test
test:
	firefox -new-window index.html
clean:
	@find . -type f \( -name '*~' \) -delete

