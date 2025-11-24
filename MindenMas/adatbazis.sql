CREATE DATABASE Pohárnyi
DEFAULT CHARACTER SET  utf8
COLLATE utf8_hungarian_ci;

CREATE TABLE Felhasználó(
	FelhID INT AUTO_INCREMENT PRIMARY KEY,
	Felhasználónév VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Jelszó VARCHAR(50) NOT NULL
	--Profilkép: TODO: Megkérdezni egy tanárt hogy hogy lenne ezt érdemes
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
	OsszetevoNev VARCHAR(50) PRIMARY KEY NOT NULL,
	Kiszereles VARCHAR(50)PRIMARY KEY NOT NULL,
	Ar INT NOT NULL
);

CREATE TABLE KoktelokOsszetevoi(
	KoktélID INT,
	Osszetevő VARCHAR(50),
	Mennyiség DOUBLE,
    FOREIGN KEY(KoktélID) REFERENCES Koktél(KoktélID),
    FOREIGN KEY(Osszetevő) REFERENCES Osszetevok(OsszetevoNev)
);

--TEST ADATOK:
INSERT INTO Felhasználó(Felhasználónév,Email,Jelszó)
VALUES
("Benczik Marcell","eztutiegyvalodiemail@janem.hu","SzeretemAMacskákat2"),
("Erm Actually","ezisegyvalodiemail@janem.hu","NemSzeretemAMacskákat");

INSERT INTO Koktél(Keszito,KoktelCim,Recept,Alkoholos,Alap,Közösségi)
VALUES(1,"A Bánat Eloszlatója","Tötsünk egy 0.5L-es poharat a tetejéig Jack Danielsel",true,"Jack Daniels",false);

INSERT INTO Komment(Keszito,HovaIrták,Tartalom)
VALUES(2,1,"Ez Nem is egy Koktél");

INSERT INTO Ertekeles(Keszito,HovaIrták,Ertekeles)
VALUES(2,1,1.0);

INSERT INTO Osszetevok(OsszetevoNev,Kiszereles,Ar)
VALUES("Jack Daniels",0.75.7500);

INSERT INTO KoktelokOsszetevoi(KoktélID,Osszetevő,Mennyiség)
VALUES(1,"Jack Daniels",0.5);

--Lekérések
SELECT Felhasználónév,KoktelCim,Recept,KoktélID,Ertekeles,Tartalom
FROM Koktél
INNER JOIN(Felhasználó) ON Koktél.Keszito=Felhasználó.FelhID
INNER JOIN(Ertekeles) ON Koktél.Keszito=Ertekeles.HovaIrták
INNER JOIN(Komment) ON Koktél.Keszito=Komment.HovaIrták
GROUP BY KoktélID;
--Experimental
CREATE TABLE Webshop();
CREATE TABLE Jelentesek();