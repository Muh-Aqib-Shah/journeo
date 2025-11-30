use journeo;

create table users(
user_id int auto_increment primary key,
email varchar(255) unique not null,
username varchar(255) unique not null,
password_hash varchar(255) not null,
profile_picture_url varchar(500), 
bio text,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp
);

create table trips(
trip_id int auto_increment primary key,
user_id int not null,
title varchar(255) not null,
description text,
destination_country varchar(255),
destination_city varchar(255),
start_date date,
end_date date,
total_days int,
budget_estimate decimal(10,2),
is_public boolean,
cover_image_url varchar(255),
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp,
foreign key (user_id) references users(user_id) on delete cascade
);

create table itineraries(
itinerary_id int auto_increment primary key,
trip_id int not null,
day_number int not null,
date date,
title varchar(255),
notes text,
created_at timestamp default current_timestamp,
foreign key(trip_id) references trips(trip_id) on delete cascade
);

create table comment(
comment_id int auto_increment primary key,
user_id int not null,
trip_id int not null,
comment_text text,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp,
foreign key (user_id) references users(user_id) on delete cascade,
foreign key(trip_id) references trips(trip_id) on delete cascade
);

create table favourite(
favourite_id int auto_increment primary key,
user_id int not null,
trip_id int not null,
created_at timestamp default current_timestamp,
foreign key (user_id) references users(user_id) on delete cascade,
foreign key(trip_id) references trips(trip_id) on delete cascade,
unique key unique_favorite (user_id, trip_id) #so that users dont favourite same trip twice
);

create table activity(
activity_id int auto_increment primary key,
itinerary_id int not null,
activity_name varchar(255),
description text,
location_name varchar(255),
latitude decimal(10,8),
longitude decimal(11,8),
start_time time,
end_time time,
estimated_cost decimal(10,2),
activity_type varchar(255),
booking_url varchar(255),
created_at timestamp default current_timestamp,
foreign key (itinerary_id) references itineraries(itinerary_id) on delete cascade
);

-- insert into users(email, username, password_hash, profile_picture_url, bio) values
-- ("ashhal@gmail.com", "ashhal", "hash123", "https://i.pravatar.cc/150?u=john", "I love travelling"),
-- ("barkhi123@gmail.com", "bakri", "hash123", "https://i.pravatar.cc/150?u=mike", "lmao xd"),
-- ("ibrahim@gmail.com", "topiInsan123", "hash123", "https://i.pravatar.cc/150?u=alex", "case in point"),
-- ("aleena@gmail.com", "aleenaFatima999", "hash123", "https://i.pravatar.cc/150?u=aleena", "food + travelling = yum"),
-- ("hasanjabbar@gmail.com", "HJ", "hash123", "https://i.pravatar.cc/150?u=hasan", "I love little places"),
-- ("kabeer@gmail.com", "kabi2number", "hash123", "https://i.pravatar.cc/150?u=kabeer", "siuuuuu"),
-- ("hafsa@gmail.com", "jhafsa0000", "hash123", "https://i.pravatar.cc/150?u=hafsa", "8x WDC"),
-- ("rafay@gmail.com", "rafayoooo", "hash123", "https://i.pravatar.cc/150?u=rafay", "visca barca"),
-- ("saadkhan111@gmail.com", "msk100", "hash123", "https://i.pravatar.cc/150?u=saad", "kawai"),
-- ("uzair@gmail.com", "uJawed", "hash123", "https://i.pravatar.cc/150?u=uzair", "viva la green arrow"),
-- ("ayeshaghani@gmail.com", "aGhani", "hash123", "https://i.pravatar.cc/150?u=ayesha", "dil dard e disco"),
-- ("hadiya@gmail.com", "hadiyaaaaa", "hash123", "https://i.pravatar.cc/150?u=hadiya", "chai meri jaan"),
-- ("smuhammadali@gmail.com", "maali", "hash123", "https://i.pravatar.cc/150?u=ali", "simply lovely"),
-- ("raahin@gmail.com", "rTajuddin", "hash123", "https://i.pravatar.cc/150?u=raahin", "I am white"),
-- ("ibad@gmail.com", "ibadoplus", "hash123", "https://i.pravatar.cc/150?u=ibad", "no u");

-- insert into trips(user_id, title, description, destination_country, destination_city, start_date, end_date, total_days, budget_estimate, is_public) values
-- (1, "Lahore lahore aye", "lor lor ay", "Pakistan", "Lahore", "2025-09-11", "2025-09-20", 9,2000.00, true),
-- (2, "Man Utd UCL Night", "Man Utd vs PSG match live", "England", "Manchester", "2023-03-15", "2023-03-22", 7,4500.00, true),
-- (2, "The Ashes day 3", "Going to watch England bat before departure", "England", "Yorkshire", "2023-03-27", "2023-03-30", 3,800.00, false),
-- (3, "Napoli Scudetto celebrations", "Scott Mctominay. That's it", "Italy", "Naples", "2025-05-04", "2025-05-20", 16,5500.00, false),
-- (4, "Spa GP", "Going to watch Ferrari", "Belgium", "Stavelot", "2019-09-01", "2025-09-06", 5,2900.00, true),
-- (5, "Islamabad Vacation", "Going to islamabad to visit friends", "Pakistan", "Islamabad", "2025-06-01", "2025-07-01", 30,10000.00, true);

-- ALTER TABLE users ADD COLUMN kinde_id VARCHAR(255);
-- UPDATE users SET kinde_id = CONCAT('kinde_', user_id) WHERE user_id > 0;
-- ALTER TABLE users MODIFY COLUMN kinde_id VARCHAR(255) UNIQUE NOT NULL;

-- ALTER TABLE trips DROP COLUMN country;
-- ALTER TABLE trips ADD COLUMN destination VARCHAR(100);

-- DELETE FROM trips WHERE trip_id > 0;

-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE trips;
-- SET FOREIGN_KEY_CHECKS = 1;

insert into users(email, username, kinde_id, profile_picture_url, bio) values
('ashhal@gmail.com', 'ashhal', 'kinde_1', 'https://i.pravatar.cc/150?u=john', 'I love travelling'),
('barkhi123@gmail.com', 'bakri', 'kinde_2', 'https://i.pravatar.cc/150?u=mike', 'lmao xd'),
('ibrahim@gmail.com', 'topiInsan123', 'kinde_3', 'https://i.pravatar.cc/150?u=alex', 'case in point'),
('aleena@gmail.com', 'aleenaFatima999', 'kinde_4', 'https://i.pravatar.cc/150?u=aleena', 'food + travelling = yum'),
('hasanjabbar@gmail.com', 'HJ', 'kinde_5', 'https://i.pravatar.cc/150?u=hasan', 'I love little places'),
('kabeer@gmail.com', 'kabi2number', 'kinde_6', 'https://i.pravatar.cc/150?u=kabeer', 'siuuuuu'),
('hafsa@gmail.com', 'jhafsa0000', 'kinde_7', 'https://i.pravatar.cc/150?u=hafsa', '8x WDC'),
('rafay@gmail.com', 'rafayoooo', 'kinde_8', 'https://i.pravatar.cc/150?u=rafay', 'visca barca'),
('saadkhan111@gmail.com', 'msk100', 'kinde_9', 'https://i.pravatar.cc/150?u=saad', 'kawai'),
('uzair@gmail.com', 'uJawed', 'kinde_10', 'https://i.pravatar.cc/150?u=uzair', 'viva la green arrow'),
('ayeshaghani@gmail.com', 'aGhani', 'kinde_11', 'https://i.pravatar.cc/150?u=ayesha', 'dil dard e disco'),
('hadiya@gmail.com', 'hadiyaaaaa', 'kinde_12', 'https://i.pravatar.cc/150?u=hadiya', 'chai meri jaan'),
('smuhammadali@gmail.com', 'maali', 'kinde_13', 'https://i.pravatar.cc/150?u=ali', 'simply lovely'),
('raahin@gmail.com', 'rTajuddin', 'kinde_14', 'https://i.pravatar.cc/150?u=raahin', 'I am white'),
('ibad@gmail.com', 'ibadoplus', 'kinde_15', 'https://i.pravatar.cc/150?u=ibad', 'no u');

INSERT INTO trips(user_id, title, description, destination, start_date, end_date, total_days, budget_estimate, is_public) VALUES
(1, 'Lahore lahore aye', 'lor lor ay', 'Pakistan', '2025-09-11', '2025-09-20', 9, 2000.00, true),
(2, 'Man Utd UCL Night', 'Man Utd vs PSG match live', 'England', '2023-03-15', '2023-03-22', 7, 4500.00, true),
(2, 'The Ashes day 3', 'Going to watch England bat before departure', 'England', '2023-03-27', '2023-03-30', 3, 800.00, false),
(3, 'Napoli Scudetto celebrations', 'Scott Mctominay. That is it', 'Italy', '2025-05-04', '2025-05-20', 16, 5500.00, false),
(4, 'Spa GP', 'Going to watch Ferrari', 'Belgium', '2019-09-01', '2019-09-06', 5, 2900.00, true),
(5, 'Islamabad Vacation', 'Going to islamabad to visit friends', 'Pakistan', '2025-06-01', '2025-07-01', 30, 10000.00, true);
select * from trips;
