import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1784329023167 implements MigrationInterface {
  name = 'Migration1784329023167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` char(36) NOT NULL, \`name\` varchar(150) NOT NULL, \`email\` varchar(200) NOT NULL, \`phone\` varchar(20) NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`accepted_terms\` tinyint NOT NULL DEFAULT 0, \`accepted_terms_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`charts\` (\`id\` char(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`birth_day\` int NOT NULL, \`birth_month\` int NOT NULL, \`birth_year\` int NOT NULL, \`birth_hour\` int NOT NULL, \`birth_min\` int NOT NULL, \`lat\` float NOT NULL, \`lon\` float NOT NULL, \`timezone\` varchar(50) NOT NULL, \`city\` varchar(100) NOT NULL, \`state\` varchar(100) NULL, \`country\` varchar(100) NULL, \`chart_data\` json NOT NULL, \`user_id\` char(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`charts\` ADD CONSTRAINT \`FK_d748da046f4ff64169ac590a033\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`charts\` DROP FOREIGN KEY \`FK_d748da046f4ff64169ac590a033\``,
    );
    await queryRunner.query(`DROP TABLE \`charts\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
