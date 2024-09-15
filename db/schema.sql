-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."roll_session" (
    "id" uuid NOT NULL,
    "token_id" uuid NOT NULL,
    "requested_at" timestamp NOT NULL,
    "rolled_at" timestamp,
    "completed_at" timestamp,
    "user_id" numeric,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."token" (
    "id" uuid NOT NULL,
    "token" uuid NOT NULL,
    "token_id" text NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "expired_at" timestamp,
    "is_active" bool NOT NULL,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."user" (
    "id" uuid NOT NULL,
    "display_name" text NOT NULL,
    "email" text NOT NULL,
    "password" text NOT NULL,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."user_session" (
    "id" uuid NOT NULL,
    "session_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "expired_at" timestamp NOT NULL,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."token" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user"("id");
