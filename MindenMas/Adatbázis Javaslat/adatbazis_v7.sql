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
	Keszito INT  NOT NULL,
	KeszitesDatuma DATE DEFAULT NOW(),
	Alkoholos BOOLEAN,
	Közösségi BOOLEAN,
	KoktelCim TEXT NOT NULL,
	KoktelNepszeruseg INT DEFAULT 0,
	BoritoKepUtvonal TEXT,
	Alap TEXT,
	Recept TEXT NOT NULL,
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
	FOREIGN KEY(JelvényID) REFERENCES Jelvények(JelvényID)
);

CREATE TABLE Komment(
	KommentID INT AUTO_INCREMENT PRIMARY KEY,
	Keszito INT NOT NULL,
	HovaIrták INT NOT NULL,
	MilyenDologhoz TEXT NOT NULL,
	Tartalom TEXT NOT NULL,
    FOREIGN KEY(Keszito) REFERENCES Felhasználó(FelhID)
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
	FOREIGN KEY(MitkedveltID) REFERENCES Koktél(KoktélID)
);

CREATE TABLE WebshopTermek (
	TermekID INT AUTO_INCREMENT,
	TermekCim VARCHAR(255)  NOT NULL,
	TermekLeiras TEXT  NOT NULL,
	TermekKiszereles DOUBLE NOT NULL,
	TermekKeszlet INT NOT NULL,
	TermekKepUtvonal TEXT,
	TermekKategoria TEXT NOT NULL,
	TermekMarka TEXT NOT NULL,
	TermekHanyanVettekMeg INT DEFAULT 0,
	TermekSzarmazas TEXT NOT NULL,
	TermekAlkoholSzazalek DOUBLE NOT NULL,
	TermekKora INT NOT NULL,
	TermekDiscount DOUBLE,
	Ar INT  NOT NULL,
	PRIMARY KEY Termek (TermekID,Ar)
);

CREATE TABLE KoktelokOsszetevoi(
	KoktélID INT,
	Osszetevő VARCHAR(255),
	Mennyiség DOUBLE,
    FOREIGN KEY(KoktélID) REFERENCES Koktél(KoktélID)
);

CREATE TABLE Kosár(
	SessionID INT AUTO_INCREMENT PRIMARY KEY,
	UserID INT NOT NULL,
	FOREIGN KEY(UserID) REFERENCES Felhasználó(FelhID)
);

CREATE TABLE KosárTermék(
	KosarID INT NOT NULL,
	TermekID INT NOT NULL,
	Darabszam INT DEFAULT 1,
	EgysegAr INT NOT NULL,
	FOREIGN KEY(KosarID) REFERENCES Kosár(SessionID),
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
	JelentesTipusa TEXT,
	JelentesIndoka TEXT,
	FOREIGN KEY(JelentőID) REFERENCES Felhasználó(FelhID),
	FOREIGN KEY(JelentésID) REFERENCES Jelentesek(JelentesID)
);