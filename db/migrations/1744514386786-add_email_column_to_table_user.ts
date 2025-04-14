import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailColumnToTableUser1744514386786 implements MigrationInterface {
    name = 'AddEmailColumnToTableUser1744514386786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
