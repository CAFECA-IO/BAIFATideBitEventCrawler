import { Sequelize } from 'sequelize';
import 'dotenv/config';

async function bootstrap() {
  console.log(process.env.SOURCE_DATABASE_URL);
  console.log(process.env.WAREHOUSE_DATABASE_URL);

  //const sourceDB = new Sequelize(process.env.SOURCE_DATABASE_URL);
  const warehouseDB = new Sequelize(process.env.WAREHOUSE_DATABASE_URL);

  //const [results, metadata] = await sourceDB.query("SELECT * FROM account_versions WHERE id >= 1 AND id <= 10;");
  console.log(warehouseDB);
}
bootstrap();
