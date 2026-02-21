
INSERT INTO Felhasználó(Felhasználónév,Email,Jelszó)
VALUES
("Benczik Marcell","benczik.marci@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("Legnagyobb Mudfield Fan","davidhoki@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("RenoHUN","kornelbettes@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("A Magyar Daredevil","katai-nemeth-vilmos@tisza.hu","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("Kovácsovics Máté","matekovacsovics_mudfield@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("sebi2ga121","sebi2ga121@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("Spence Buder","bestbud@spencer.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("fishfishfishfish","ilovefish@fish.fish","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("Deutch Tamás","deutchtamas@kormany.hu","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("Walton Goggins","waltongoggingshollywood@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o")
;
UPDATE `felhasználó` SET `Admin` = '1' WHERE `felhasználó`.`FelhID` = 1;

INSERT INTO Felhasználó(Felhasználónév,Email,Jelszó,ProfilKepUtvonal)
VALUES
("Balu a Fotomaniakus","imadomafurryket@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o","dog.png");
INSERT INTO Koktél(Keszito,KoktelCim,Recept,Alkoholos,Alap,Közösségi,AlapMennyiseg)
VALUES
(1,"Citrom Húzó","Egy felespohárt töltsünk félig Ouzo-val, majd facsarjunk bele egy kis citromot",true,"Ouzou",false,50),
(2,"Martini","nem fogom leírni kézzel a receptet",true,"Gin",false,50),
(2,"A Bánat Eloszlatója","Tötsünk egy 0.5L-es poharat a tetejéig Jack Danielsel",true,"Jack Daniels",false,50),
(3,"Sommersby Light","Almalevet keverjunk ossze ketszer annyi szodavizzel",true,"Almalé",false,45),
(1,"Diétás Drakula","Tötsünk egy 0.5L-es pohárba tetszőleges mennyiségű szörpot, majd facsarjunk bele egy kis grapefruitot. Tálaljuk egy meggyel a tetején.",true,"Meggyszörp",false,50),
(6,"Mennyei Elixir","200ml Szentelt vízhez adjunk hozzá 80mlnyi almalevet a jó és a rossz tudás fájáról és 100mlnyi Isten Vére bort és tálaljuk 3 kocka jéggel. Kivállóan illik egy szelet kovásztalan kenyérhez és szárított halhoz.",false,"Szentelt Víz",true,50),
(4,"Daredevil","30ml rumot töltsünk egy pohárba amiben jég van, majd töltsünk rá 150ml narancslevet,75ml ananász és vörösáfonya lét, majd keverjük el és tálaljuk mentalevéllel.",true,"Rum",true,50),
(10,"Hideg Fúzió","15ml everclearhez adjunk hozzá 10ml kék curacao-t és 5ml Ouzout.",true,"Everclear",true,50),
(8,"Halászlé","20ml Sakehoz adjunk hozzá 40ml Gint és 1ml halsűrítményt",true,"Sake",true,50),
(10,"Anti-Feral Serum","20ml Uborkaléhez adjunk 80ml sima Monstert",false,"Uborkalé",true,50),
(9,"Folyékony Kokain","Everclearhez adjunk egy kis speedet",true,"Everclear",true,50),
(1,"Silverhand","20ml Tequillahoz adjunk hozzá egy kiskanálnyi sört, és egy félkanálnyi csípőst.",true,"Tequilla",false,50),
(5,"Sárrét","15ml Csokilikőrhöz adjunk hozzá 15ml Fahéjjas Jack Danielst és öntsük fel Fehér Monsterrel",true,"Csokilikőr",false,50)
;

INSERT INTO Komment(Keszito,HovaIrták,Tartalom,MilyenDologhoz)
VALUES
(3,3,"Ez Nem is egy Koktél","Koktél"),
(1,3,"Köszi, Finom lett!","Koktél"),
(3,2,"Vodkára is ki lehet cserélni az alapot?","Koktél"),
(2,1,"Nem is tudtam hogy vagy ilyen alkohol","Koktél"),
(1,5,"Jó mocktail lett!","Koktél"),
(2,13,"Ti vagytok a kedvenc bandám!","Koktél"),
(8,2,"Nem elég halas","Koktél")
;

INSERT INTO Ertekeles(Keszito,HovaIrták,Ertekeles,MilyenDologhoz)
VALUES
(3,2,1.0,"Koktél"),
(2,1,3.5,"Koktél"),
(2,2,1.0,"Koktél"),
(1,2,4.0,"Koktél"),
(6,12,1.0,"Koktél"),
(9,4,3.5,"Koktél"),
(10,5,2.5,"Koktél"),
(1,7,5.0,"Koktél"),
(7,6,3.0,"Koktél"),
(7,1,3.5,"Koktél"),
(7,8,1.0,"Koktél"),
(6,10,4.5,"Koktél");

INSERT INTO Kedvencek(KikedvelteID,MitkedveltID)
VALUES
(1,2),
(1,3),
(2,3),
(2,1),
(4,4),
(1,10),
(1,11);

INSERT INTO KoktelokOsszetevoi(KoktélID,Osszetevő,Mennyiség,Mertekegyseg)
VALUES
(1,"Ouzou",5,"Ml"),
(1,"Citromlé",5,"Ml"),
(2,"Martini",25,"Ml"),
(2,"Vermouth",25,"Ml"),
(3,"Jack Daniels",500,"Ml"),
(4,"Almalé",15, "Ml"),
(4,"Szodaviz",30, "Ml"),
(5,"Meggyszörp",20,"Ml"),
(5,"Grapefruitlé",15,"Ml"),
(5,"Meggy",1,"Darab"),
(6,"Szentelt Víz",200,"Ml"),
(6,"Isten Vére bor",50,"Ml"),
(6,"Almalé",80,"Ml"),
(7,"Rum",30,"Ml"),
(7,"Narancslé",150,"Ml"),
(7,"Ananászlé",75,"Ml"),
(7,"Vörösáfonya szirup",75,"Ml"),
(8,"Everclear",15,"Ml"),
(8,"Kék Curacao",15,"Ml"),
(8,"Ouzou",5,"Ml"),
(9,"Sake",20,"Ml"),
(9,"Gin",40,"Ml"),
(9,"Halsűrítmény",1,"Ml"),
(10,"Uborkalé",20,"Ml"),
(10,"Monster",80,"Ml"),
(11,"Everclear",20,"Ml"),
(11,"Speed",20,"Ml"),
(12,"Tequilla",20,"Ml"),
(12,"Sör",5,"Ml"),
(12,"Csípős",2.5,"Ml"),
(13,"Csokilikőr",15,"Ml"),
(13,"Fahéjas Jack Daniels",15,"Ml"),
(13,"Fehér Monster",100,"Ml")
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

INSERT INTO Jelentesek(JelentettID,JelentettTartalomID,JelentesTipusa)
VALUES
(2,2,"Koktél"),
(10,11,"Koktél"),
(4,4,"Felhasználó"),
(8,8,"Felhasználó"),
(2,6,"Komment"),
(8,7,"Komment");

INSERT INTO Jelentők(JelentőID,JelentésID,JelentesIndoka)
VALUES
(3,1,"Nem is koktél"),
(4,1,"Bármennyire is tetszik, csak JD nem számít koktélnak"),
(4,2,"Ez nem egy kivitelezhető koktél"),
(6,3,"Vagy személyhamisítás történik vagy csoda mert az emberünk VAK"),
(7,4,"Elmebetegnek néz ki"),
(5,5,"Nem a koktélhoz kötődik"),
(1,6,"Mi az hogy nem elég halas?????????");

INSERT INTO Jelvények(JelvényNeve,JelvenyKategoria)
VALUES
("Savanyú","ízek"),
("Csípős","ízek"),
("Keserű","ízek"),
("Glutén","Allergének"),
("Erős","Erősség"),
("Gyenge","Erősség"),
("Mogyorók","Allergének"),
("Tojás","Allergének"),
("Tej","Allergének"),
("Édes","ízek");

INSERT INTO KoktélokJelvényei(KoktélID,JelvényID)
VALUES
(1,1),
(1,3),
(2,3),
(3,5),
(3,3),
(4,1),
(5,1),
(6,6),
(7,1),
(7,5),
(8,5),
(9,5),
(10,1),
(11,3),
(11,5),
(12,2),
(13,10);
