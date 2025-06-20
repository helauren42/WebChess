VENV_DIR = venv
REQUIREMENTS = requirements.txt

$(VENV_DIR):
	python3 -m venv venv

pymodules: $(VENV_DIR) $(REQUIREMENTS)
	$(VENV_DIR)/bin/python3 $(VENV_DIR)/lib/python3.11/site-packages/pip/__pip-runner__.py install -r $(REQUIREMENTS)

all: pymodules
	cd src && ../$(VENV_DIR)/bin/python3 server.py

fclean: clearPyVenv
	rm -rf $(VENV_DIR)

.PHONY: all fclean
