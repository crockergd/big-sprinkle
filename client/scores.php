<?php
    require 'vendor/autoload.php';

    $app = new \Slim\Slim();

    $app->get('/scores', function() {
        $redis = new Predis\Client();
        //$redis->del('scores');
        $options = array(
            //'limit' => array(0, 1),
            'withscores' => true);
        $range = $redis->zrangebyscore('scores', 0, "inf", $options);
        $slice = array_slice($range, 0, 9);

        $json = array();
        foreach($slice as $key => $item) {
            $temp = array(
                "name" => $key,
                "score" => $item,
            );
            array_push($json, $temp);
        }
        echo json_encode($json);
    });

    $app->post('/scores', function() use ($app) {
        $redis = new Predis\Client();
        $redis->zadd('scores', $app->request()->params('score'), $app->request()->params('client'));
        $redis->save();
        //$options = array(
            //'limit' => array(0, 1),
        //    'withscores' => true);
        //$range = $redis->zrangebyscore('scores', 0, "inf", $options);
        //echo json_encode(array_slice($range, 0, 9));
    });

    $app->run();
?>
