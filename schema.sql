DROP TABLE IF EXISTS locations;

DROP TABLE IF EXISTS weather;

DROP TABLE IF EXISTS parks;

CREATE TABLE locations(
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    longitude FLOAT,
    latitude FLOAT
);

CREATE TABLE weather(
    id SERIAL PRIMARY KEY,
    forecast TEXT,
    time VARCHAR(255),
    city VARCHAR(255)
);

CREATE TABLE parks(
    id SERIAL PRIMARY KEY,
    park_name VARCHAR(255),
    park_address VARCHAR(255),
    entrance_cost FLOAT,
    park_description TEXT,
    park_url TEXT
);