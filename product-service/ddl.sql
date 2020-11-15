create extension if not exists "uuid-ossp";

create table products (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title text NOT NULL,
	description text,
	price integer,
  image text
)

create table stocks (
	product_id uuid NOT NULL UNIQUE,
	count integer,
	foreign key ("product_id") references "products" ("id")
)