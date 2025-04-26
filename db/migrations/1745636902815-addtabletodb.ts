import { MigrationInterface, QueryRunner } from "typeorm";

export class Addtabletodb1745636902815 implements MigrationInterface {
    name = 'Addtabletodb1745636902815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`purchase_order_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`price\` int NOT NULL, \`purchase_order_id\` int NULL, \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`purchase_orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`supplier_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`suppliers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`status\` int NOT NULL DEFAULT '1', \`address\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_update\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`food_items\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`food_items\` ADD \`created_update\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`food_items\` ADD \`status\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`food_items\` ADD \`stock\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`status\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`created_update\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` ADD CONSTRAINT \`FK_08f0d16ed60b199a4973097255d\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` ADD CONSTRAINT \`FK_d3b4369887dd815c0b52023ddca\` FOREIGN KEY (\`product_id\`) REFERENCES \`food_items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_orders\` ADD CONSTRAINT \`FK_d16a885aa88447ccfd010e739b0\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchase_orders\` DROP FOREIGN KEY \`FK_d16a885aa88447ccfd010e739b0\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` DROP FOREIGN KEY \`FK_d3b4369887dd815c0b52023ddca\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` DROP FOREIGN KEY \`FK_08f0d16ed60b199a4973097255d\``);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`created_update\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`food_items\` DROP COLUMN \`stock\``);
        await queryRunner.query(`ALTER TABLE \`food_items\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`food_items\` DROP COLUMN \`created_update\``);
        await queryRunner.query(`ALTER TABLE \`food_items\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`DROP TABLE \`suppliers\``);
        await queryRunner.query(`DROP TABLE \`purchase_orders\``);
        await queryRunner.query(`DROP TABLE \`purchase_order_details\``);
    }

}
