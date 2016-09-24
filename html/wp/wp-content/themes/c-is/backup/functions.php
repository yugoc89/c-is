<?php

function curPageURL() {
	$pageURL = 'http';
	if ($_SERVER["HTTPS"] == "on") {
		$pageURL .= "s";
	}
	$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
		$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	}
	else {
		$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}

function get_relative_permalink( $url ) {
	return str_replace( home_url(), "", $url );
}

function the_slug($echo=true){
	$slug = basename(get_permalink());
	do_action('before_slug', $slug);
	$slug = apply_filters('slug_filter', $slug);
	if( $echo ) echo $slug;
	do_action('after_slug', $slug);
	//return $slug;
}

add_action('json_api_post_constructor', 'strip_json_post_html');

function strip_json_post_html($post) {
	//$post->content = strip_tags($post->content);
	$post->excerpt = strip_tags($post->excerpt);
}
/*
* Add thumbnails in a post
*/
add_theme_support( 'post-thumbnails' );
