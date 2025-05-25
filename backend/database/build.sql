CREATE USER IF NOT EXISTS 'chessUser'@'localhost' IDENTIFIED BY 'wernewu34378@!%^2354';
GRANT ALL PRIVILEGES ON webchess.* TO 'chessUser'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS webchess;
USE webchess;
CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) PRIMARY KEY NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_wins INT DEFAULT 0,
        total_loss INT DEFAULT 0,
        current_game VARCHAR(60000) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS email_verification (
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        code INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS session_tokens (
        session_token VARCHAR(255) PRIMARY KEY NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS persistent_tokens (
        persistent_token VARCHAR(255) PRIMARY KEY NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS global_chat(
        time TIMESTAMP PRIMARY KEY DEFAULT CURRENT_TIMESTAMP,
        username VARCHAR(255) NOT NULL,
        message VARCHAR(255) NOT NULL
);
