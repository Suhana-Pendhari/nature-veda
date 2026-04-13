<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once '../../config/database.php';

$query = "SELECT * FROM plants ORDER BY name ASC";
$stmt = $pdo->prepare($query);
$stmt->execute();

$plants = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($plants);
?>
