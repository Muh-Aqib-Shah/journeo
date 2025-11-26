create database journeo;
use journeo;

create table users(
	id int auto_increment primary key,
    name varchar(100),
    email varchar(100)
);

insert into users(name, email) values
('Zain Khan', 'zain@gmail.com'), 
('Aqib Shah', 'aqib@hotmail.com'),
('Sohaib Sohail', 'sohaib@yahoo.com')
