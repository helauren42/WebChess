from datetime import datetime
from utils import getEnv, logger
import mysql
import mysql.connector
from mysql.connector.abstracts import MySQLCursorAbstract
import subprocess
from typing import Optional

from schemas import LoginRequest, SignupRequest
from board import Board
from game import OnlineGame

from const import ENV_PATH, DB_DIR

class AbstractDb():
    def __init__(self):
        self.host:str = ""
        self.user:str = ""
        self.password:str = ""
        self.name:str = ""
        self.table_users:str = ""
        self.table_email_verification:str = ""
        self.table_session_token:str = ""
        self.table_persistent_token:str = ""
        self.table_global_chat:str = ""
        self.table_active_games:str = ""
        self.fetchCredentials()
        self.setupCursor()
        # self.createDb()
    def setupCursor(self):
        # self.cnx = mysql.connector.connect(host=self.host, port=3306, user=self.user, password=self.password, database=self.name, auth_plugin='mysql_native_password', autocommit=True)
        self.cnx = mysql.connector.connect(host=self.host, port=3306, user=self.user, password=self.password, database=self.name, autocommit=True)
        self.cursor = self.cnx.cursor()
        # self.cursor.execute(f"USE {self.name}")
    def createBuildFile(self):
        # subprocess.run(["touch build.sql"], shell=True, cwd=DB_DIR)
        lines:list[str] = []
        with open(f"{DB_DIR}create.sql", "r") as readfile:
            lines = readfile.readlines()
            for i in range(len(lines)):
                lines[i] = lines[i].replace("DB_HOST", self.host)
                lines[i] = lines[i].replace("DB_USER", self.user)
                lines[i] = lines[i].replace("DB_PASSWORD", self.password)
                lines[i] = lines[i].replace("DB_NAME", self.name)
                lines[i] = lines[i].replace("DB_TABLE_USERS", self.table_users)
                lines[i] = lines[i].replace("DB_TABLE_EMAIL_VERIFICATION", self.table_email_verification)
                lines[i] = lines[i].replace("DB_TABLE_SESSION_TOKEN", self.table_session_token)
                lines[i] = lines[i].replace("DB_TABLE_PERSISTENT_TOKEN", self.table_persistent_token)
                lines[i] = lines[i].replace("DB_TABLE_GLOBAL_CHAT", self.table_global_chat)
                lines[i] = lines[i].replace("DB_TABLE_ACTIVE_GAMES", self.table_active_games)
        return lines
    def createDb(self):
        logger.info(f"creating database")
        lines = self.createBuildFile()
        for line in lines:
            cmd = line.strip("; \n")
            self.cursor.execute(cmd)
        logger.info(f"running subprocess excecuting mysql build")
        # subprocess.run(f"mysql -u {getEnv('SYSTEM_USER')} < {DB_DIR}build.sql", shell=True)
        # subprocess.run(["rm build.sql"], shell=True, cwd=DB_DIR)
    def fetchCredentials(self):
        with open(ENV_PATH, "r") as file:
            lines = file.readlines()
            for line in lines:
                split = line.split("=")
                if len(split) == 2:
                    key = split[0].strip()
                    value = split[1].strip()
                    if key == "DB_HOST":
                        self.host = value
                    elif key == "DB_USER":
                        self.user = value
                    elif key == "DB_PASSWORD":
                        self.password = value
                    elif key == "DB_NAME":
                        self.name = value
                    elif key == "DB_TABLE_USERS":
                        self.table_users = value
                    elif key == "DB_TABLE_EMAIL_VERIFICATION":
                        self.table_email_verification = value
                    elif key == "DB_TABLE_SESSION_TOKEN":
                        self.table_session_token = value
                    elif key == "DB_TABLE_PERSISTENT_TOKEN":
                        self.table_persistent_token = value
                    elif key == "DB_TABLE_GLOBAL_CHAT":
                        self.table_global_chat = value
                    elif key == "DB_TABLE_ACTIVE_GAMES":
                        self.table_active_games = value
    def validLoginPassword(self, user, password):
        self.cursor.execute(f"SELECT password FROM {self.table_users} WHERE username=%s", (user,))
        fetched = self.cursor.fetchone()
        found = fetched[0]
        if found == password:
            return True
        return False
    def userExists(self, username):
        logger.info(f"username: {username}")
        self.cursor.execute(f"SELECT username FROM {self.table_users} WHERE username=%s", (username,))
        fetched = self.cursor.fetchone()
        logger.info(f"fetched: {fetched}")
        if fetched == None:
            return False
        return True
    def fetchUserData(self, username):
        self.cursor.execute(f"SELECT * FROM {self.table_users} WHERE username=%s", (username,))
        columns = self.cursor.fetchone()
        # todo
        # return userData
    def fetchUserFromToken(self, token:str):
        logger.info(f"searching for token: {token}")
        self.cursor.execute(f"SELECT * FROM {self.table_users} WHERE sessionToken=%s", (token,))
        columns = self.cursor.fetchone()
        logger.info(f"columns: {columns}")
        if columns == None:
           return None
    def insertNewUser(self, req: SignupRequest):
        query = f"INSERT INTO {self.table_users} (username, password, email) VALUES (%s, %s, %s)"
        values = (req.username, req.password, req.email)
        logger.info(f"query: {query}")
        logger.info(f"values: {values}")
        self.cursor.execute(query, values)
        logger.info(f"end")

class Database(AbstractDb):
    def __init__(self):
        super().__init__()
    def fetchUsername(self, token) -> Optional[str]:
        query = f"SELECT username FROM {self.table_session_token} WHERE session_token=%s"
        values = (token,)
        self.cursor.execute(query, values)
        found = self.cursor.fetchone()
        if found != None:
            return found[0]
        query = f"SELECT username FROM {self.table_persistent_token} WHERE persistent_token=%s"
        self.cursor.execute(query, values)
        found = self.cursor.fetchone()
        if found != None:
            return found[0]
        return None
    def addSessionToken(self, username, sessionToken):
        query = f'''INSERT INTO {self.table_session_token} (session_token, username) VALUES(%s, %s)'''
        values = (sessionToken, username)
        self.cursor.execute(query, values)
    def addPersistenceToken(self, username, persistentToken):
        query = f'''INSERT INTO {self.table_persistent_token} (persistent_token, username) VALUES(%s, %s)'''
        values = (persistentToken, username)
        self.cursor.execute(query, values)
    def insertValidationCode(self, email, code):
        self.cursor.execute(f"DELETE FROM {self.table_email_verification} WHERE email=%s", (email, ))
        query = f"INSERT INTO {self.table_email_verification} (email, code) VALUES(%s, %s)"
        values = (email, code)
        self.cursor.execute(query, values)
    def validateCode(self, email, code) -> bool:
        query = f"SELECT code FROM {self.table_email_verification} WHERE email=%s"
        values = (email, )
        self.cursor.execute(query, values)
        found = self.cursor.fetchone()
        if found != None and found[0] == code:
            logger.info(f"found code: {found[0]}")
            self.cursor.execute(f"DELETE FROM {self.table_email_verification} WHERE email=%s", (email,))
            return True
        logger.info(f"did not find code found = {found}")
        return False
    def validateSignupForm(self, req: SignupRequest):
        usernameAlreadyTaken = self.userExists(req.username)
        if usernameAlreadyTaken:
            logger.debug(f"username {req.username} already taken")
            raise Exception(409, "Username already taken")
        else:
            logger.debug(f"username {req.username} available")
    def createAccount(self, req: SignupRequest) -> bool:
        logger.info(f"adding user to db: {req.username}")
        try:
            self.insertNewUser(req=req)
        except Exception as e:
            logger.critical(f"Could not write to db: {e}")
            raise Exception(500, "Server failed to create user")
        return True
    def loginUser(self, req: LoginRequest) -> bool:
        if not self.userExists(req.username):
            logger.info(f"user does not exist")
            raise Exception("wrong credentials")
        if self.validLoginPassword(req.username, req.password):
            return True
        logger.info(f"entered password is wrong")
        raise Exception("wrong credentials")
    def addGlobalChatMessage(self, time:int, sender:str, message:str):
        query = f"INSERT INTO {self.table_global_chat} (time, sender, message) values(%s,%s,%s)"
        values = (time, sender, message)
        self.cursor.execute(query, values)
    def trimGlobalChatTable(self):
        self.cursor.execute(f"SELECT * FROM {self.table_global_chat}")
        found = self.cursor.fetchall()
        logger.info(f"{found}")
        # todo 
    def getGlobalChatHistory(self):
        self.cursor.execute('''SELECT * FROM global_chat ORDER BY id DESC LIMIT 20''')
        found = self.cursor.fetchall()
        if found == None:
            raise Exception("Error fetching global chat history from database")
        return found
    def addActiveGame(self, game:OnlineGame):
        logger.info(f"Adding active game")
        query = f"INSERT INTO {self.table_active_games} (gameId,challenger,challenged,challengerColor,challengedColor,playerTurn,capturedWhitePieces,capturedBlackPieces,boardStr) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        values = game.getSqlValue()
        logger.info(f"{query}")
        logger.info(f"{values}")
        self.cursor.execute(query, values)
    def updateActiveGame(self, gameId: str, playerTurn: str, boardStr: str):
        query = f"UPDATE {self.table_active_games} SET playerTurn=%s, boardStr=%s WHERE gameId=%s"
        values = (playerTurn, boardStr, gameId)
        self.cursor.execute(query, values)
    def getAllActiveGames(self) -> dict[int, OnlineGame]:
        self.cursor.execute(f"SELECT * FROM {self.table_active_games}")
        games = self.cursor.fetchall()
        parsed_games = {}
        for game in games:
            logger.info(f"GAME: {game}")
            onlineGame = OnlineGame()
            onlineGame.parseGame(game)
            parsed_games[onlineGame.gameId] = onlineGame
        return parsed_games
    def storeGameResult(self, gameId, winner, loser):
        query = f"update users set total_wins=total_wins+1 where username=%s" 
        values = (winner, )
        self.cursor.execute(query, values)
        query = f"update users set total_loss=total_loss+1 where username=%s" 
        values = (loser, )
        self.cursor.execute(query, values)
    def removeActiveGame(self, gameId):
        query = f"DELETE FROM active_games WHERE gameId=%s"
        values = (gameId, )
        self.cursor.execute(query, values)
