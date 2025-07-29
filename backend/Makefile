VENV_DIR = venv
REQUIREMENTS = requirements.txt

$(VENV_DIR):
	python3 -m venv venv

pymodules: $(VENV_DIR) $(REQUIREMENTS)
	$(VENV_DIR)/bin/python3 $(VENV_DIR)/bin/pip install -r $(REQUIREMENTS)

initSql: pymodules
	# echo "init sql in makefile"
	cd src && ../$(VENV_DIR)/bin/python3 database.py

all: initSql
	cd src && ../$(VENV_DIR)/bin/python3 server.py

dev: initSql
	cd src && ../$(VENV_DIR)/bin/python3 server.py development

fclean: clearPyVenv
	rm -rf $(VENV_DIR)

.PHONY: all dev fclean initSql
