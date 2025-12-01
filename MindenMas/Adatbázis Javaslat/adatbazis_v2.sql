CREATE DATABASE Pohárnyi
DEFAULT CHARACTER SET  utf8
COLLATE utf8_hungarian_ci;

CREATE TABLE Felhasználó(
	FelhID INT AUTO_INCREMENT PRIMARY KEY,
	Felhasználónév VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Jelszó VARCHAR(50) NOT NULL,
	Admin BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE Koktél(
	KoktélID INT AUTO_INCREMENT PRIMARY KEY,
	Keszito INT  NOT NULL,
	KeszitesDatuma DATE DEFAULT NOW(),
	Alkoholos BOOLEAN,
	Alap VARCHAR(50),
	Közösségi BOOLEAN,
	KoktelCim VARCHAR(50) NOT NULL,
	Recept VARCHAR(200) NOT NULL,
    FOREIGN KEY(Keszito) REFERENCES Felhasználó(FelhID)
);
CREATE TABLE Komment(
	KommentID INT AUTO_INCREMENT PRIMARY KEY,
	Keszito INT NOT NULL,
	HovaIrták INT NOT NULL,
	Tartalom VARCHAR(50) NOT NULL,
    FOREIGN KEY(Keszito) REFERENCES Felhasználó(FelhID),
    FOREIGN KEY(HovaIrták) REFERENCES Koktél(KoktélID)
);

CREATE TABLE Ertekeles(
	ErtekelesID INT AUTO_INCREMENT PRIMARY KEY,
	Keszito INT NOT NULL,
	HovaIrták INT  NOT NULL,
	Ertekeles DOUBLE NOT NULL,
    FOREIGN KEY(Keszito) REFERENCES Felhasználó(FelhID),
    FOREIGN KEY(HovaIrták) REFERENCES Koktél(KoktélID)
);

CREATE TABLE Osszetevok(
	OsszetevoNev VARCHAR(50) NOT NULL,
	Kiszereles DOUBLE NOT NULL,
    PRIMARY KEY Osszetevo(OsszetevoNev,Kiszereles)
);



CREATE TABLE WebshopTermek (
	TermekID INT AUTO_INCREMENT,
	Ar INT  NOT NULL,
	TermekCim VARCHAR(50)  NOT NULL,
	TermekLeiras TEXT  NOT NULL,
	TermekKiszereles DOUBLE,
	PRIMARY KEY Termek (TermekID,Ar),
	FOREIGN KEY(TermekCim,TermekKiszereles) REFERENCES Osszetevok(OsszetevoNev,Kiszereles)
);

CREATE TABLE KoktelokOsszetevoi(
	KoktélID INT,
	Osszetevő VARCHAR(50),
	Mennyiség DOUBLE,
    FOREIGN KEY(KoktélID) REFERENCES Koktél(KoktélID),
    FOREIGN KEY(Osszetevő) REFERENCES Osszetevok(OsszetevoNev)
);

CREATE TABLE Kosár(
	SessionID INT AUTO_INCREMENT PRIMARY KEY,
	UserID INT NOT NULL,
	FOREIGN KEY(UserID) REFERENCES Felhasználó(FelhID)
);

CREATE TABLE KosárTermék(
	KosarID INT,
	TermekID INT,
	Darabszam INT,
	EgysegAr INT,
	FOREIGN KEY(KosarID) REFERENCES Kosár(SessionID),
	FOREIGN KEY(TermekID,EgysegAr) REFERENCES WebshopTermek(TermekID,Ar)
);

CREATE TABLE Jelentesek(
	JelentesID INT PRIMARY KEY AUTO_INCREMENT,
	JelentoID INT,
	JelentettID INT,
	JelentettTartalomID INT,
	JelentesTipusa TEXT,
	JelentettTartalom TEXT,
	FOREIGN KEY(JelentoID) REFERENCES Felhasználó(FelhID),
    FOREIGN KEY(JelentettID) REFERENCES Felhasználó(FelhID)
);