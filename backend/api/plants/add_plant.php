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

if (!empty($data->name) && !empty($data->uses) && !empty($data->benefits)) {
    $query = "INSERT INTO plants (name, uses, benefits, category, image_url) 
              VALUES (:name, :uses, :benefits, :category, :image_url)";
    
    $stmt = $pdo->prepare($query);
    
    $name = htmlspecialchars(strip_tags($data->name));
    $uses = htmlspecialchars(strip_tags($data->uses));
    $benefits = htmlspecialchars(strip_tags($data->benefits));
    $category = htmlspecialchars(strip_tags($data->category ?? 'General'));
    $image_url = htmlspecialchars(strip_tags($data->image_url ?? ''));
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':uses', $uses);
    $stmt->bindParam(':benefits', $benefits);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':image_url', $image_url);
    
    try {
        if ($stmt->execute()) {
            $id = (int)$pdo->lastInsertId();
            $out = ["message" => "Plant added successfully", "id" => $id];

            if ($id > 0) {
                $v = $pdo->prepare("SELECT * FROM plants WHERE id = :id LIMIT 1");
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
            echo json_encode(["message" => "Unable to add plant"]);
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
