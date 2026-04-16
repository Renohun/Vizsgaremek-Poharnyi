
INSERT INTO Felhasználó(Felhasználónév,Email,Jelszó)
VALUES
("BenczikMarcell","benczik.marci@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$aHw3kmpIBeoIUUgnd637sQ$KJ2Jdyx6oPAEYzMPNx/OfKIOdsRp88kPRuRMtqfzsWY"),
("LegnagyobbMudfieldFan","davidhoki@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("RenoHUN","kornelbettes@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("AMagyarDaredevil","katai-nemeth-vilmos@tisza.hu","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("KovácsovicsMáté","matekovacsovics_mudfield@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("sebi2ga121","sebi2ga121@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("SpenceBuder","bestbud@spencer.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("fishfishfishfish","ilovefish@fish.fish","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("DeutchTamás","deutchtamas@kormany.hu","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("WaltonGoggins","waltongoggingshollywood@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o"),
("poharnyiAdmin", "poharnyiAdmin@gmail.com", "$argon2id$v=19$m=65536,t=3,p=4$aHw3kmpIBeoIUUgnd637sQ$KJ2Jdyx6oPAEYzMPNx/OfKIOdsRp88kPRuRMtqfzsWY")
;
UPDATE `felhasználó` SET `Admin` = '1' WHERE `felhasználó`.`FelhID` = 1;
UPDATE `felhasználó` SET `Admin` = '1' WHERE `felhasználó`.`FelhID` = 11;

INSERT INTO Felhasználó(Felhasználónév,Email,Jelszó,ProfilKepUtvonal)
VALUES
("BaluaFotomaniakus","imadomafurryket@gmail.com","$argon2id$v=19$m=65536,t=3,p=4$3r89if+yH0olMXDb+dZmjg$uZilKmrFYLMGza3VTnbJ+4YPrwFtccU2hCDalpuLO7o","dog.png");
INSERT INTO Koktél(Keszito,KoktelCim,Recept,Alkoholos,Alap,Közösségi,AlapMennyiseg)
VALUES
(1,"Citrom Húzó","Egy felespohárt töltsünk félig Ouzo-val, majd facsarjunk bele egy kis citromot",true,"Ouzou",false,10),
(2,"Martini","nem fogom leírni kézzel a receptet",true,"Gin",false,50),
(2,"A Bánat Eloszlatója","Tötsünk egy 0.5L-es poharat a tetejéig Jack Danielsel",true,"Jack Daniels",false,500),
(3,"Sommersby Light","Almalevet keverjunk ossze ketszer annyi szodavizzel",true,"Almalé",false,45),
(1,"Diétás Drakula","Tötsünk egy 0.5L-es pohárba tetszőleges mennyiségű szörpot, majd facsarjunk bele egy kis grapefruitot. Tálaljuk egy meggyel a tetején.",true,"Meggyszörp",false,300),
(6,"Mennyei Elixir","200ml Szentelt vízhez adjunk hozzá 80mlnyi almalevet a jó és a rossz tudás fájáról és 100mlnyi Isten Vére bort és tálaljuk 3 kocka jéggel. Kivállóan illik egy szelet kovásztalan kenyérhez és szárított halhoz.",false,"Szentelt Víz",true,380),
(4,"Daredevil","30ml rumot töltsünk egy pohárba amiben jég van, majd töltsünk rá 150ml narancslevet,75ml ananász és vörösáfonya lét, majd keverjük el és tálaljuk mentalevéllel.",true,"Rum",true,255),
(10,"Hideg Fúzió","15ml everclearhez adjunk hozzá 10ml kék curacao-t és 5ml Ouzout.",true,"Everclear",true,30),
(8,"Halászlé","20ml Sakehoz adjunk hozzá 40ml Gint és 1ml halsűrítményt",true,"Sake",true,61),
(10,"Anti-Feral Serum","20ml Uborkaléhez adjunk 80ml sima Monstert",false,"Uborkalé",true,100),
(9,"Folyékony Kokain","Everclearhez adjunk egy kis speedet",true,"Everclear",true,50),
(1,"Silverhand","20ml Tequillahoz adjunk hozzá egy kiskanálnyi sört, és egy félkanálnyi csípőst.",true,"Tequilla",false,20),
(5,"Sárrét","15ml Csokilikőrhöz adjunk hozzá 15ml Fahéjjas Jack Danielst és öntsük fel Fehér Monsterrel",true,"Csokilikőr",false,130)
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
(5,"Meggyszörp",250,"Ml"),
(5,"Grapefruitlé",50,"Ml"),
(5,"Meggy",1,"Darab"),
(6,"Szentelt Víz",200,"Ml"),
(6,"Isten Vére bor",100,"Ml"),
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
--DELETE ONCE DONE
--("","",4,null,200,"what.webp","Merch","Pohárnyi","Magyarország",0,8000)

INSERT INTO WebshopTermek(TermekCim,TermekLeiras,TermekKiszereles,TermekUrtartalom,TermekKeszlet,TermekKepUtvonal,TermekKategoria,TermekMarka,TermekSzarmazas,TermekAlkoholSzazalek,Ar)
VALUES
/*Merch*/
("Pohárnyi Mintájú Felespohár","Szeretnéd közvetlen támogatni a csapatunkat? Akarsz is cserébe érte valamit? Vásárold meg ezt!",4,null,200,"what.webp","Merch","Pohárnyi","Magyarország",0,8000),
("Pohárnyi Póló","Szeretnéd közvetlen támogatni a csapatunkat? Akarsz is cserébe érte valamit? Vásárold meg ezt a pólót!",1,null,200,"what.webp","Merch","Pohárnyi","Magyarország",0,5500),
("Pohárnyi Mintájú Alátét","Szeretnéd reprezentálni a következő koktélod forrását a következő facebook-bejegyzésedben? Ez az alátét tökéletes erre!",4,null,200,"what.webp","Merch","Pohárnyi","Magyarország",0,4000),
("Pohárnyi Mintájú Jégkockakészítő","Szeretnél stílusos jégkockákat csinálni? Ez a jégkockakészítő tökéletes erre!",1,null,200,"what.webp","Merch","Pohárnyi","Magyarország",0,22000),

/*Eszköz*/
/*https://en.wikipedia.org/wiki/Cocktail_shaker*/
("Bostoni shaker","A Bostoni shaker egy koktél készítéshez használt eszköz, amely kettő fém részből áll. Az egyik részbe öntve a kívánt összetevőket, lezárjuk a másikkal, majd folyamatos fel-le mozgással összekeverjük őket. Az elkészült folyaékot érdemes szűrni",1,0.8,50,"what.webp","Eszköz","Pohárnyi","Magyarország",0,5000),
("Szűrő","A koktélszűrő célja szétválasztani a jeget a folyadéltól, miután azt összekevertük.",1,null,40,"what.webp","Eszköz","Pohárnyi","Magyarország",0,4000),
("Koktélkanál","Egy hosszú, spirálos nyelvű kanál, aminek célja a koktél higénikus elkeverése, illetve a spirált felhasználva folyadékok egymásra rétegezése.",2,null,200,"what.webp","Eszköz","Pohárnyi","Magyarország",0,2000),
("Citrushámozó","Egy specializált hámozó, mely kis reszelékeket szed le a gyümölcs héjjából, amiket a koktélhoz lehet adni",1,null,200,"what.webp","Eszköz","Pohárnyi","Magyarország",0,2000),

/*Whiskey*/
("Jack Daniels","A Jack Daniels egy az Amerikai tennessee államból származó kukorica alapú, faszénnel szűrt whiskey.",1,0.75,200,"what.webp","Whiskey","Jack Daniels","Amerika",23,7650),
("Jack Daniels Fire","A Jack Daniels egy az Amerikai tennessee államból származó kukorica alapú, faszénnel szűrt whiskey. Ennek a változatnak fahéjas utóíze van",1,0.75,200,"what.webp","Whiskey","Jack Daniels","Amerika",23,8500),
("Jack Daniels Blackberry","A Jack Daniels egy az Amerikai tennessee államból származó kukorica alapú, faszénnel szűrt whiskey. Ez a változata áfonyás ízű",1,0.75,200,"what.webp","Whiskey","Jack Daniels","Amerika",23,8500),
("Jack Daniels Honey","A Jack Daniels egy az Amerikai tennessee államból származó kukorica alapú, faszénnel szűrt whiskey. Ennek a változatnak mézes utóíze van.",1,0.75,200,"what.webp","Whiskey","Jack Daniels","Amerika",23,8500),

/*Sör*/
/*https://www.kifli.hu/11245-heineken-minosegi-ueveges-vilagos-soer-5   valaki tényleg ittasan írt egy endpoint nevet a sörnek.*/
("Heineken Original","A Heineken egy lager sör különleges A-élesztő felhasználásával készül, amely az összetéveszthetetlenül harmonikus, enyhén gyümölcsös ízjegyeket garantálja.",1,0.5,1000,"what.webp","Sör","Heineken","Hollandia",5,500),
/*https://idrinks.hu/asahi-super-dry-japan-sor*/
("Asahi Super Dry","Kiválóan kiegyensúlyozott ízvilágával és könnyed, kevésbé keserű karakterével a japán sörök egyik prémium képviselője.",1,0.5,1000,"what.webp","Sör","Asahi","Japán",5,500),
/*https://www.kifli.hu/91084-peroni-nastro-azzurro-stile-capri-minosegi-vilagos-soerkeverek-4-2*/
("Peroni Stile Capr"," Peroni Stile Caprit a hozzáadott olasz citrom és olajfalevél kivonata teszi még egyedibbé, ezzel megidézve az olasz tengerpart jellegzetes nyári hangulatát ennek a prémium lager sörnek",1,0.5,1000,"what.webp","Sör","Peroni","Olaszország",5,500),
/*https://www.dreherzrt.hu/markaink_oldal/arany-aszok/ */
("Arany Ászok","Közép-Magyarország egyik legnépszerűbb sörét, az Arany Ászokot, Dreher Antal által 1841-ben kifejlesztett, és később a magyar söriparban is meghonosított ászokolási technika alapján főzik.Nevét aranyló színéről és kiváló minőségéről kapta Kiegyensúlyozott íze, aranyló ragyogása és tömör habja tükrözi a kifogástalan minőséget, amit sok évtizedes hagyományokra visszatekintő szakértelmünk garantál.",1,0.5,1000,"what.webp","Sör","Dreher","Magyarország",5,500),

/*Egyéb*/
("Ouzou","Görög alkohol, mentolos ízzel",1,0.5,200,"what.webp","Egyéb","Görög Varázs","Görögország",12,9500),
("Soju Eper","Koreai desztillált alkohol, eper ízben",1,0.35,200,"what.webp","Egyéb","Jinro","Korea",12,2500);


INSERT INTO KosárTermék(KosarID,TermekID,Darabszam,Egysegar)
VALUES
(1,3,1,9500),
(1,2,2,7650),
(3,1,1,8000);

INSERT INTO Jelentesek(JelentettID,JelentettTartalomID,JelentesTipusa)
VALUES
(2,2,"Koktél"),
(9,11,"Koktél"),
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
