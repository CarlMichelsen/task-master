CREATE TABLE "task_master"."taskboards"
(
   "id" UUID PRIMARY KEY,
   "organisation_id" UUID NULL,
   "uri" VARCHAR (30) UNIQUE NOT NULL,
   "background_image" VARCHAR (2048) NULL,
   "taskboard_name" VARCHAR (30) NOT NULL,
   "owner_id" UUID NOT NULL,
   FOREIGN KEY ("owner_id") REFERENCES "task_master"."users" ("id")
)