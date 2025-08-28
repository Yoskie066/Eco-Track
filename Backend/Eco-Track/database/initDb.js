import pool from '../config/db.js';

const initDb = async () => {
  const client = await pool.connect();
  try {
    // ====================== USERS LOGIN ======================
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

    // ====================== ADMINS LOGIN ======================
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

    // ====================== REFRESH TOKENS ======================
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        token VARCHAR(255) PRIMARY KEY,
        user_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ====================== COLLECT WASTE ======================
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS collect_waste_timeline (
        id SERIAL PRIMARY KEY,
        waste_id INT UNIQUE REFERENCES collect_waste(id) ON DELETE CASCADE,
        useremail TEXT NOT NULL,
        wastename TEXT NOT NULL,
        datecollected DATE NOT NULL,
        yearcollected INT NOT NULL,
        description TEXT NOT NULL,
        photourl TEXT NOT NULL,
        UNIQUE (useremail, wastename, datecollected)
      );
    `);

    // Insert
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_collect_insert()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO collect_waste_timeline
          (waste_id, useremail, wastename, datecollected, yearcollected, description, photourl)
        VALUES
          (NEW.id, NEW.useremail, NEW.wastename, NEW.datecollected, EXTRACT(YEAR FROM NEW.datecollected)::INT, NEW.description, NEW.photourl)
        ON CONFLICT (waste_id) DO NOTHING;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`DROP TRIGGER IF EXISTS after_collect_insert ON collect_waste;`);
    await client.query(`
      CREATE TRIGGER after_collect_insert
      AFTER INSERT ON collect_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_collect_insert();
    `);

    // Update
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_collect_update()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE collect_waste_timeline
        SET useremail    = NEW.useremail,
            wastename    = NEW.wastename,
            datecollected = NEW.datecollected,
            yearcollected = EXTRACT(YEAR FROM NEW.datecollected)::INT,
            description   = NEW.description,
            photourl      = NEW.photourl
        WHERE waste_id = NEW.id;
      
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`DROP TRIGGER IF EXISTS after_collect_update ON collect_waste;`);
    await client.query(`
      CREATE TRIGGER after_collect_update
      AFTER UPDATE ON collect_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_collect_update();
    `);

    // Delete
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_collect_delete()
      RETURNS TRIGGER AS $$
      BEGIN
        DELETE FROM collect_waste_timeline
        WHERE waste_id = OLD.id;

        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`DROP TRIGGER IF EXISTS after_collect_delete ON collect_waste;`);
    await client.query(`
      CREATE TRIGGER after_collect_delete
      AFTER DELETE ON collect_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_collect_delete();
    `);

    // ====================== REPORT WASTE ======================
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS report_waste_timeline (
        id SERIAL PRIMARY KEY,
        report_id INT UNIQUE REFERENCES report_waste(id) ON DELETE CASCADE,
        useremail TEXT NOT NULL,
        wastename TEXT NOT NULL,
        datereported DATE NOT NULL,
        year_reported INT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        photourl TEXT NOT NULL,
        UNIQUE (useremail, wastename, datereported)
      );
    `);

    // Trigger for report_waste insert
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_report_insert()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO report_waste_timeline
            (report_id, useremail, wastename, datereported, year_reported, location, description, photourl)
          VALUES
            (NEW.id, NEW.useremail, NEW.wastename, NEW.datereported, EXTRACT(YEAR FROM NEW.datereported)::INT, NEW.location, NEW.description, NEW.photourl)
          ON CONFLICT (report_id) DO NOTHING;
        
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

    await client.query(`DROP TRIGGER IF EXISTS after_report_insert ON report_waste;`);
    await client.query(`
      CREATE TRIGGER after_report_insert
      AFTER INSERT ON report_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_report_insert();
    `);

    // Trigger for report_waste update
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_report_update()
      RETURNS TRIGGER AS $$
      BEGIN
          UPDATE report_waste_timeline
          SET useremail    = NEW.useremail,
              wastename    = NEW.wastename,
              datereported = NEW.datereported,
              year_reported= EXTRACT(YEAR FROM NEW.datereported)::INT,
              location     = NEW.location,
              description  = NEW.description,
              photourl     = NEW.photourl
          WHERE report_id = OLD.id;
      
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`DROP TRIGGER IF EXISTS after_report_update ON report_waste;`);
    await client.query(`
      CREATE TRIGGER after_report_update
      AFTER UPDATE ON report_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_report_update();
    `);

    // Trigger for report_waste delete
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_report_delete()
        RETURNS TRIGGER AS $$
        BEGIN
            DELETE FROM report_waste_timeline
            WHERE report_id = OLD.id;
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await client.query(`DROP TRIGGER IF EXISTS after_report_delete ON report_waste;`);
    await client.query(`
      CREATE TRIGGER after_report_delete
      AFTER DELETE ON report_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_report_delete();
    `);

    // ====================== DASHBOARD SUMMARY WASTE ======================
    await client.query(`
      CREATE TABLE IF NOT EXISTS dashboard_summary (
        id SERIAL PRIMARY KEY,
        useremail TEXT NOT NULL,
        year INT NOT NULL,
        month INT NOT NULL,
        collected_count INT DEFAULT 0,
        reported_count INT DEFAULT 0,
        UNIQUE (useremail, year, month)
      );
    `);

    // ====================== USER MANAGEMENT ======================
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_management (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin')),
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NULL
      );
   `);

    // ====================== COLLECTED WASTE ======================
    await client.query(`
      CREATE TABLE IF NOT EXISTS collected_waste (
        id SERIAL PRIMARY KEY,
        waste_id INT UNIQUE REFERENCES collect_waste(id) ON DELETE CASCADE,
        useremail TEXT NOT NULL,
        wastename TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        datecollected DATE NOT NULL,
        description TEXT NOT NULL,
        photourl TEXT NOT NULL
      );
    `);
    
    // ====================== INSERT TRIGGER ======================
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_to_collected_insert()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO collected_waste (
          waste_id, useremail, wastename, category, subcategory, quantity, unit, datecollected, description, photourl
        )
        VALUES (
          NEW.id, NEW.useremail, NEW.wastename, NEW.category, NEW.subcategory, NEW.quantity, NEW.unit,
          NEW.datecollected, NEW.description, NEW.photourl
        )
        ON CONFLICT (waste_id) DO NOTHING;
    
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query(`DROP TRIGGER IF EXISTS after_collect_to_collected_insert ON collect_waste;`);
    await client.query(`
      CREATE TRIGGER after_collect_to_collected_insert
      AFTER INSERT ON collect_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_to_collected_insert();
    `);
    
    // ====================== UPDATE TRIGGER ======================
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_to_collected_update()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE collected_waste
        SET useremail     = NEW.useremail,
            wastename     = NEW.wastename,
            category      = NEW.category,
            subcategory   = NEW.subcategory,
            quantity      = NEW.quantity,
            unit          = NEW.unit,
            datecollected = NEW.datecollected,
            description   = NEW.description,
            photourl      = NEW.photourl
        WHERE waste_id = NEW.id;
    
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query(`DROP TRIGGER IF EXISTS after_collect_to_collected_update ON collect_waste;`);
    await client.query(`
      CREATE TRIGGER after_collect_to_collected_update
      AFTER UPDATE ON collect_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_to_collected_update();
    `);

    // ====================== DELETE TRIGGER ======================
    await client.query(`
      CREATE OR REPLACE FUNCTION sync_to_collected_delete()
      RETURNS TRIGGER AS $$
      BEGIN
        DELETE FROM collected_waste
        WHERE waste_id = OLD.id;
    
        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query(`DROP TRIGGER IF EXISTS after_collect_to_collected_delete ON collect_waste;`);
    await client.query(`
      CREATE TRIGGER after_collect_to_collected_delete
      AFTER DELETE ON collect_waste
      FOR EACH ROW
      EXECUTE FUNCTION sync_to_collected_delete();
    `);


    // ====================== REPORTED WASTE ======================
    await client.query(`
      CREATE TABLE IF NOT EXISTS reported_waste (
        id SERIAL PRIMARY KEY,
        report_id INT UNIQUE REFERENCES report_waste(id) ON DELETE CASCADE,
        useremail TEXT NOT NULL,
        wastename TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT NOT NULL,
        color TEXT NOT NULL,
        location TEXT NOT NULL,
        datereported DATE NOT NULL,
        description TEXT NOT NULL,
        photourl TEXT NOT NULL
      );
    `);

  // ====================== TRIGGER FUNCTION ======================
  await client.query(`
    CREATE OR REPLACE FUNCTION sync_to_reported_insert()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO reported_waste (
        report_id, useremail, wastename, category, subcategory, color, location, datereported, description, photourl
      )
      VALUES (
        NEW.id, NEW.useremail, NEW.wastename, NEW.category, NEW.subcategory, NEW.color, NEW.location, NEW.datereported, NEW.description, NEW.photourl
      )
      ON CONFLICT (report_id) DO NOTHING;
  
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
  
  await client.query(`DROP TRIGGER IF EXISTS after_report_to_reported_insert ON report_waste;`);
  await client.query(`
    CREATE TRIGGER after_report_to_reported_insert
    AFTER INSERT ON report_waste
    FOR EACH ROW
    EXECUTE FUNCTION sync_to_reported_insert();
  `);

    console.log("All tables and triggers created successfully");

  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.release();
  }
};

export default initDb;
