<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "DB NAME";

// Configure MYSQL credentials
$connection = new mysqli($servername, $username, $password, $dbname);
if ($connection->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$truncateSQL = "TRUNCATE TABLE students";
$truncateResult = $connection->query($truncateSQL);
$reinsertSQL = "INSERT INTO `students` (`id`, `name`, `grade`, `course`, `author`) VALUES
(132, 'Ceska', 100, 'Spanish', 177),
(283, 'Jian-Yang', 50, 'Ceramics', 194),
(356, 'Simon', 80, 'CompSci', 197),
(386, 'Jessie', 94, 'English', 197),
(438, 'Michael', 90, 'Spanish 101', 205),
(573, 'Serag zwait', 55, 'I.T', 126),
(574, 'Yrenia', 95, 'Game Development', 86),
(661, 'TRON4EVA', 100, 'INTRO TO COMP SCI', 212),
(977, 'Nick', 100, 'Badminton', 210),
(984, 'Missy', 98, 'Swim', 196),
(993, 'James', 45, 'Curling', 1),
(994, 'Taylor', 45, 'Math', 1),
(995, 'James', 87, 'Science', 1),
(996, 'Steven', 89, 'Data Structures', 1),
(997, 'Sarah', 98, 'Machine Learning', 1),
(999, 'Henry', 12, 'Linear Algebra', 1),
(1002, 'Coraline', 34, 'Film', 1),
(1003, 'Try it out! ', 100, 'Add a Course', 1);";
$reinsertResult = $connection->query($reinsertSQL);
$connection->close();
?>