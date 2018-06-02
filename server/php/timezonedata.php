<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('TimezoneWidget.php');

echo json_encode(TimezoneWidget::timezoneValues());


?>