
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

INSERT INTO Koktél(Keszito,KoktelCim,Recept,Alkoholos,Alap,Közösségi)
VALUES
(1,"Citrom Húzó","Egy felespohárt töltsünk félig Ouzo-val, majd facsarjunk bele egy kis citromot",true,"Ouzou",false),
(2,"Martini","nem fogom leírni kézzel a receptet",true,"Gin",false),
(2,"A Bánat Eloszlatója","Tötsünk egy 0.5L-es poharat a tetejéig Jack Danielsel",true,"Jack Daniels",false),
(3,"Sommersby Light","Almalevet keverjunk ossze ketszer annyi szodavizzel",true,"Almalé",false),
(1,"Diétás Drakula","Tötsünk egy 0.5L-es pohárba tetszőleges mennyiségű szörpot, majd facsarjunk bele egy kis grapefruitot. Tálaljuk egy meggyel a tetején.",true,"Meggyszörp",false),
(6,"Mennyei Elixir","200ml Szentelt vízhez adjunk hozzá 80mlnyi almalevet a jó és a rossz tudás fájáról és 100mlnyi Isten Vére bort és tálaljuk 3 kocka jéggel. Kivállóan illik egy szelet kovásztalan kenyérhez és szárított halhoz.",false,"Szentelt Víz",true),
(4,"Daredevil","30ml rumot töltsünk egy pohárba amiben jég van, majd töltsünk rá 150ml narancslevet,75ml ananász és vörösáfonya lét, majd keverjük el és tálaljuk mentalevéllel.",true,"Rum",true),
(10,"Hideg Fúzió","15ml everclearhez adjunk hozzá 10ml kék curacao-t és 5ml Ouzout.",true,"Everclear",true),
(8,"Halászlé","20ml Sakehoz adjunk hozzá 40ml Gint és 1ml halsűrítményt",true,"Sake",true),
(10,"Anti-Feral Serum","20ml Uborkaléhez adjunk 80ml sima Monstert",false,"Uborkalé",true),
(9,"Folyékony Kokain","Everclearhez adjunk egy kis speedet",true,"Everclear",true),
(1,"Silverhand","20ml Tequillahoz adjunk hozzá egy kiskanálnyi sört, és egy félkanálnyi csípőst.",true,"Tequilla",false),
(5,"Sárrét","15ml Csokilikőrhöz adjunk hozzá 15ml Fahéjjas Jack Danielst és öntsük fel Fehér Monsterrel",true,"Csokilikőr",false)
;

INSERT INTO Komment(Keszito,HovaIrták,Tartalom)
VALUES
(3,3,"Ez Nem is egy Koktél"),
(1,3,"Köszi, Finom lett!"),
(3,2,"Vodkára is ki lehet cserélni az alapot?"),
(2,1,"Nem is tudtam hogy vagy ilyen alkohol"),
(1,5,"Jó mocktail lett!"),
(2,13,"Ti vagytok a kedvenc bandám!"),
(8,2,"Nem elég halas")
;

INSERT INTO Ertekeles(Keszito,HovaIrták,Ertekeles)
VALUES
(3,2,1.0),
(2,1,3.5),
(2,2,1.0),
(1,2,4.0),
(6,12,1.0),
(9,4,3.5),
(10,5,2.5),
(1,7,5.0),
(7,6,3.0),
(7,1,3.5),
(7,8,1.0),
(6,10,4.5);

INSERT INTO Kedvencek(KikedvelteID,MitkedveltID)
VALUES
(1,2),
(1,3),
(2,3),
(2,1),
(4,4),
(1,10),
(1,11);



INSERT INTO KoktelokOsszetevoi(KoktélID,Osszetevő,Mennyiség)
VALUES
(1,"Ouzou",0.05),
(1,"Citromlé",0.05),
(2,"Martini",0.25),
(2,"Vermouth",0.25),
(3,"Jack Daniels",0.5),
(4,"Almalé",1),
(4,"Szodaviz",2),
(5,"Meggyszörp",20),
(5,"Grapefruitlé",15),
(5,"Meggy",1),
(6,"Szentelt Víz",200),
(6,"Isten Vére bor",50),
(6,"Almalé",80),
(7,"Rum",30),
(7,"Narancslé",150),
(7,"Ananászlé",75),
(7,"Vörösáfonya szirup",75),
(11,"Everclear",20),
(11,"Speed",20),
(12,"Tequilla",20),
(12,"Sör",5),
(12,"Csípős",2.5)
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

INSERT INTO Jelvények(JelvényNeve)
VALUES
("Savanyú"),
("Csípős"),
("Keserű"),
("Glutén"),
("Erős"),
("Gyenge");

INSERT INTO KoktélokJelvényei(KoktélID,JelvényID)
VALUES
(11,3),
(12,2),
(11,5),
(10,1);