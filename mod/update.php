<?php

try {
    if (empty($_POST['id'])) {
        throw new PDOException('Invalid request');
    }

    $id = $_POST['id'];
    $done = empty($_POST['done']) ? 0 : 1;

    $host = getenv('HOST');
    $user = getenv('USERNAME');
    $pass = getenv('PASSWORD');
    $dbname = getenv('DB_NAME');

    $dsn = 'mysql:host='. $host .';dbname='. $dbname;

    $objDb = new PDO($dsn, $user, $pass);
    $objDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "UPDATE `items`
            SET `done` = ?
            WHERE `id` = ?";

    $statement = $objDb->prepare($sql);

    if (!$statement->execute(array($done, $id))) {
        throw new PDOException('The execute method failed');
    }

    echo json_encode(array(
        'error' => false
    ), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);

} 
catch(PDOException $e) {
    echo json_encode(array(
        'error' => true,
        'message' => $e->getMessage()
    ), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
}

