<?php
// backend/config/database.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS' && !defined('ALLOW_OPTIONS')) {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'natureveda';
$username = 'root';
$password = '';

// Force SQLite for development
$dbDir = __DIR__ . '/../database';
if (!is_dir($dbDir)) {
    mkdir($dbDir, 0777, true);
}
$dbPath = $dbDir . '/natureveda.db';
$pdo = new PDO("sqlite:$dbPath");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
define('DB_TYPE', 'sqlite');

// Create tables if they don't exist
$pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS remedies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        problem TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        steps TEXT NOT NULL,
        precautions TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        uses TEXT NOT NULL,
        benefits TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        remedy_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (remedy_id) REFERENCES remedies(id) ON DELETE CASCADE
    )
");

// Insert admin user if not exists
$adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT OR IGNORE INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)");
$stmt->execute(['Admin', 'admin@natureveda.com', $adminPassword, 1]);

// Insert sample remedy if not exists
$stmt = $pdo->prepare("INSERT OR IGNORE INTO remedies (problem, ingredients, steps, precautions, category) VALUES (?, ?, ?, ?, ?)");
$stmt->execute(['Cough & Cold', 'Tulsi leaves, Ginger, Honey, Black pepper', '1. Boil 5-6 tulsi leaves with ginger\n2. Add honey and black pepper\n3. Drink warm twice daily', 'Avoid cold water and ice cream', 'Cough & Cold']);
?>
