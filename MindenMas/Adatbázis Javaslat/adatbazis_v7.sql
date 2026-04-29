CREATE TABLE Felhasználó(
	FelhID INT AUTO_INCREMENT PRIMARY KEY,
	Felhasználónév TEXT NOT NULL,
	Email TEXT NOT NULL,
	Jelszó TEXT NOT NULL,
	JelszóHossza INT NOT NULL,
	ProfilkepUtvonal TEXT DEFAULT("whatever.png"),
	RegisztracioDatuma DATETIME DEFAULT NOW(),
	Admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Koktél(
	KoktélID INT AUTO_INCREMENT PRIMARY KEY,
	Keszito INT NOT NULL,
	KeszitesDatuma DATE DEFAULT NOW(),
	Alkoholos BOOLEAN,
	KoktelCim TEXT NOT NULL,
	KoktelNepszeruseg INT DEFAULT 0,
	BoritoKepUtvonal TEXT DEFAULT ("cup.webp"),
	Alap TEXT,
	Recept TEXT NOT NULL,
	AlapMennyiseg INT NOT NULL,
    FOREIGN KEY(Keszito) REFERENCES Felhasználó(FelhID)
);

CREATE TABLE Jelvények(
	JelvényID INT AUTO_INCREMENT PRIMARY KEY,
	JelvényNeve TEXT,
	JelvenyKategoria TEXT
);
CREATE TABLE KoktélokJelvényei(
	KoktélID INT,
	JelvényID INT,
	FOREIGN KEY(KoktélID) REFERENCES Koktél(KoktélID),
	FOREIGN KEY(JelvényID) REFERENCES Jelvények(JelvényID),
	PRIMARY KEY Jelvény(KoktélID,JelvényID)
);

CREATE TABLE Komment(
	KommentID INT AUTO_INCREMENT PRIMARY KEY,
	Keszito INT NOT NULL,
	HovaIrták INT NOT NULL,
	Tartalom TEXT NOT NULL,
	Pozitiv INT DEFAULT 0,
	Negativ INT DEFAULT 0,
    FOREIGN KEY(Keszito) REFERENCES Felhasználó(FelhID)
);

CREATE TABLE kommentErtekeles(
	FelhID INT,
	KommentID INT,
	Pozitiv INT,
	Negativ INT,
    FOREIGN KEY(FelhID) REFERENCES Felhasználó(FelhID),
    FOREIGN KEY(KommentID) REFERENCES Komment(KommentID),
	PRIMARY KEY komment(FelhID,KommentID)
);

CREATE TABLE Ertekeles(
	ErtekelesID INT AUTO_INCREMENT PRIMARY KEY,
	Keszito INT NOT NULL,
	HovaIrták INT  NOT NULL,
	MilyenDologhoz TEXT NOT NULL,
	Ertekeles DOUBLE NOT NULL,
    FOREIGN KEY(Keszito) REFERENCES Felhasználó(FelhID)
);

CREATE TABLE Kedvencek(
	KikedvelteID INT,
	MitkedveltID INT,
	FOREIGN KEY(KikedvelteID) REFERENCES Felhasználó(FelhID),
	FOREIGN KEY(MitkedveltID) REFERENCES Koktél(KoktélID),
	PRIMARY KEY Kedvenc(KikedvelteID,MitkedveltID)
);

CREATE TABLE WebshopOrszag(
	OrszagID INT AUTO_INCREMENT PRIMARY KEY,
	OrszagNev TEXT
);

CREATE TABLE WebshopTermek (
	TermekID INT AUTO_INCREMENT,
	TermekCim VARCHAR(255)  NOT NULL,
	TermekLeiras TEXT  NOT NULL,
	TermekKiszereles INT NOT NULL,
	TermekUrtartalom DOUBLE DEFAULT NULL,
	TermekKeszlet INT NOT NULL,
	TermekKepUtvonal TEXT DEFAULT("what.webp"),
	TermekKategoria TEXT NOT NULL,
	TermekMarka TEXT NOT NULL,
	TermekHanyanVettekMeg INT DEFAULT 0,
	TermekSzarmazas INT NOT NULL,
	TermekAlkoholSzazalek DOUBLE NOT NULL,
	TermekKora INT NOT NULL,
	TermekDiscount DOUBLE,
	Ar INT  NOT NULL,
	PRIMARY KEY Termek (TermekID,Ar),
	FOREIGN KEY (TermekSzarmazas) REFERENCES WebshopOrszag(OrszagID)
);




CREATE TABLE KoktelokOsszetevoi(
	KoktélID INT,
	Osszetevő VARCHAR(255),
	Mennyiség DOUBLE,
	Mertekegyseg TEXT,
    FOREIGN KEY(KoktélID) REFERENCES Koktél(KoktélID),
	PRIMARY KEY KoktélÖsszetevő(KoktélID,Osszetevő)
);


CREATE TABLE KosárTermék(
	KosarID INT NOT NULL PRIMARY KEY,
	TermekID INT NOT NULL,
	Darabszam INT DEFAULT 1,
	EgysegAr INT NOT NULL,
	FOREIGN KEY(KosarID) REFERENCES Felhasználó(FelhID),
	FOREIGN KEY(TermekID,EgysegAr) REFERENCES WebshopTermek(TermekID,Ar)
);

CREATE TABLE Jelentesek(
	JelentesID INT PRIMARY KEY AUTO_INCREMENT,
	JelentettID INT,
	JelentettTartalomID INT,
	JelentesTipusa TEXT,
	JelentesIdopontja DATE DEFAULT NOW(),
	JelentesAllapota INT DEFAULT 0,
	JelentesMennyisege INT DEFAULT 1,
    FOREIGN KEY(JelentettID) REFERENCES Felhasználó(FelhID)
);

CREATE TABLE Jelentők(
	JelentőID INT,
	JelentésID INT,
	JelentesIndoka TEXT,
	FOREIGN KEY(JelentőID) REFERENCES Felhasználó(FelhID),
	FOREIGN KEY(JelentésID) REFERENCES Jelentesek(JelentesID),
	PRIMARY KEY Jelentés(JelentőID,JelentésID)
);