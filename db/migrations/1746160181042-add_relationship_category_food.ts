import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipCategoryFood1746160181042 implements MigrationInterface {
    name = 'AddRelationshipCategoryFood1746160181042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`food_items\` ADD \`category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` DROP FOREIGN KEY \`FK_08f0d16ed60b199a4973097255d\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` DROP FOREIGN KEY \`FK_d3b4369887dd815c0b52023ddca\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` CHANGE \`purchase_order_id\` \`purchase_order_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` CHANGE \`product_id\` \`product_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`purchase_orders\` DROP FOREIGN KEY \`FK_d16a885aa88447ccfd010e739b0\``);
        await queryRunner.query(`ALTER TABLE \`purchase_orders\` CHANGE \`supplier_id\` \`supplier_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`food_items\` ADD CONSTRAINT \`FK_bf31353b77c5507183f82b7a28a\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` ADD CONSTRAINT \`FK_08f0d16ed60b199a4973097255d\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` ADD CONSTRAINT \`FK_d3b4369887dd815c0b52023ddca\` FOREIGN KEY (\`product_id\`) REFERENCES \`food_items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_orders\` ADD CONSTRAINT \`FK_d16a885aa88447ccfd010e739b0\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchase_orders\` DROP FOREIGN KEY \`FK_d16a885aa88447ccfd010e739b0\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` DROP FOREIGN KEY \`FK_d3b4369887dd815c0b52023ddca\``);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` DROP FOREIGN KEY \`FK_08f0d16ed60b199a4973097255d\``);
        await queryRunner.query(`ALTER TABLE \`food_items\` DROP FOREIGN KEY \`FK_bf31353b77c5507183f82b7a28a\``);
        await queryRunner.query(`ALTER TABLE \`purchase_orders\` CHANGE \`supplier_id\` \`supplier_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`purchase_orders\` ADD CONSTRAINT \`FK_d16a885aa88447ccfd010e739b0\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` CHANGE \`product_id\` \`product_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` CHANGE \`purchase_order_id\` \`purchase_order_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` ADD CONSTRAINT \`FK_d3b4369887dd815c0b52023ddca\` FOREIGN KEY (\`product_id\`) REFERENCES \`food_items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchase_order_details\` ADD CONSTRAINT \`FK_08f0d16ed60b199a4973097255d\` FOREIGN KEY (\`purchase_order_id\`) REFERENCES \`purchase_orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`food_items\` DROP COLUMN \`category_id\``);
    }

}
