<?php
header('Content-Type: application/json');

// Honeypot check
if (!empty($_POST['website'] ?? $_REQUEST['website'] ?? null)) {
    echo json_encode(['success' => false, 'message' => 'Invalid submission']);
    exit;
}

// Get JSON or form data
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$name = trim(strip_tags($input['name'] ?? ''));
$email = trim(strip_tags($input['email'] ?? ''));
$phone = trim(preg_replace('/\D/', '', $input['phone'] ?? ''));
$message = trim(strip_tags($input['message'] ?? ''));

// Validate
if (empty($name) || empty($email) || strlen($phone) < 10 || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields correctly']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Send email
$to = 'gbdsatp@gmail.com';
$subject = 'New Contact Form Submission from ' . $name;
$body = "Name: " . $name . "\nEmail: " . $email . "\nPhone: " . $phone . "\nMessage:\n" . $message;
$headers = "From: " . $email . "\r\nReply-To: " . $email;

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message']);
}
?>
