import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchemaSchema1627807023000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS taskflow_schema;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS taskflow_schema CASCADE;`);
  }
}
