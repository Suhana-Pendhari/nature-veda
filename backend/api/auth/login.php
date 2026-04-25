<?php
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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';
session_start();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $email = trim((string)$data->email);
    $password = (string)$data->password;

    // Use a prepared statement (works for MySQL and SQLite).
    $stmt = $pdo->prepare("SELECT id, name, email, password, is_admin FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);

    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $stored = (string)$row['password'];

        $ok = password_verify($password, $stored);

        // If the admin/user was inserted manually with a plain-text password, allow it once
        // and immediately upgrade it to a secure hash.
        if (!$ok && hash_equals($stored, $password)) {
            $ok = true;

            $newHash = password_hash($password, PASSWORD_DEFAULT);
            $u = $pdo->prepare("UPDATE users SET password = :password WHERE id = :id");
            $u->execute([
                ':password' => $newHash,
                ':id' => $row['id']
            ]);
        }

        if ($ok) {
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['user_name'] = $row['name'];
            $_SESSION['is_admin'] = $row['is_admin'];
            
            http_response_code(200);
            echo json_encode([
                "message" => "Login successful",
                "user" => [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "is_admin" => (bool)(int)$row['is_admin']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid credentials"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "User not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Email and password required"]);
}
?>
