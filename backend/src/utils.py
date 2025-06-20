import logging
import os

from const import ENV_PATH

def getEnv(variable:str)-> str:
    with open(ENV_PATH, "r") as file:
        lines = file.readlines()
        for line in lines:
            split = line.split("=")
            if len(split) == 2:
                key = split[0].strip()
                value = split[1].strip()
                if key == variable:
                    return value
    raise Exception(f"Variable {variable} not found in .env")

def setup_logging():
    log_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "logs"))
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "app.log")

    logger = logging.getLogger("chess_app")
    logger.setLevel(logging.DEBUG)
    logger.propagate = False  

    logger.handlers.clear()

    file_handler = logging.FileHandler(log_file, mode='a')
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )
    file_handler.setFormatter(file_formatter)

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )
    console_handler.setFormatter(console_formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    logger.info("Logging initialized for chess_app")
    return logger

logger = setup_logging()
