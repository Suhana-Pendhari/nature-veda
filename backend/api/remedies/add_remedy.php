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

// Check if user is admin
if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    http_response_code(403);
    echo json_encode(["message" => "Access denied"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->problem) && !empty($data->ingredients) && !empty($data->steps)) {
    $query = "INSERT INTO remedies (problem, ingredients, steps, precautions, category, image_url) 
              VALUES (:problem, :ingredients, :steps, :precautions, :category, :image_url)";
    
    $stmt = $pdo->prepare($query);
    
    $problem = htmlspecialchars(strip_tags($data->problem));
    $ingredients = htmlspecialchars(strip_tags($data->ingredients));
    $steps = htmlspecialchars(strip_tags($data->steps));
    $precautions = htmlspecialchars(strip_tags($data->precautions ?? ''));
    $category = htmlspecialchars(strip_tags($data->category ?? 'General'));
    $image_url = htmlspecialchars(strip_tags($data->image_url ?? ''));
    
    $stmt->bindParam(':problem', $problem);
    $stmt->bindParam(':ingredients', $ingredients);
    $stmt->bindParam(':steps', $steps);
    $stmt->bindParam(':precautions', $precautions);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':image_url', $image_url);
    
    try {
        if ($stmt->execute()) {
            $id = (int)$pdo->lastInsertId();
            $out = ["message" => "Remedy added successfully", "id" => $id];

            // Verify it actually exists in DB (helps debug “success but not stored”).
            if ($id > 0) {
                $v = $pdo->prepare("SELECT * FROM remedies WHERE id = :id LIMIT 1");
                $v->execute([':id' => $id]);
                $created = $v->fetch(PDO::FETCH_ASSOC);
                if ($created) {
                    $out["created"] = $created;
                }
            }

            http_response_code(201);
            echo json_encode($out);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Unable to add remedy"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error", "error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
