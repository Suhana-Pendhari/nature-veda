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

// Check if user is admin
if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    http_response_code(403);
    echo json_encode(["message" => "Access denied"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->problem) && !empty($data->ingredients) && !empty($data->steps)) {
    $query = "INSERT INTO remedies (problem, ingredients, steps, precautions, category) 
              VALUES (:problem, :ingredients, :steps, :precautions, :category)";
    
    $stmt = $pdo->prepare($query);
    
    $problem = htmlspecialchars(strip_tags($data->problem));
    $ingredients = htmlspecialchars(strip_tags($data->ingredients));
    $steps = htmlspecialchars(strip_tags($data->steps));
    $precautions = htmlspecialchars(strip_tags($data->precautions ?? ''));
    $category = htmlspecialchars(strip_tags($data->category ?? 'General'));
    
    $stmt->bindParam(':problem', $problem);
    $stmt->bindParam(':ingredients', $ingredients);
    $stmt->bindParam(':steps', $steps);
    $stmt->bindParam(':precautions', $precautions);
    $stmt->bindParam(':category', $category);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            "message" => "Remedy added successfully",
            "id" => $pdo->lastInsertId()
        ]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Unable to add remedy"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
