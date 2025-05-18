import logging
from email.mime.text import MIMEText
import random
import smtplib

class EmailManager():
    def __init__(self) -> None:
        self.senderEmail = ""
        self.appPassword = ""
        self.fetchSenderCredentials()

    def fetchSenderCredentials(self):
        with open(".env", "r") as file:
            lines = file.readlines()
            for line in lines:
                split_line = line.split("=")
                if split_line[0] == "SENDER_EMAIL":
                    self.senderEmail = split_line[1].strip()
                if split_line[0] == "APP_PASSWORD":
                    self.appPassword = split_line[1].strip()

    def sendVerificationEmail(self, username, clientEmail) -> int:
        code = random.randint(23645, 89789)
        subject = "WebChess email confirmation"
        body = f"Hello {username},\n\n"
        body += f"Please enter the following code to confirm your email: {code}\n\n"
        body += "Best Regards,"
        mimeText = MIMEText(body)
        mimeText['Subject'] = subject
        mimeText["From"] = self.senderEmail
        mimeText["To"] = clientEmail

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(self.senderEmail, self.appPassword)
        server.sendmail(self.senderEmail, clientEmail, mimeText.as_string())
        return code

if __name__ == "__main__":
    obj = EmailManager()
    obj.sendVerificationEmail("bob", obj.senderEmail)
