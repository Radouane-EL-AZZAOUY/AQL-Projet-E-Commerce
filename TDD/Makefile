# Fizz TDD — compile and run with JUnit 5
JAVAC := javac
JAVA  := java
BUILD := build
LIBS  := libs
PKG   := tdd
SOURCES := Fizz.java FizzTest.java
CLASSES := $(BUILD)/tdd/Fizz.class $(BUILD)/tdd/FizzTest.class
JUNIT_VERSION := 1.11.3
JUNIT_JAR := $(LIBS)/junit-platform-console-standalone-$(JUNIT_VERSION).jar
JUNIT_URL := https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/$(JUNIT_VERSION)/junit-platform-console-standalone-$(JUNIT_VERSION).jar

ifeq ($(OS),Windows_NT)
	CP_SEP := ;
	MKDIR_BUILD := powershell -NoProfile -Command "New-Item -ItemType Directory -Force '$(BUILD)' | Out-Null"
	MKDIR_LIBS := powershell -NoProfile -Command "New-Item -ItemType Directory -Force '$(LIBS)' | Out-Null"
	DOWNLOAD_JUNIT := powershell -NoProfile -Command "Invoke-WebRequest -Uri '$(JUNIT_URL)' -OutFile '$(JUNIT_JAR)'"
	CLEAN := powershell -NoProfile -Command "Remove-Item -Recurse -Force -ErrorAction SilentlyContinue '$(BUILD)','$(LIBS)'"
else
	CP_SEP := :
	MKDIR_BUILD := mkdir -p $(BUILD)
	MKDIR_LIBS := mkdir -p $(LIBS)
	DOWNLOAD_JUNIT := curl -fsSL -o "$(JUNIT_JAR)" "$(JUNIT_URL)"
	CLEAN := rm -rf $(BUILD) $(LIBS)
endif

TEST_CP := $(BUILD)$(CP_SEP)$(JUNIT_JAR)

.PHONY: all compile run test clean help junit

all: run

help:
	@echo "make / make run  — compile and run Fizz demo (main)"
	@echo "make test        — run JUnit 5 tests"
	@echo "make compile     — compile only (output in $(BUILD)/)"
	@echo "make junit       — download JUnit console standalone jar"
	@echo "make clean       — remove $(BUILD)/ and $(LIBS)/"

junit: $(JUNIT_JAR)

$(JUNIT_JAR):
	$(MKDIR_LIBS)
	$(DOWNLOAD_JUNIT)

compile: junit $(CLASSES)

$(CLASSES): $(SOURCES)
	$(MKDIR_BUILD)
	$(JAVAC) -cp "$(JUNIT_JAR)" -d $(BUILD) $(SOURCES)

run: compile
	$(JAVA) -cp $(BUILD) $(PKG).Fizz

test: compile
	$(JAVA) -jar "$(JUNIT_JAR)" execute --class-path "$(BUILD)" --scan-class-path

clean:
	$(CLEAN)
