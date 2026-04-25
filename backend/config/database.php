<?php
// backend/config/database.php
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS' && !defined('ALLOW_OPTIONS')) {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'natureveda';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    define('DB_TYPE', 'mysql');
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Always ensure schema exists (safe), but do NOT insert any default/sample data.
// This keeps the app working while guaranteeing "only admin-created data is shown".
$pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS remedies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        problem VARCHAR(200) NOT NULL,
        ingredients TEXT NOT NULL,
        steps TEXT NOT NULL,
        precautions TEXT,
        category VARCHAR(50),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
");

// If tables already existed from earlier versions, ensure new columns exist.
// We intentionally ignore "duplicate column" errors so this is safe to run.
try { $pdo->exec("ALTER TABLE remedies ADD COLUMN precautions TEXT NULL"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE remedies ADD COLUMN category VARCHAR(50) NULL"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE remedies ADD COLUMN image_url VARCHAR(500) NULL"); } catch (PDOException $e) {}

$pdo->exec("
    CREATE TABLE IF NOT EXISTS plants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        uses TEXT NOT NULL,
        benefits TEXT NOT NULL,
        category VARCHAR(80),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
");

try { $pdo->exec("ALTER TABLE plants ADD COLUMN image_url VARCHAR(500) NULL"); } catch (PDOException $e) {}
try { $pdo->exec("ALTER TABLE plants ADD COLUMN category VARCHAR(80) NULL"); } catch (PDOException $e) {}

$pdo->exec("
    CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        remedy_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_favorite (user_id, remedy_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (remedy_id) REFERENCES remedies(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
");
?>
