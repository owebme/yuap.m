<?php

require "config.php";

//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods: POST, GET, OPTIONS, HEAD');
//header('Access-Control-Allow-Headers: X-Requested-With');
//header('Access-Control-Max-Age: 1728000');
//header('Connection: Keep-Alive');

// Получение данных VKонтакте (авторизация)
if (isset($_GET['code'])) {

    $result = false;
    $params = array(
        'client_id' => $config['vk']['client_id'],
        'client_secret' => $config['vk']['client_secret'],
        'code' => $_GET['code'],
        'redirect_uri' => $config['vk']['redirect_uri']
    );

    $token = json_decode(file_get_contents('https://oauth.vk.com/access_token' . '?' . urldecode(http_build_query($params))), true);

    if (isset($token['access_token'])) {
        $params = array(
            'uids'         => $token['user_id'],
            'fields'       => 'uid,first_name,last_name,sex,bdate,country,contacts,relation,photo_max',
            'access_token' => $token['access_token']
        );

        $userInfo = json_decode(file_get_contents('https://api.vk.com/method/users.get' . '?' . urldecode(http_build_query($params))), true);
        if (isset($userInfo['response'][0]['uid'])) {
            $userInfo = $userInfo['response'][0];
            $result = true;
        }
    }

    if ($result) {
		// Если авторизация пройдена, отправляем данные
		//https://oauth.vk.com/authorize?client_id=3280318&scope=friends,schools,email&display=page&response_type=code&redirect_uri=https%3A%2F%2Fulogin.ru%2Fauth.php%3Fname%3Dvkontakte
		
		$userInfo['network'] = "vk";
		
		print '<script language="Javascript" type="text/javascript">
			window.opener.postMessage(' . json_encode($userInfo) . ', "*");	
			window.opener.focus();
			window.close();	
		</script>';	
		//print '<script language="Javascript" type="text/javascript">window.opener.chatObj.auth = "AuthVK"; window.opener.focus(); window.close();</script>';
		//sendParams("vk", $userInfo['uid'], $userInfo['first_name'], "", $userInfo['screen_name'], $userInfo['sex'], $userInfo['bdate'], $userInfo['photo_big']);
	}
}


?>