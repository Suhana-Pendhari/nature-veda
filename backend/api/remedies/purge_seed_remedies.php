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
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// This deletes the originally-seeded sample remedy that was accidentally duplicated.
$seedProblem = 'Cough & Cold';
$seedIngredients = 'Tulsi leaves, Ginger, Honey, Black pepper';
$seedSteps = "1. Boil 5-6 tulsi leaves with ginger\n2. Add honey and black pepper\n3. Drink warm twice daily";
$seedPrecautions = 'Avoid cold water and ice cream';
$seedCategory = 'Cough & Cold';

$stmt = $pdo->prepare(
    "DELETE FROM remedies
     WHERE problem = :problem
       AND ingredients = :ingredients
       AND steps = :steps
       AND precautions = :precautions
       AND category = :category"
);

$stmt->execute([
    ':problem' => $seedProblem,
    ':ingredients' => $seedIngredients,
    ':steps' => $seedSteps,
    ':precautions' => $seedPrecautions,
    ':category' => $seedCategory,
]);

echo json_encode([
    "message" => "Seed remedies purged",
    "deleted" => $stmt->rowCount()
]);
?>

