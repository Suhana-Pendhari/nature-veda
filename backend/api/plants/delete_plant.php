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

if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    http_response_code(403);
    echo json_encode(["message" => "Access denied"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $query = "DELETE FROM plants WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $data->id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Plant deleted successfully"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to delete plant"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ID is required"]);
}
?>
