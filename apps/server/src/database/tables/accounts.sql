CREATE TABLE "task_master"."accounts"
(
    "id" UUID PRIMARY KEY,
    "fullname" VARCHAR (256) NOT NULL, /* encrypted */
    "email" VARCHAR (256) NOT NULL, /* encrypted */
    "password" VARCHAR (254) NOT NULL, /* obviously hashed */
    "verified_email" BOOLEAN NOT NULL
)