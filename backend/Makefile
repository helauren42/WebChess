VENV_DIR = venv
REQUIREMENTS = requirements.txt

$(VENV_DIR):
	python3 -m venv venv

pymodules: $(VENV_DIR) $(REQUIREMENTS)
	$(VENV_DIR)/bin/python3 $(VENV_DIR)/bin/pip install -r $(REQUIREMENTS)

all: pymodules
	cd src && ../$(VENV_DIR)/bin/python3 server.py

dev: pymodules
	cd src && ../$(VENV_DIR)/bin/python3 server.py development

initSql: pymodules
	cd src && ../$(VENV_DIR)/bin/python3 database.py

fclean: clearPyVenv
	rm -rf $(VENV_DIR)

.PHONY: all dev fclean initSql
