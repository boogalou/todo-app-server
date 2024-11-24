import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1728026660060 implements MigrationInterface {
  name = 'Migrations1728026660060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "taskflow_schema"."settings"
                             (
                                 "id"         SERIAL                   NOT NULL,
                                 "language"   character varying        NOT NULL,
                                 "theme"      character varying        NOT NULL,
                                 "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "user_id"    integer,
                                 CONSTRAINT "REL_a2883eaa72b3b2e8c98e744609" UNIQUE ("user_id"),
                                 CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id") 
                             )`);
    await queryRunner.query(`ALTER TABLE "taskflow_schema"."settings"
        ADD CONSTRAINT "FK_a2883eaa72b3b2e8c98e7446098" FOREIGN KEY ("user_id") REFERENCES "taskflow_schema"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "taskflow_schema"."settings"
        DROP CONSTRAINT "FK_a2883eaa72b3b2e8c98e7446098"`);
    await queryRunner.query(`DROP TABLE "taskflow_schema"."settings"`);
  }
}
