
--TEST ADATOK:
--SZOCIÁLIS ADATOK

INSERT INTO Felhasználó(Felhasználónév,Email,Jelszó)
VALUES
("Benczik Marcell","benczik.marci@gmail.com","SzeretemAMacskákat"),
("Legnagyobb Mudfield Fan","davidhoki@gmail.com","Frad1Sz1v!"),
("RenoHUN","kornelbettes@gmail.com","FrappansJelszo2"),
("A Magyar Daredevil","katai-nemeth-vilmos@tisza.hu","FrappansJelszo3")
;

INSERT INTO Koktél(Keszito,KoktelCim,Recept,Alkoholos,Alap,Közösségi)
VALUES
(1,"Citrom Húzó","Egy felespohárt töltsünk félig Ouzo-val, majd facsarjunk bele egy kis citromot",true,"Ouzou",false),
(2,"Martini","nem fogom leírni kézzel a receptet",true,"Gin",false),
(2,"A Bánat Eloszlatója","Tötsünk egy 0.5L-es poharat a tetejéig Jack Danielsel",true,"Jack Daniels",false),
(3,"Sommersby Light","Almalevet keverjunk ossze ketszer annyi szodavizzel",true,"Almalé",false),
(1,"Diétás Drakula","Tötsünk egy 0.5L-es pohárba tetszőleges mennyiségű szörpot, majd facsarjunk bele egy kis grapefruitot. Tálaljuk egy meggyel a tetején",true,"Meggyszörp",false);

INSERT INTO Komment(Keszito,HovaIrták,Tartalom)
VALUES
(3,3,"Ez Nem is egy Koktél"),
(1,3,"Köszi, Finom lett!"),
(3,2,"Vodkára is ki lehet cserélni az alapot?"),
(2,1,"Nem is tudtam hogy vagy ilyen alkohol"),
(1,5,"Jó mocktail lett!");

INSERT INTO Ertekeles(Keszito,HovaIrták,Ertekeles)
VALUES
(3,2,1.0),
(2,1,3.5),
(2,2,1.0),
(1,2,5.0);

INSERT INTO Kedvencek(KikedvelteID,MitkedveltID)
VALUES
(1,2),
(1,3),
(2,3),
(2,1),
(4,4);

--TERMÉK ADATOK
INSERT INTO Osszetevok(OsszetevoNev)
VALUES
("Jack Daniels"),
("Martini"),
("Ouzou"),
("Almalé"),
("Meggyszörp"),
("Szodaviz"),
("Citromlé"),
("Vermouth"),
("Grapefruitlé"),
("Meggy");

INSERT INTO KoktelokOsszetevoi(KoktélID,Osszetevő,Mennyiség)
VALUES
(1,"Ouzou",0.05),
(1,"Citromlé",0.05),
(2,"Martini",0.25),
(2,"Vermouth",0.25),
(3,"Jack Daniels",0.5),
(4,"Almalé",1),
(4,"Szodaviz",2),
(5,"Meggyszörp",0.2),
(5,"Grapefruitlé",0.05),
(5,"Meggy",1)
;
INSERT INTO WebshopTermek(TermekCim,TermekLeiras,TermekKiszereles,Ar)
VALUES
("Pohárnyi Mintájú Felespohár","Szeretnéd közvetlen támogatni a csapatunkat? Akarsz is cserébe érte valamit? Vásárold meg ezt!",4,8000),
("Jack Daniels","Amerikai Import Whiskey",0.75,7650),
("Ouzou","Görög alkohol, mentolos ízzel",0.5,9500),
("Soju Eper","Koreai desztillált alkohol, eper ízben",0.35,2500);

INSERT INTO Kosár(UserID)
VALUES
(1),
(2),
(3);

INSERT INTO KosárTermék(KosarID,TermekID,Darabszam,Egysegar)
VALUES
(1,3,1,9500),
(1,2,2,7650),
(3,1,1,8000);

--Jelentésnél
-- 0: Feljegyezve
-- 1: Vizsgálat alatt
-- 2: Elfogadva
-- 3: Elutasítva

--A JelentettTartalomID az a JelentesTipusa alapján fogja megérteni hogy mire jó
INSERT INTO Jelentesek(JelentoID,JelentettID,JelentettTartalomID,JelentesTipusa)
VALUES
(4,2,2,"Koktél"),
(3,2,2,"Koktél"),
(2,4,4,"Felhasználó");