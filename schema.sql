DROP TABLE IF EXISTS locations;

DROP TABLE IF EXISTS weather;

DROP TABLE IF EXISTS parks;

CREATE TABLE locations(
    id SERIAL PRIMARY KEY,
    location_name VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT
);

CREATE TABLE weather(
    id SERIAL PRIMARY KEY,
    forecast TEXT,
    city VARCHAR(255),
    date_time VARCHAR(255)
);

CREATE TABLE parks(
    id SERIAL PRIMARY KEY,
    park_name VARCHAR(255),
    park_address VARCHAR(255),
    entrance_cost FLOAT,
    park_description TEXT,
    park_url TEXT
);