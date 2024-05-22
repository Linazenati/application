CREATE TABLE Users (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    accountState INT,
    isConnected BOOLEAN NOT NULL DEFAULT 0,
    isAdmin BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE Clients (
    clientID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    birthDate VARCHAR(255),
    city VARCHAR(255) ,
    description VARCHAR(255) ,
    picture VARCHAR(255) ,
    registrationStep INT NOT NULL,
    isRegistrationComplete BOOLEAN NOT NULL DEFAULT 0,
    newLetter BOOLEAN,
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE Admins (
    adminID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    isSuperAdmin BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE Interests (
    interestID INT PRIMARY KEY AUTO_INCREMENT,
    interestName VARCHAR(255) NOT NULL,
    id INT NOT NULL
);

CREATE TABLE Questions (
    questionID INT PRIMARY KEY AUTO_INCREMENT,
    questionText VARCHAR(255) NOT NULL,
    id INT NOT NULL
);

CREATE TABLE Recherches (
    rechercheID INT PRIMARY KEY AUTO_INCREMENT,
    rechercheName VARCHAR(255) NOT NULL,
    id INT NOT NULL
);

CREATE TABLE ClientInterests (
    clientInterestID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    interestName VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE ClientRecherches (
    clientRechercheID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    rechercheName VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE ClientQuestions (
    clientquestionID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    questionName VARCHAR(255),
    answer VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE ClientCompanies (
    companyID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    companyName VARCHAR(255),
    projectStatus VARCHAR(255),
    industrySectors VARCHAR(255),
    jobTitle VARCHAR(255),
    jobDescription TEXT,
    startDate DATE,
    picture VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE ClientContacts (
    contactID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    contactType VARCHAR(255),
    contactValue VARCHAR(255),
    revealAlways BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE ClientStatistics (
    clientqStatisticID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    views INT DEFAULT 0,
    averageWeeklyTimeSpent time DEFAULT 00:00:00,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    registrationDate DATE,
    FOREIGN KEY (userID) REFERENCES Users (userID)
);

CREATE TABLE ClientLogs (
  logID INT AUTO_INCREMENT PRIMARY KEY,
  userID INT NOT NULL,
  loginTime DATETIME,
  logoutTime DATETIME,
  FOREIGN KEY (userID) REFERENCES Users(userID)
);