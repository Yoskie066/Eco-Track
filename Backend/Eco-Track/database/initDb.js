import pool from '../config/db.js';

const initDb = async () => {
  const client = await pool.connect();
  try {
    // Users-Login table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Users-Login" (
        id BIGINT PRIMARY KEY DEFAULT FLOOR(1000000000 + RANDOM() * 9000000000),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Admins-Login table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Admins-Login" (
        id BIGINT PRIMARY KEY DEFAULT FLOOR(1000000000 + RANDOM() * 9000000000),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // refresh_tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        token VARCHAR(255) PRIMARY KEY,
        user_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // collect_waste table
    await client.query(`
      CREATE TABLE IF NOT EXISTS collect_waste (
        id SERIAL PRIMARY KEY,
        userEmail TEXT NOT NULL,
        wasteName TEXT NOT NULL,
        category TEXT NOT NULL,
        subCategory TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        dateCollected DATE NOT NULL,
        description TEXT NOT NULL,
        photoUrl TEXT NOT NULL
      );
    `);

    // collect_waste_timeline table
    await client.query(`
      CREATE TABLE IF NOT EXISTS collect_waste_timeline (
        id SERIAL PRIMARY KEY,
        useremail TEXT NOT NULL,
        wastename TEXT NOT NULL,
        datecollected DATE NOT NULL,
        yearcollected INT NOT NULL,
        description TEXT NOT NULL,
        photourl TEXT NOT NULL,
        UNIQUE (useremail, wastename, datecollected)
      );
    `);

    // Trigger function for collect_waste
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_collect_waste_to_timeline()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO collect_waste_timeline
          (useremail, wastename, datecollected, yearcollected, description, photourl)
        VALUES
          (NEW.useremail, NEW.wastename, NEW.datecollected, EXTRACT(YEAR FROM NEW.dateCollected)::INT, NEW.description, NEW.photourl)
        ON CONFLICT DO NOTHING;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Attach trigger to collect_waste
    await client.query(`DROP TRIGGER IF EXISTS after_collect_waste_insert ON collect_waste;`);
    await client.query(`
      CREATE TRIGGER after_collect_waste_insert
      AFTER INSERT ON collect_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_collect_waste_to_timeline();
    `);

    // report_waste table
    await client.query(`
      CREATE TABLE IF NOT EXISTS report_waste (
      id SERIAL PRIMARY KEY,
      userEmail TEXT NOT NULL,
      wasteName TEXT NOT NULL,
      category TEXT NOT NULL,
      subCategory TEXT NOT NULL,
      color TEXT NOT NULL,
      location TEXT NOT NULL,
      dateReported DATE NOT NULL,
      description TEXT NOT NULL,
      photoUrl TEXT NOT NULL
    );
 `);
  
    // report_waste_timeline table
   await client.query(`
    CREATE TABLE IF NOT EXISTS report_waste_timeline (
    id SERIAL PRIMARY KEY,
    useremail TEXT NOT NULL,
    wastename TEXT NOT NULL,
    datereported DATE NOT NULL,
    location TEXT NOT NULL,
    year_reported INT NOT NULL,
    description TEXT NOT NULL,
    photourl TEXT NOT NULL,
    UNIQUE (useremail, wastename, datereported)
    );
  `);
   
    //dashboard_reported_waste table
   await pool.query(`
    CREATE TABLE IF NOT EXISTS dashboard_reported_waste (
    id SERIAL PRIMARY KEY,
    useremail TEXT NOT NULL,
    wastename TEXT NOT NULL,
    year_reported INT NOT NULL,
    total_count INT NOT NULL DEFAULT 0,
    UNIQUE (useremail, wastename, year_reported)
    )
  `);

  // after you created the report_waste_timeline table
  await client.query(`
    CREATE OR REPLACE FUNCTION sync_to_timeline()
    RETURNS TRIGGER AS $$
    BEGIN
    -- Insert into report timeline
    INSERT INTO report_waste_timeline
      (useremail, wastename, datereported, year_reported, location, description, photourl)
    VALUES
      (NEW.useremail, NEW.wastename, NEW.datereported, EXTRACT(YEAR FROM NEW.datereported)::INT, NEW.location, NEW.description, NEW.photourl)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`);

  await client.query(`
    DROP TRIGGER IF EXISTS after_report_waste_insert ON report_waste;
  `);

  await client.query(`
    CREATE TRIGGER after_report_waste_insert
    AFTER INSERT ON report_waste
    FOR EACH ROW
    EXECUTE FUNCTION sync_to_timeline();
  `);
  
  console.log("All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.release();
  }
};

export default initDb;