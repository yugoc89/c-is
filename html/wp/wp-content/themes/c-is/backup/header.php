<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en-GB"> <!--<![endif]-->
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge"> 
		<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1 user-scalable=no">
		<title><?php wp_title(' | ', true, 'right'); ?><?php bloginfo('name'); ?></title>
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<meta name="author" content="Yugo Ito" />
		<meta property="og:title" content="<?php wp_title(); ?>" />
		<meta property="og:type" content="website"/>
		<meta property="og:site_name" content="<?php bloginfo('name'); ?>"/>
		<meta property="og:url" content="http://c-is.worlders.co.uk" />
		<meta property="og:image" content="http://c-is.worlders.co.uk/wp-content/themes/c-is/assets/images/common/fb_bg.jpg" />
		<meta property="og:description" content="C is the heavenly option" />
		<meta property="og:image:width" content="1240"/>
		<meta property="og:image:height" content="690"/>
		<meta property="og:locale" content="en_GB" /> 
		<link rel="shortcut icon" href="/favicon.ico">
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css">

		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/vendor/modernizr.js"></script>
		<script src="//fast.eager.io/Sb7Agledrk.js"></script>
		<?php wp_head(); ?> 
	</head>
	<body <?php body_class(); ?>>
		<!--[if lt IE 8]>
		<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->

		<div id="fb-root"></div>
		<script>
		window.fbAsyncInit = function() {
			FB.init({
				appId: '453827074807151',
				status: true,
				cookie: true,
				xfbml: true
			});
		};
		(function() {
			var e = document.createElement('script'); e.async = true;
			e.src = document.location.protocol +
			'//connect.facebook.net/en_US/all.js';
			document.getElementById('fb-root').appendChild(e);
		}());
		</script>

		<div class="loader show" id="loader"><span>C</span></div>
		<div class="bg bg--main"></div>

		<header class="header" role="banner">
			<h1><a href="/">C</a></h1>
			<nav class="navigation" role="navigation">
				<ul class="clear list--main">
					<li><a href="/">home</a></li>
					<?php 
						$categories = get_terms( 'category', 'orderby=count&hide_empty=0' );
						foreach ($categories as $category) {
							echo '<li><a href="/works/' .$category->slug. '">' .$category->name. '</a></li>';
						}
					?>
				</ul>
				<ul class="list--pages">
					<li><a class="ajax-trigger" href="/about">about</a></li>
					<li><a id="link--contact" href="">contact</a></li>
				</ul>
			</nav>
			<p class="header-bottom">C is the heavenly option</p>
		</header>
		<a class="navigation-trigger" id="navigation-trigger"><span></span></a>
		<nav class="navigation--sp" id="navigation--sp">
			<div class="navigation-inner">
				<ul class="sp-menu list--main">
					<li><a href="/">home</a></li>
					<?php 
						$categories = get_terms( 'category', 'orderby=count&hide_empty=0' );
						foreach ($categories as $category) {
							echo '<li><a href="/works/' .$category->slug. '">' .$category->name. '</a></li>';
						}
					?>
				</ul>
				<ul class="list--pages">
					<li><a href="/about">about</a></li>
					<li><a id="link--contact-sp" href="">contact</a></li>
				</ul>
			</div>
		</nav>
