<- psql -f book_people_seed.sql -d book_people->

INSERT INTO book_people(name, fav_book, class) VALUES ('ted', 'The Foundline', 301);