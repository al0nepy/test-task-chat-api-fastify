CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" varchar,
	"type" text NOT NULL,
	"content" text,
	"file_mime_type" text,
	"file_name" text,
	"file_path" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"login" varchar(50) NOT NULL,
	"password" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_login_unique" UNIQUE("login")
);
