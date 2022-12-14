CREATE TABLE "task_master"."users"
(
   "id" UUID PRIMARY KEY,
   "account_id" UUID UNIQUE NOT NULL,
   "username" VARCHAR (30) UNIQUE NOT NULL,
   "online" BOOLEAN NOT NULL,
   FOREIGN KEY ("account_id") REFERENCES "task_master"."accounts" ("id")
)