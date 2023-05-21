<?php
	include_once "views/base/headers/base.php";
?>
<style>
	nav, footer{
		display: none !important;
	}
</style>
<?php
	include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/API/" . API_VERSION . "/index.php");
	$url = $_REQUEST["url"];
    $domain = str_replace("https://", "", $url);
    $domain = explode("/", $domain);
    $domain = $domain[0];

	// make sure we have a valid URL and not file path
	if (!preg_match("`https?\://`i", $url)) {
	    die('Not a URL');
	}

	// make the HTTP request to the requested URL
    $response = $API->requrl(array(
        "url" => $url
    ));

    $content = str_replace('src="/css/', 'src="//' . $domain . '/css/', $response->response);
    $content = str_replace('href="/css/', 'href="//' . $domain . '/css/', $response->response);
    $content = str_replace('src="/vendor/', 'src="//' . $domain . '/vendor/', $content);
    $content = str_replace('src="/widgets/', 'src="//' . $domain . '/widgets/', $content);
    $content = str_replace('src="/mixed/', 'src="//' . $domain . '/mixed/', $content);
    $content = str_replace('href="/mixed/', 'href="//' . $domain . '/mixed/', $content);
    $content = str_replace('src="/scripts/', 'src="//' . $domain . '/scripts/', $content);
    $content = str_replace('src="/js/', 'src="//' . $domain . '/js/', $content);

    $content = str_replace('<html>', '', $content);
    $content = str_replace('</html>', '', $content);
    $content = str_replace('<header>', '', $content);
    $content = str_replace('</header>', '', $content);
    $content = str_replace('<body>', '', $content);
    $content = str_replace('</body>', '', $content);

	echo $content;
?>
