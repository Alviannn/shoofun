import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeUser1646809838893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('users', 'display', 'displayName');
        await queryRunner.renameColumn('users', 'phone', 'phoneNumber');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('users', 'displayName', 'display');
        await queryRunner.renameColumn('users', 'phoneNumber', 'phone');
    }

}
