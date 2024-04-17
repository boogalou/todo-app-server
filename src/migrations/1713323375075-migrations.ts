import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1713323375075 implements MigrationInterface {
  name = 'Migrations1713323375075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`);
    await queryRunner.query(`ALTER TABLE "tasks"
        ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "tasks"
        ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`);
    await queryRunner.query(`ALTER TABLE "tasks"
        ALTER COLUMN "user_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "tasks"
        ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
