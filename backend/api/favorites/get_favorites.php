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

$query = "SELECT r.* FROM remedies r 
          INNER JOIN favorites f ON r.id = f.remedy_id 
          WHERE f.user_id = :user_id
          ORDER BY f.created_at DESC";
          
$stmt = $pdo->prepare($query);
$stmt->bindParam(':user_id', $_SESSION['user_id']);
$stmt->execute();

$favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($favorites);
?>
