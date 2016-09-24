<?php

// function disable_wp_emojicons() {

//   // all actions related to emojis
//   remove_action( 'admin_print_styles', 'print_emoji_styles' );
//   remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
//   remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
//   remove_action( 'wp_print_styles', 'print_emoji_styles' );
//   remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
//   remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
//   remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );

//   // filter to remove TinyMCE emojis
//   add_filter( 'tiny_mce_plugins', 'disable_emojicons_tinymce' );
// }
// add_action( 'init', 'disable_wp_emojicons' );

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

function my_rest_prepare_post( $data, $post, $request ) {
	$_data = $data->data;
	$thumbnail_id = get_post_thumbnail_id( $post->ID );
	$thumbnail = wp_get_attachment_image_src( $thumbnail_id, 'large' );
	$_data['featured_media'] = $thumbnail[0];
	unset($_data['guid'], $_data['comment_status'], $_data['ping_status'], $_data['date_gmt'], $_data['modified_gmt'], $_data['_links']);

	$data->data = $_data;
	return $data;
}
add_filter( 'rest_prepare_post', 'my_rest_prepare_post', 10, 3 );

