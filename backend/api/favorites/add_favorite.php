<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Please login first"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->remedy_id)) {
    $query = "INSERT IGNORE INTO favorites (user_id, remedy_id) VALUES (:user_id, :remedy_id)";
    $stmt = $pdo->prepare($query);
    
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->bindParam(':remedy_id', $data->remedy_id);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Added to favorites"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to add to favorites"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Remedy ID is required"]);
}
?>
