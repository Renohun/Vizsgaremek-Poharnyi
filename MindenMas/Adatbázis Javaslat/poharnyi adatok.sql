-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2026. Máj 04. 16:10
-- Kiszolgáló verziója: 8.4.0
-- PHP verzió: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `pohárnyi`
--

--
-- A tábla adatainak kiíratása `ertekeles`
--

INSERT INTO `ertekeles` (`ErtekelesID`, `Keszito`, `HovaIrták`, `MilyenDologhoz`, `Ertekeles`) VALUES
(1, 6, 4, 'Termék', 3),
(3, 3, 7, 'Koktél', 1),
(9, 3, 10, 'Koktél', 5),
(12, 3, 15, 'Koktél', 5),
(14, 3, 1, 'Termék', 5),
(18, 2, 7, 'Koktél', 5),
(19, 2, 7, 'Termék', 3),
(20, 13, 14, 'Koktél', 4),
(21, 13, 20, 'Termék', 1),
(22, 13, 16, 'Termék', 5),
(23, 7, 22, 'Koktél', 3),
(24, 1, 21, 'Koktél', 4),
(25, 3, 4, 'Termék', 5),
(26, 5, 30, 'Koktél', 4),
(27, 9, 30, 'Koktél', 3),
(28, 9, 7, 'Koktél', 5),
(29, 9, 10, 'Koktél', 5),
(30, 2, 15, 'Koktél', 2);

--
-- A tábla adatainak kiíratása `felhasználó`
--

INSERT INTO `felhasználó` (`FelhID`, `Felhasználónév`, `Email`, `Jelszó`, `JelszóHossza`, `ProfilkepUtvonal`, `RegisztracioDatuma`, `Admin`) VALUES
(1, 'poharnyiAdmin', 'poharnyiAdmin@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$aHw3kmpIBeoIUUgnd637sQ$KJ2Jdyx6oPAEYzMPNx/OfKIOdsRp88kPRuRMtqfzsWY', 11, 'whatever.png', '2024-04-10 11:25:45', 1),
(2, 'benczikmarcell', 'benczik.marci@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$so4x4nnqRtn9yvhNrGzQNw$8Q1WaWGETK2VvclitENgsvLniwdmUO+g/ZuSw4nA+sc', 12, '2026.4.18-what-16.png', '2026-02-18 11:50:58', 1),
(3, 'Kavics', 'davidhoki10@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$JiVCGkpLNlQnRF3XxPkgkQ$SKq/K27YsAXH42qINtQxhvMVKzA3YrYMumSqX0gqWXs', 12, '2026.4.19-vicces szamar (1 of 1)-76.jpg', '2026-04-18 11:56:16', 1),
(4, 'sebi2ga121', 'kristofsebestyen@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$qS3cCISdu8fplUpSHWneKA$OI+wBxKpM5xkG6c/4TXbBdPC/pVKflA4PWHsY0Ey91U', 12, 'whatever.png', '2026-04-18 12:01:31', 1),
(5, 'b.kornel', 'betteskornel@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$AD4yBwk3ZDIi83HA18ZqpA$1OFAYR7ck/75nuqOnsZcz5TXzqujZe883Vs/ISRnqVo', 12, 'whatever.png', '2026-04-18 12:11:08', 1),
(6, 'gyuri1', 'alkatresz111@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$o205DHGlonuoLYrYquElyw$VPQPam53ZIM8lyMpn1UQyjLiTGPoGq1y81hHO8yuYiI', 12, 'whatever.png', '2026-04-18 12:13:00', 0),
(7, 'Gabi', 'kifi@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$CCyip80sKHnRwToGBfDKtg$mUCAAZJKIfXxyHNPGphwso8Jdei0IuFkJyg01ExZCZ8', 12, '2026.4.19-Screenshot_20260310-184624 (1) (1) (1)-29.png', '2026-04-18 13:40:02', 0),
(9, 'feribacsi', 'feri@ferigmail.com', '$argon2id$v=19$m=65536,t=3,p=4$cDpMmeiMcCBUc3Qb3U2+ew$RuRGenugtbQ+s9aMlfFY95Pvr5zoOMpekFdHvzD4Il0', 8, '2026.5.4.1777896656157-a-49.jpg', '2026-04-19 12:04:29', 0),
(10, 'KornelOkos67', 'his.imre.sandor@trefort.eu', '$argon2id$v=19$m=65536,t=3,p=4$wFA76L5xdbcJspietfrDNQ$HBgLDPXGU+1XO5dJHktnNKREQKXjFuJ4sYyHM40MeOQ', 13, 'whatever.png', '2026-04-21 09:59:21', 0),
(11, 'Szonjaaaa', 'n.szonja@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$DhmgjsZzH9lEha1zV5uq3Q$pS63VwGdHGf6kN2g34mg4D09HtELppn+WG6vbuthx1c', 12, 'whatever.png', '2026-04-21 10:40:02', 0),
(12, 'Afonya', 'har0104ani@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$mnsYMc8gmsdOX88PbFoQKw$1cpKWBdn6A2o8gjyoXqo9/e6psX6qE9TpF8sxQqATzs', 11, 'whatever.png', '2026-04-22 12:47:00', 0),
(13, 'Dodi', 'foka1979@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$p8Q+Xz5odUkQttZaVFMyhQ$1k5zYFqDvDL9rPt50VDVvnZFpcuXmdmU8BKPSfanTvc', 11, 'whatever.png', '2026-04-22 17:34:47', 0),
(14, 'gergelyzoltan', 'gergely.zoltan75@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$l5RMK8cgTX1CFyhJ1P30TA$0Hu/CANb8Q8Y6woHKyb1KY58YGdqim9pGze+dNPrOX8', 20, 'whatever.png', '2026-04-25 07:42:19', 0),
(15, 'Berni', 'berni.cseh@yahoo.com', '$argon2id$v=19$m=65536,t=3,p=4$hJmJMoeHiNRocp2qU8xOtQ$vK5DV5vv2mTYDFfe1OkxUYo7s0KSoS1ZFliZnzwWdB4', 9, 'whatever.png', '2026-04-25 18:26:44', 0),
(16, 'csaki', 'hdsojjon@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$aj/oJVYm8Ie2ZApysNEtIg$4RIsDsyfLZoz6TSd8HHWWxP/dDa8Co797U6AYboVI3o', 10, '2026.4.26-ironman-87.jpg', '2026-04-26 09:39:16', 0),
(17, 'Kacsa420', 'vargaarnold197@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$jLNEhnUPvwWY8hpka87Dng$3tdsB8kom1EpGnSuG9b0yHA+WCkDpE1m2/PtgwXCvGg', 9, 'whatever.png', '2026-04-28 10:57:19', 0);

--
-- A tábla adatainak kiíratása `jelentesek`
--

INSERT INTO `jelentesek` (`JelentesID`, `JelentettID`, `JelentettTartalomID`, `JelentesTipusa`, `JelentesIdopontja`, `JelentesAllapota`, `JelentesMennyisege`) VALUES
(2, 3, 3, 'Komment', '2026-04-18 15:05:05', 2, 0),
(4, 7, 10, 'Koktél', '2026-04-19 13:24:24', 3, 1),
(6, 7, 7, 'Felhasználó', '2026-04-19 13:25:26', 3, 1),
(7, 7, 11, 'Koktél', '2026-04-19 16:28:41', 3, 1),
(8, 7, 7, 'Koktél', '2026-04-19 16:29:17', 3, 1),
(10, 7, 23, 'Koktél', '2026-05-04 14:46:30', 3, 1),
(11, 11, 21, 'Koktél', '2026-05-04 14:47:29', 2, 1);

--
-- A tábla adatainak kiíratása `jelentők`
--

INSERT INTO `jelentők` (`JelentőID`, `JelentésID`, `JelentesIndoka`) VALUES
(1, 4, 'nem tetszik'),
(5, 8, ''),
(5, 7, 'a'),
(5, 10, 'jjj'),
(5, 11, 'ez nem is koktel');

--
-- A tábla adatainak kiíratása `jelvények`
--

INSERT INTO `jelvények` (`JelvényID`, `JelvényNeve`, `JelvenyKategoria`) VALUES
(1, 'Savanyú', 'ízek'),
(2, 'Csípős', 'ízek'),
(3, 'Keserű', 'ízek'),
(4, 'Glutén', 'Allergének'),
(5, 'Erős', 'Erősség'),
(6, 'Gyenge', 'Erősség'),
(7, 'Mogyorók', 'Allergének'),
(8, 'Tojás', 'Allergének'),
(9, 'Tej', 'Allergének'),
(10, 'Édes', 'ízek');

--
-- A tábla adatainak kiíratása `kedvencek`
--

INSERT INTO `kedvencek` (`KikedvelteID`, `MitkedveltID`) VALUES
(3, 10),
(3, 21),
(2, 7),
(5, 10);

--
-- A tábla adatainak kiíratása `koktelokosszetevoi`
--

INSERT INTO `koktelokosszetevoi` (`KoktélID`, `Osszetevő`, `Mennyiség`, `Mertekegyseg`) VALUES
(21, 'Sör', 300, 'ml'),
(21, 'Vodka', 200, 'ML'),
(21, 'Tea', 200, 'ML'),
(22, 'Gin', 50, 'ml'),
(22, 'Tonic', 200, 'ML'),
(22, 'Jégkocka ', 3, 'darab'),
(26, 'Fehér rum', 50, 'ml'),
(26, 'Cola', 150, 'ML'),
(26, 'Lime', 0.5, 'darab'),
(26, 'Jégkoca', 10, 'darab'),
(27, ' Őszibarack Likőr ', 200, 'ml'),
(27, ' Baileys Irish Cream ', 200, 'ML'),
(27, 'Grenadine szirup', 200, 'ML'),
(28, 'Fehér rum', 60, 'ml'),
(28, 'Lime lé', 30, 'ml'),
(28, 'Cukorszirup', 30, 'ml'),
(28, 'Szódavíz', 100, 'ml'),
(28, 'Mentalevél', 2, 'darab'),
(7, 'Őszibaracklé', 500, 'ml'),
(7, 'Jégkocka', 3, 'darab'),
(7, 'Juharszirup ', 50, 'ml'),
(7, 'Vaníliafagylalt', 400, 'ml'),
(7, 'Kókuszvíz ', 50, 'ml'),
(10, 'Vodka', 50, 'ml'),
(10, 'Narancslé', 150, 'ml'),
(10, 'Lime szirup', 50, 'ml'),
(11, 'Vörösbor', 200, 'ml'),
(11, 'Tisztított víz', 100, 'ml'),
(11, 'Kóla szirup', 50, 'ml'),
(23, 'Sloe gin', 50, 'ml'),
(23, 'Citrom leve', 25, 'ml'),
(23, 'Cukorszirup', 15, 'ml'),
(23, 'Jégkocka ', 2, 'darab'),
(23, 'Szódavíz ', 10, 'ml'),
(29, 'Narancslikőr', 30, 'ml'),
(29, 'Baileys', 20, 'ml'),
(29, 'Tejszín', 10, 'ml'),
(14, 'macskamenta', 10, 'gr'),
(14, 'Vodka', 140, 'ml'),
(14, 'narancslé', 58, 'ml'),
(15, 'vodka', 50, 'ml'),
(15, 'tequila', 50, 'ml'),
(15, 'Bacardi', 50, 'ml'),
(15, 'pezsgő', 150, 'ml'),
(15, 'meggysör', 200, 'ml'),
(31, 'Orange spritz szirup', 20, 'ml'),
(31, 'Sprite', 200, 'ML'),
(31, 'Ásványvíz', 280, 'ML'),
(32, 'Alkoholmentes pezsgő', 750, 'ml'),
(32, 'Narancslé', 500, 'ML'),
(32, 'Jégkocka', 10, 'darab'),
(32, 'Pezsgős pohár ', 6, 'darab'),
(33, 'Whisky', 45, 'ml'),
(33, 'Vodka', 45, 'ml'),
(33, 'Szódavíz/Sprite', 175, 'ml'),
(34, 'Sör (világos)', 420, 'ml'),
(34, 'Szaké', 30, 'ml'),
(30, 'Sör', 300, 'ml'),
(30, 'Whiskey ', 200, 'ml'),
(30, 'Cukor', 50, 'gr'),
(38, 'Fehér Rum', 60, 'ml'),
(38, 'Lime', 30, 'ml'),
(38, 'Szirup', 20, 'ml'),
(38, 'Jégkockák', 5, 'darab'),
(40, 'Csípős Vodka', 15, 'ml'),
(40, 'Vodka', 60, 'ml'),
(40, 'Citromlé', 120, 'ml'),
(40, 'Jég', 6, 'darab'),
(40, 'Szódavíz', 305, 'ml'),
(39, 'Diplomatico Planas fehér rum', 4, 'cl'),
(39, 'Limelé', 20, 'ml'),
(39, 'cukorszirup', 5, 'ml');

--
-- A tábla adatainak kiíratása `koktél`
--

INSERT INTO `koktél` (`KoktélID`, `Keszito`, `KeszitesDatuma`, `Alkoholos`, `KoktelCim`, `KoktelNepszeruseg`, `BoritoKepUtvonal`, `Alap`, `Recept`, `AlapMennyiseg`) VALUES
(7, 7, '2026-04-18 14:23:57', 0, 'Napsugár', 78, '2026.4.24-Fagyis-47.jpg', '', 'Dobd bele egy keverőbe és rázd össze 🙂', 1000),
(10, 7, '2026-04-18 15:17:42', 1, 'Savanya', 56, '2026.4.24-Savanya-48.jpg', 'Vodka', 'Enyhén savanykás koktél, de azért.... ', 250),
(11, 7, '2026-04-18 15:36:28', 1, 'Ogre', 30, '2026.4.24-Ogre-49.jpg', 'Vörösbor', 'A vízbe beletesszük a bubit 😄 majd hozzáadjuk a félédes vörösbort. Egy tiszta keverőpálcával kettőt keverünk rajta. ', 350),
(14, 3, '2026-04-19 09:55:31', 0, 'Cirmi', 34, '2026.4.24-refreshing-drink-orange-mint-with-little-vodka_22736-60-52.jpg', '', 'Keverd össze a vodkát a narancslével, majd kicsit nyomkodd össze a macskamentát, és tedd a folyékony összetevőkhöz. Sok jéggel kínáld!', 198),
(15, 9, '2026-04-19 12:17:23', 1, 'Meggyes KO.', 25, '2026.4.24-letÃ¶ltÃ©s (3)-55.jpg', 'vodka', 'jég-vodka-tequila-Bacardi-Pezsgő-Meggysör', 500),
(21, 11, '2026-04-21 11:26:07', 1, 'Kolis', 17, '2026.4.21-1000026304-32.jpg', 'Sör ', 'Olcso, finom, üt', 700),
(22, 2, '2026-04-22 12:43:30', 1, 'Gin tonic', 15, '2026.4.22-473-38.jpg', 'Gin', 'Egy jéggel teli pohárba öntsük a gint majd rá a tonicot', 250),
(23, 7, '2026-04-22 19:32:19', 1, 'Sloe Gin Fizz', 10, '2026.4.24-Sloe-50.jpg', 'Gin', 'Egy shakerben keverd össze a sloe gint, a friss citromlevet és a cukorszirupot jéggel.\nMajd óvatosan adj hozzá szódavizet.', 100),
(26, 3, '2026-04-23 16:31:39', 1, 'Cuba libre', 9, '2026.4.23-1000025459-46.jpg', 'Fehér rum', 'Tedd a jeget a pohárba, facsard rá a limeot és önts bele a rumot, kicsit keverd össze, majd öntsd hozzá a kólát. Megint keverd össze és egészségedre! ', 200),
(27, 13, '2026-04-23 16:41:09', 0, 'Véres agy', 14, '2026.4.23-IMG_1060-47.jpeg', '', 'A koktél elkészítése előtt hűtsük le mindkét likőrt, hogy könnyebben tudjuk rétegezni őket. Először shot-os pohárba töltjük az őszibarack likőrt, majd bárkanál segítségével óvatosan rácsurgatjuk az irish cream likőrt. Végül a tetejére csepegtetjük a grenadine szirupot.', 600),
(28, 7, '2026-04-24 11:22:11', 1, 'Mojito', 3, '2026.4.24-Mojito-46.jpg', 'Rum', 'A rumot, lime-ot és a szirupot keverd össze, majd öntsd hozzá a szódavizet. Ízesítheted mentalevéllel.', 220),
(29, 7, '2026-04-24 11:45:38', 1, 'Felhő', 4, '2026.4.24-Orgasm-51.jpg', 'Likőr', 'Az összetevőket shakerben összerázzuk, majd koktélospohárba töltjük.', 60),
(30, 3, '2026-04-24 13:21:22', 1, 'A Viszkis', 12, '2026.4.24-1000025459-53.jpg', 'Sör', 'A cukrot keverd össze a whiskey-vel, majd Öntsd hozzá a sört, és jó szenvedést! ', 500),
(31, 14, '2026-04-25 07:46:54', 0, 'Aperol Spritz (alkoholmentes)', 8, '2026.4.25-KÃ©pernyÅfotÃ³ 2026-04-25 - 9-60.png', '', 'Rakjunk jégkockákat egy borospohárba, töltsük rá az Orange Spritz szirupot, majd adjuk hozza egy kis Sprite és végül öntsük fel ásványvízzel és keverjük fel.', 500),
(32, 7, '2026-04-25 10:11:53', 0, 'Mimóza', 7, '2026.4.25-mimosa-cocktails-with-orange-slices-arrangement@033x-1536x1025 (1)-61.jpg', '', 'A 6 darab pezsgős poharat töltsd félig narancslével, majd a tetejére tölts alkoholmentes pezsgőt. Naranccsal  és jégkockával díszítheted a poharakat!', 1250),
(33, 7, '2026-04-26 15:19:59', 1, 'Pentecostal', 5, '2026.4.26-pentecoste-39.jpg', 'Whisky', 'A whisky-t beletöltjük egy vizespohárba majd hozzáadjuk a vodkát és a Sprite-ot vagy szódát.\nÖsszekeverjük, díszítés nélkül kínáljuk.', 265),
(34, 7, '2026-04-26 15:27:30', 1, 'Sake Bomb', 8, '2026.4.26-sakebomb-40.jpg', 'Sör', 'Töltsünk az üveges sörből, mintegy 4 dl-t a pohárba. Öntsünk egy kupicás pohárba japán szakét és engedjük bele (dobjuk bele óvatosan) a sörös pohárba. Lehetőség szerint rögtön fogyasszuk el.', 450),
(38, 9, '2026-05-04 17:38:14', 1, 'Daiquiri', 4, '2026.5.4.1777896656157-b-44.jpg', 'Fehér Rum', 'Töltsd be a rumot, a limeot és a szirupot a keverőbe és rázd össze, majd szűrd át egy üvegpohárba, majd tegyél bele jeget és a szélére helyezz egy lime szeletet', 110),
(39, 3, '2026-05-04 18:05:49', 1, 'Kavics Daiquri', 3, '2026.5.4.1777910521802-La-Ricetta-del-Daiquiri-cover-1-50.jpg', 'fehér rum', 'Az alapanyagokat skékerben jéggel összerázzuk, és hűtött koktélos pohárba szűrjük Lime karikával díszíthetjük.', 65),
(40, 2, '2026-05-04 18:06:18', 0, 'Citrom Savanyú', 1, '2026.5.4.1777910521802-images-49.jpg', '', 'Öntsük össze a Vodkákak és a citromlét, majd tegyük bele a jeget, utána töltsük teli szódavízzel, majd keverjükel', 500);

--
-- A tábla adatainak kiíratása `koktélokjelvényei`
--

INSERT INTO `koktélokjelvényei` (`KoktélID`, `JelvényID`) VALUES
(7, 10),
(7, 6),
(7, 9),
(10, 1),
(10, 5),
(11, 10),
(11, 6),
(14, 1),
(14, 10),
(14, 5),
(15, 10),
(15, 5),
(21, 10),
(21, 3),
(21, 5),
(22, 3),
(22, 6),
(23, 10),
(23, 6),
(26, 10),
(26, 5),
(27, 10),
(27, 6),
(28, 10),
(28, 5),
(29, 10),
(29, 5),
(29, 9),
(30, 3),
(30, 5),
(31, 10),
(31, 6),
(32, 1),
(32, 6),
(33, 3),
(33, 5),
(34, 3),
(34, 5),
(38, 1),
(38, 5),
(39, 1),
(39, 10),
(39, 5),
(40, 2),
(40, 1),
(40, 5);

--
-- A tábla adatainak kiíratása `komment`
--

INSERT INTO `komment` (`KommentID`, `Keszito`, `HovaIrták`, `Tartalom`, `Pozitiv`, `Negativ`) VALUES
(2, 2, 7,'Kicsit sokallom benne a fagyit, de összességében nagyon finom lett !', 2, 0),
(3, 3, 7,'Tesó, ez undorító! De legalább cukik a cicák <3', 0, 0),
(5, 7, 11,'Juj, lemaradt a szirup hozzákeverése, és természetesen a bubi=szóda', 0, 0),
(6, 7, 7,'Az a minimum ezek után, hogy cukik 🙂\nÜgyik vagytok, gratulálok ☺️', 2, 1),
(12, 2, 15,'Köszi, 3 órája csak hányok ', 2, 0),
(15, 3, 15,'-note legközlebb kipróbáljuk', 1, 2),
(20, 13, 14,'Ez fini lett🤪🥂', 0, 0),
(21, 1, 14,'', 0, 0),
(22, 13, 7,'Tökéletes', 0, 0),
(23, 5, 30,'nem tetszik', 1, 0),
(24, 9, 30,'50g cukor??? Te megőrültél?', 0, 0);

--
-- A tábla adatainak kiíratása `kommentertekeles`
--

INSERT INTO `kommentertekeles` (`FelhID`, `KommentID`, `Pozitiv`, `Negativ`) VALUES
(2, 6, 1, 1),
(10, 2, 1, 0),
(3, 12, 1, 0),
(2, 15, 0, 0),
(5, 6, 1, 1),
(1, 15, 0, 1),
(7, 2, 1, 0),
(5, 15, 1, 0),
(5, 12, 1, 0),
(9, 15, 0, 1),
(9, 23, 1, 0);

--
-- A tábla adatainak kiíratása `kosártermék`
--

INSERT INTO `kosártermék` (`KosarID`, `TermekID`, `Darabszam`, `EgysegAr`) VALUES
(6, 14, 1, 8500),
(6, 15, 4, 8500),
(6, 6, 1, 400),
(6, 5, 1, 5500),
(7, 1, 6, 8000),
(13, 1, 1, 8000),
(13, 16, 7, 500),
(13, 20, 1, 500),
(3, 7, 1, 5000),
(7, 6, 1, 400),
(6, 8, 1, 4000),
(6, 4, 1, 22000),
(17, 1, 1, 8000),
(3, 5, 1, 5500),
(3, 4, 1, 22000),
(2, 1, 1, 8000);

--
-- A tábla adatainak kiíratása `webshoporszag`
--

INSERT INTO `webshoporszag` (`OrszagID`, `OrszagNev`) VALUES
(1, 'Egyesült Államok'),
(2, 'Kanada'),
(3, 'Mexikó'),
(4, 'Brazília'),
(5, 'Argentina'),
(6, 'Portugália'),
(7, 'Spanyolország'),
(8, 'Írország'),
(9, 'Nagy-Britannia'),
(10, 'Franciaország'),
(11, 'Belgium'),
(12, 'Hollandia'),
(13, 'Németország'),
(14, 'Svájc'),
(15, 'Olaszország'),
(16, 'Dánia'),
(17, 'Norvégia'),
(18, 'Svédország'),
(19, 'Finnország'),
(20, 'Ausztria'),
(21, 'Csehország'),
(22, 'Szlovákia'),
(23, 'Magyarország'),
(24, 'Románia'),
(25, 'Lengyelország'),
(26, 'Szlovénia'),
(27, 'Horvátország'),
(28, 'Szerbia'),
(29, 'Bosznia'),
(30, 'Montenegró'),
(31, 'Koszovó'),
(32, 'Albánia'),
(33, 'Észak-Makedónia'),
(34, 'Görögország'),
(35, 'Bulgária'),
(36, 'Ukrajna'),
(37, 'Észtország'),
(38, 'Lettország'),
(39, 'Litvánia'),
(40, 'Oroszország'),
(41, 'Törökország'),
(42, 'Grúzia'),
(43, 'Örményország'),
(44, 'Azerbajdzsán'),
(45, 'Törökország'),
(46, 'Kína'),
(47, 'Japán'),
(48, 'Dél-Kórea'),
(49, 'India'),
(50, 'Pakisztán'),
(51, 'Bangladesh'),
(52, 'Ausztrália'),
(53, 'Indokína'),
(54, 'Arab-Félsziget'),
(55, 'Afrika'),
(56, 'Óceánia'),
(57, 'Amerika');

--
-- A tábla adatainak kiíratása `webshoptermek`
--

INSERT INTO `webshoptermek` (`TermekID`, `TermekCim`, `TermekLeiras`, `TermekKiszereles`, `TermekUrtartalom`, `TermekKeszlet`, `TermekKepUtvonal`, `TermekKategoria`, `TermekMarka`, `TermekHanyanVettekMeg`, `TermekSzarmazas`, `TermekAlkoholSzazalek`, `TermekKora`, `TermekDiscount`, `Ar`) VALUES
(1, 'Pohárnyi Mintájú Felespohár', 'Szeretnéd közvetlen támogatni a csapatunkat? Akarsz is cserébe érte valamit? Vásárold meg ezt!', 4, NULL, 198, '2026.4.18-letÃ¶ltÃ©s-4.jpg', 'Merch', 'Pohárnyi', 2, 23, 0, 0, 25, 8000),
(4, 'Pohárnyi Mintájú Jégkockakészítő', 'Szeretnél stílusos jégkockákat csinálni? Ez a jégkockakészítő tökéletes erre!', 1, NULL, 199, '2026.4.18-shopping (1)-7.webp', 'Merch', 'Pohárnyi', 1, 23, 0, 0, 10, 22000),
(5, 'Pohárnyi Póló', 'Szeretnéd közvetlen támogatni a csapatunkat? Akarsz is cserébe érte valamit? Vásárold meg ezt a pólót!', 1, NULL, 200, '2026.4.18-letÃ¶ltÃ©s (1)-8.jpg', 'Merch', 'Pohárnyi', 0, 23, 0, 0, NULL, 5500),
(6, 'Pohárnyi Mintájú Alátét', 'Szeretnéd reprezentálni a következő koktélod forrását a következő facebook-bejegyzésedben? Ez az alátét tökéletes erre!', 4, NULL, 200, '2026.4.18-shopping-9.webp', 'Merch', 'Pohárnyi', 0, 23, 0, 0, NULL, 400),
(7, 'Bostoni shaker', 'A Bostoni shaker egy koktél készítéshez használt eszköz, amely kettő fém részből áll. Az egyik részbe öntve a kívánt összetevőket, lezárjuk a másikkal, majd folyamatos fel-le mozgással összekeverjük őket. Az elkészült folyaékot érdemes szűrni', 1, NULL, 0, '2026.4.18-letÃ¶ltÃ©s-10.webp', 'Eszkozok', 'Pohárnyi', 1, 23, 0, 0, NULL, 5000),
(8, 'Szűrő', 'A koktélszűrő célja szétválasztani a jeget a folyadéltól, miután azt összekevertük.', 1, NULL, 20, '2026.4.18-letÃ¶ltÃ©s (1)-11.webp', 'Eszkozok', 'Pohárnyi', 0, 23, 0, 0, NULL, 4000),
(10, 'Koktélkanál', 'Egy hosszú, spirálos nyelvű kanál, aminek célja a koktél higénikus elkeverése, illetve a spirált felhasználva folyadékok egymásra rétegezése.', 2, NULL, 40, '2026.4.18-shopping (2)-14.webp', 'Eszkozok', 'Pohárnyi', 0, 23, 0, 0, NULL, 2000),
(11, 'Citrushámozó', 'Egy specializált hámozó, mely kis reszelékeket szed le a gyümölcs héjjából, amiket a koktélhoz lehet adni', 1, NULL, 200, '2026.4.18-letÃ¶ltÃ©s (2)-15.webp', 'Eszkozok', 'Pohárnyi', 0, 23, 0, 0, NULL, 2000),
(12, 'Jack Daniels', 'A Jack Daniels egy az Amerikai tennessee államból származó kukorica alapú, faszénnel szűrt whiskey.', 1, 0.75, 200, '2026.4.18-shopping (3)-16.webp', 'Whisky', 'Jack Daniels', 0, 1, 23, 12, 10, 7650),
(13, 'Jack Daniels Fire', 'A Jack Daniels egy az Amerikai tennessee államból származó kukorica alapú, faszénnel szűrt whiskey. Ennek a változatnak fahéjas utóíze van', 1, 0.75, 200, '2026.4.18-letÃ¶ltÃ©s (3)-10.webp', 'Whisky', 'Jack Daniels', 0, 1, 23, 12, NULL, 8500),
(14, 'Jack Daniels Blackberry', 'A Jack Daniels egy az Amerikai tennessee államból származó kukorica alapú, faszénnel szűrt whiskey. Ez a változata áfonyás ízű', 1, 0.75, 200, '2026.4.18-shopping (6)-11.webp', 'Whisky', 'Jack Daniels', 0, 1, 23, 12, NULL, 8500),
(15, 'Jack Daniels Honey', 'A Jack Daniels egy az Amerikai tennessee államból származó kukorica alapú, faszénnel szűrt whiskey. Ennek a változatnak mézes utóíze van.', 1, 0.75, 200, '2026.4.18-shopping (5)-12.webp', 'Whisky', 'Jack Daniels', 0, 1, 23, 12, NULL, 8500),
(16, 'Heineken Original', 'A Heineken egy lager sör különleges A-élesztő felhasználásával készül, amely az összetéveszthetetlenül harmonikus, enyhén gyümölcsös ízjegyeket garantálja.', 1, 0.5, 1000, '2026.4.18-shopping (7)-13.webp', 'Sor', 'Heineken', 0, 12, 5, 1, NULL, 500),
(17, 'Asahi Super Dry', 'Kiválóan kiegyensúlyozott ízvilágával és könnyed, kevésbé keserű karakterével a japán sörök egyik prémium képviselője.', 1, 0.5, 1000, '2026.4.18-shopping (8)-14.webp', 'Sor', 'Asahi', 0, 47, 5, 1, NULL, 500),
(19, 'Achel Dubbel', 'Mahagóni színű testes dubbel, a maláta és sötét gyümölcsök egyensúlyban lévő ízjegyeivel, és a füstös, csokoládés útóízével a belga sörfőzés megkerülhetetlen terméke', 1, 0.33, 1000, '2026.4.18-4-16.png', 'Sor', 'Achel', 0, 11, 8, 1, NULL, 1670),
(20, 'Arany Ászok', 'Közép-Magyarország egyik legnépszerűbb sörét, az Arany Ászokot, Dreher Antal által 1841-ben kifejlesztett, és később a magyar söriparban is meghonosított ászokolási technika alapján főzik.Nevét aranyló színéről és kiváló minőségéről kapta Kiegyensúlyozott íze, aranyló ragyogása és tömör habja tükröz', 1, 0.5, 1000, '2026.4.18-images-17.jpg', 'Sor', 'Arany Ászok', 0, 23, 5, 1, NULL, 500),
(21, 'Peroni Stile Capri', 'Peroni Stile Caprit a hozzáadott olasz citrom és olajfalevél kivonata teszi még egyedibbé, ezzel megidézve az olasz tengerpart jellegzetes nyári hangulatát ennek a prémium lager sörnek', 1, 0.5, 1000, '2026.4.18-310210350103-1-18.jpg', 'Sor', 'Peroni', 0, 15, 5, 1, NULL, 500),
(23, 'Fém szívószál ', 'Ez a rozsdamentes acélból készült szívószál tökéletes kiegészítője bármelyik koktélnak, segítve a fogyasztásában.  A szívószálat használat után nem kell eldobni, fertőtlenítés után újra fel lehet használni ', 10, NULL, 999, '2026.4.19-471-28.jpg', 'Eszkozok', 'Spinel', 1, 23, 0, 0, NULL, 2500),
(24, 'Csőpohár', 'Magasított felespohár.\nŰrtartalom: 6.5cl (65ml)', 1, NULL, 500, '2026.4.19-472-29.webp', 'Eszkozok', 'Pohárnyi', 0, 23, 0, 0, 67, 850);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
