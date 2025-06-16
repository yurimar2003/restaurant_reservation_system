import bcrypt from 'bcrypt';
import postgres, { TransactionSql } from 'postgres'; // Importa TransactionSql
import { users , dining_tables , reservations } from '../lib/placeholder-data';

console.log('Connecting to database at:', process.env.DATABASE_URL);
const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });


async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'customer'
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (name, email, password, role)
        VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.role})
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
      `;
    }),
  );

  return insertedUsers;
}

async function seedDining_tables () {
  await sql`
    CREATE TABLE IF NOT EXISTS dining_tables (
      id SERIAL PRIMARY KEY,
      number INTEGER UNIQUE NOT NULL,
      capacity INTEGER NOT NULL,
      available BOOLEAN DEFAULT TRUE
    );
  `;

  const insertedDining_tables = await Promise.all(
    dining_tables .map(
      (dining_table) => sql`
        INSERT INTO dining_tables (number, capacity)
        VALUES (${dining_table.number}, ${dining_table.capacity})
        ON CONFLICT (number) DO NOTHING
        RETURNING id;
      `,
    ),
  );

  return insertedDining_tables;
}

async function seedReservations() {
  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      table_id INTEGER REFERENCES dining_tables(id),
      date DATE NOT NULL,
      time TIME NOT NULL,
      people INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending'
    );
  `;

  const insertedReservations = await Promise.all(
    reservations.map(
      (reservation) => sql`
        INSERT INTO reservations (user_id, table_id, date, time, people, status)
        VALUES (${reservation.user_id}, ${reservation.table_id}, ${reservation.date}, ${reservation.time}, ${reservation.people}, ${reservation.status})
      `,
    ),
  );

  return insertedReservations;
}

async function main() {
  try {
    await sql.begin(async (sql: TransactionSql) => [
      await seedUsers(),
      await seedDining_tables(),
      await seedReservations(),
    ]);
    
    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }/* finally {
    sql.end(); // Cierra la conexión
  } */
}

main();

