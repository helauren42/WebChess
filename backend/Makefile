VENV_DIR = venv
REQUIREMENTS = requirements.txt

$(VENV_DIR):
	python3 -m venv venv

pymodules: $(VENV_DIR) $(REQUIREMENTS)
	$(VENV_DIR)/bin/python3 $(VENV_DIR)/bin/pip install -r $(REQUIREMENTS)

initSql: pymodules
	$(VENV_DIR)/bin/python3 src/database.py

all: pymodules initSql
	$(VENV_DIR)/bin/python3 src/server.py

dev: pymodules initSql
	$(VENV_DIR)/bin/python3 src/server.py development

fclean: clearPyVenv
	rm -rf $(VENV_DIR)

.PHONY: all dev fclean initSql
