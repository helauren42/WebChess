from datetime import datetime
import logging
import mysql
import mysql.connector
from mysql.connector.abstracts import MySQLCursorAbstract
import sys
import subprocess
from typing import Optional
import os
from schemas import LoginRequest, SignupRequest

CWD = os.getcwd()
ENV_PATH = os.path.join(CWD, ".env")
DB_DIR =  os.path.join(os.path.dirname(CWD), "database/")

print(ENV_PATH)
print(DB_DIR)

class AbstractDb():
    def __init__(self):
        self.host:str = ""
        self.user:str = ""
        self.password:str = ""
        self.name:str = ""
        self.table_users:str = ""
        self.fetchCredentials()
        self.createDb()
        self.setupCursor()
    def setupCursor(self):
        self.cnx = mysql.connector.connect(host=self.host, port=3306, user=self.user, password=self.password, database=self.name, auth_plugin='mysql_native_password', autocommit=True)
        self.cursor = self.cnx.cursor()
        self.cursor.execute(f"USE {self.name}")
    def createBuildFile(self):
        print(DB_DIR)
        subprocess.run(["touch build.sql"], shell=True, cwd=DB_DIR)
        lines = []
        with open(f"{DB_DIR}create.sql", "r") as readfile:
            lines = readfile.readlines()
            for i in range(len(lines)):
                lines[i] = lines[i].replace("DB_HOST", self.host)
                lines[i] = lines[i].replace("DB_USER", self.user)
                lines[i] = lines[i].replace("DB_PASSWORD", self.password)
                lines[i] = lines[i].replace("DB_NAME", self.name)
                lines[i] = lines[i].replace("DB_TABLE_USERS", self.table_users)
        with open(f"{DB_DIR}build.sql", "w") as writeFile:
            for line in lines:
                writeFile.write(line)
        print(lines)
    def createDb(self):
        print("creating database")
        self.createBuildFile()
        print("running subprocess excecuting mysql build")
        subprocess.run(f"sudo mysql < {DB_DIR}build.sql", shell=True)
        subprocess.run(["rm build.sql"], shell=True, cwd=DB_DIR)
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
    def validLoginUsername(self, user):
        print("checking valid login username: ", user)
        self.cursor.execute(f"SELECT username FROM users WHERE username=%s", (user,))
        fetched = self.cursor.fetchone()
        print("valid username fetched: ", fetched)
        if fetched != None:
            return True
        return False
    def validLoginPassword(self, user, password):
        self.cursor.execute(f"SELECT password FROM users WHERE username=%s", (user,))
        fetched = self.cursor.fetchone()
        found = fetched[0]
        if found == password:
            return True
        return False
    def userExists(self, username):
        print("username: ", username)
        self.cursor.execute("SELECT username FROM users WHERE username=%s", (username,))
        fetched = self.cursor.fetchone()
        print("fetched: ", fetched)
        if fetched == None:
            return False
        return True
    def fetchUserData(self, username):
        self.cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        columns = self.cursor.fetchone()
        # userData = UserData(username, columns[4], columns[5], columns[6], columns[1])
        # return userData
    def fetchUserFromToken(self, token:str):
        print("searching for token: ", token)
        self.cursor.execute("SELECT * FROM users WHERE sessionToken=%s", (token,))
        columns = self.cursor.fetchone()
        print("columns: ", columns)
        if columns == None:
           return None
    def insertNewUser(self, req: SignupRequest):
        query = "INSERT INTO users (username, password, email) VALUES(%s, %s, %s)"
        values = (req.username, req.password, req.email)
        self.cursor.execute(query, values)

class Database(AbstractDb):
    def __init__(self):
        super().__init__()
    def signupUser(self, req: SignupRequest) -> bool:
        print("adding user to db: ", req.username)
        usernameAlreadyTaken = self.userExists(req.username)
        print(usernameAlreadyTaken)
        if usernameAlreadyTaken:
            raise Exception(409, "Username already taken")
        try:
            self.insertNewUser(req=req)
        except Exception as e:
            logging.critical(f"Could not write to db: e.__str__()")
            raise Exception(500, "Server failed to create user")
        return True
    def loginUser(self, req: LoginRequest) -> bool:
        if not self.userExists(req):
            raise Exception()
        return True

