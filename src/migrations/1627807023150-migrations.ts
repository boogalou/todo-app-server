import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1726421954654 implements MigrationInterface {
  name = 'Migrations1726421954654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "taskflow_schema"."tasks"
                             (
                                 "id"           SERIAL                   NOT NULL,
                                 "title"        character varying        NOT NULL,
                                 "description"  character varying,
                                 "color"        character varying,
                                 "category"     character varying,
                                 "due_date"     TIMESTAMP                NOT NULL,
                                 "created_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "updated_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "is_completed" boolean                  NOT NULL,
                                 "user_id"      integer,
                                 CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "taskflow_schema"."users"
                             (
                                 "id"         SERIAL                   NOT NULL,
                                 "username"   character varying        NOT NULL,
                                 "email"      character varying        NOT NULL,
                                 "password"   character varying        NOT NULL,
                                 "user_pic"   character varying,
                                 "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                                 CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "taskflow_schema"."tasks"
        ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "taskflow_schema"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taskflow_schema"."tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`,
    );
    await queryRunner.query(`DROP TABLE "taskflow_schema"."users"`);
    await queryRunner.query(`DROP TABLE "taskflow_schema"."tasks"`);
  }
}
