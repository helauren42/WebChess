CREATE USER IF NOT EXISTS 'chessUser'@'%' IDENTIFIED BY 'p1';
GRANT ALL PRIVILEGES ON *.* TO 'chessUser'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS webchess;
USE webchess;
CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) PRIMARY KEY NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_wins INT DEFAULT 0,
        total_loss INT DEFAULT 0
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
CREATE TABLE IF NOT EXISTS global_chat (
        id INT AUTO_INCREMENT PRIMARY KEY,
        time INT NOT NULL,
        sender VARCHAR(255) NOT NULL,
        message VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS active_games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gameId VARCHAR(255) NOT NULL UNIQUE,
    challenger VARCHAR(255) NOT NULL,
    challenged VARCHAR(255) NOT NULL,
    challengerColor VARCHAR(255) NOT NULL,
    challengedColor VARCHAR(255) NOT NULL,
    playerTurn VARCHAR(255) NOT NULL,
    capturedWhitePieces VARCHAR(255) NOT NULL,
    capturedBlackPieces VARCHAR(255) NOT NULL,
    boardStr TEXT NOT NULL
);

