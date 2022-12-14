CREATE TABLE "task_master"."user_taskboards" /* map table */
(
   "user_id" UUID NOT NULL,
   "taskboard_id" UUID NOT NULL,
   PRIMARY KEY ("user_id", "taskboard_id"),
   FOREIGN KEY ("user_id") REFERENCES "task_master"."users" ("id"),
   FOREIGN KEY ("taskboard_id") REFERENCES "task_master"."taskboards" ("id")
)