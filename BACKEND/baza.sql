use master;
go
drop database if exists teretana;
go
create database teretana collate Croatian_CI_AS;
go
use teretana;

create table programi(
	sifra int not null primary key identity(1,1),
	naziv varchar(50) not null,
	cijena decimal(18,2),
	aktivan bit not null
);

create table grupe(
	sifra int not null primary key identity(1,1),
	naziv varchar(50) not null,
	program int not null references programi(sifra),
	trener varchar(50) not null
);

create table kategorije(
	sifra int not null primary key identity(1,1),
	naziv varchar(50) not null,
	cijena decimal(18,2)
);

create table vjezbaci(
	sifra int not null primary key identity(1,1),
	ime varchar(50) not null,
	prezime varchar(50) not null,
	email varchar(50),
	kategorija int not null references kategorije(sifra)
);

create table clanovi(
	grupa int not null references grupe(sifra),
	vjezbac int not null references vjezbaci(sifra)
);

insert into programi (naziv, cijena, aktivan) values
('Kardio HIIT', 35.00, 1),
('Snaga i Izdržljivost', 45.00, 1),
('Joga Flow', 30.00, 1),
('CrossFit Osnove', 50.00, 1),
('Funkcionalni Trening', 40.00, 0);

insert into kategorije (naziv, cijena) values
('Početnik', 10.00),
('Rekreativac', 15.00),
('Napredni', 20.00);

insert into grupe (naziv, program, trener) values
('Jutarnji HIIT', 1, 'Ana Anic'),
('Večernja Snaga', 2, 'Marko Markovic'),
('Joga za Početnike', 3, 'Petra Petrovic'),
('CrossFit Uvod', 4, 'Ivan Ivic'),
('Funkcionalni Master', 5, 'Jelena Jelic'),
('Kardio Maratonci', 1, 'Ana Anic');

insert into vjezbaci (ime, prezime, email, kategorija) values
('Matej', 'Horvat', 'matej.horvat@example.com', 1),
('Lucija', 'Novak', 'lucija.novak@example.com', 2),
('Filip', 'Kovacic', 'filip.kovacic@example.com', 3),
('Sara', 'Babic', 'sara.babic@example.com', 1),
('Dora', 'Knezovic', 'dora.knezovic@example.com', 2),
('Luka', 'Peric', 'luka.peric@example.com', 3),
('Ana', 'Juric', 'ana.juric@example.com', 1),
('Ivan', 'Loncar', 'ivan.loncar@example.com', 2),
('Mia', 'Maric', 'mia.maric@example.com', 3),
('Nikola', 'Tomic', 'nikola.tomic@example.com', 1),
('Ema', 'Vukovic', 'ema.vukovic@example.com', 2),
('Ante', 'Matic', 'ante.matic@example.com', 3),
('Petra', 'Markovic', 'petra.markovic@example.com', 1),
('Josip', 'Klaric', 'josip.klaric@example.com', 2),
('Tea', 'Bosnic', 'tea.bosnic@example.com', 3),
('Marin', 'Kraljic', 'marin.kraljic@example.com', 1),
('Lena', 'Sostar', 'lena.sostar@example.com', 2),
('David', 'Bilic', 'david.bilic@example.com', 3),
('Frano', 'Mandic', 'frano.mandic@example.com', 1),
('Rita', 'Lukic', 'rita.lukic@example.com', 2),
('Dario', 'Basic', 'dario.basic@example.com', 3),
('Marta', 'Grgic', 'marta.grgic@example.com', 1),
('Toni', 'Jovanovic', 'toni.jovanovic@example.com', 2),
('Elena', 'Popovic', 'elena.popovic@example.com', 3),
('Borana', 'Simic', 'borana.simic@example.com', 1),
('Karlo', 'Petrovic', 'karlo.petrovic@example.com', 2),
('Viktorija', 'Zelic', 'viktorija.zelic@example.com', 3),
('Stjepan', 'Horvatovic', 'stjepan.horvatovic@example.com', 1),
('Anamarija', 'Kovacevic', 'anamarija.kovacevic@example.com', 2),
('Bruno', 'Novkovic', 'bruno.novkovic@example.com', 3);

insert into vjezbaci (ime, prezime, email, kategorija) values
('Nikolina', 'Zoric', 'nikolina.zoric@example.com', 1),
('Damir', 'Horvatic', 'damir.horvatic@example.com', 2),
('Valentina', 'Perkovic', 'valentina.perkovic@example.com', 3);

insert into clanovi (grupa, vjezbac) values
(1, 1), (1, 4), (1, 7), (1, 10), (1, 13),
(2, 2), (2, 5), (2, 8), (2, 11), (2, 14),
(3, 3), (3, 6), (3, 9), (3, 12), (3, 15),
(4, 16), (4, 19), (4, 22), (4, 25), (4, 28),
(5, 17), (5, 20), (5, 23), (5, 26), (5, 29),
(6, 18), (6, 21), (6, 24), (6, 27), (6, 30);