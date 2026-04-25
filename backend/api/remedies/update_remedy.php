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

if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    http_response_code(403);
    echo json_encode(["message" => "Access denied"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $query = "UPDATE remedies SET 
              problem = :problem,
              ingredients = :ingredients,
              steps = :steps,
              precautions = :precautions,
              category = :category,
              image_url = :image_url
              WHERE id = :id";
    
    $stmt = $pdo->prepare($query);
    
    $id = $data->id;
    $problem = htmlspecialchars(strip_tags($data->problem));
    $ingredients = htmlspecialchars(strip_tags($data->ingredients));
    $steps = htmlspecialchars(strip_tags($data->steps));
    $precautions = htmlspecialchars(strip_tags($data->precautions ?? ''));
    $category = htmlspecialchars(strip_tags($data->category ?? 'General'));
    $image_url = htmlspecialchars(strip_tags($data->image_url ?? ''));
    
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':problem', $problem);
    $stmt->bindParam(':ingredients', $ingredients);
    $stmt->bindParam(':steps', $steps);
    $stmt->bindParam(':precautions', $precautions);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':image_url', $image_url);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Remedy updated successfully"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to update remedy"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ID is required"]);
}
?>
