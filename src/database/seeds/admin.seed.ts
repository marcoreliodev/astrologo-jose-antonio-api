import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import { uuidv7 } from 'uuidv7';
import { User } from '../../users/user.entity';
import { Role } from '../../common/enums/role.enum';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'nestuser',
  password: process.env.DB_PASS || 'nestpass',
  database: process.env.DB_NAME || 'nestdb',
  entities: [User],
});

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const name = process.env.ADMIN_NAME;
  const pass = process.env.ADMIN_PASSWORD;

  if (!email || !pass || !name) {
    console.error(
      '❌ ADMIN_EMAIL, ADMIN_NAME e ADMIN_PASSWORD precisam estar no .env',
    );
    process.exit(1);
  }

  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOne({ where: { email } });

  if (existing) {
    console.log('⚠️  Admin já existe, pulando seed.');
    await AppDataSource.destroy();
    return;
  }

  const password = await argon2.hash(pass, { type: argon2.argon2id });

  const admin = userRepo.create({
    id: uuidv7(),
    name,
    email,
    password,
    role: Role.ADMIN,
    acceptedTerms: true,
    acceptedTermsAt: new Date(),
  });

  await userRepo.save(admin);
  console.log(`✅ Admin criado com sucesso! (${email})`);
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Erro na seed:', err);
  process.exit(1);
});
