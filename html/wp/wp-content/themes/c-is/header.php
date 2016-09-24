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
		<meta name="description" content="<?php bloginfo('description'); ?>" />
		<meta name="keywords" content="C is, c-is, web design, graphic design, uk, japan, poland, branding, london, graphic, website" />
		<meta name="author" content="C is" />
		<meta property="og:title" content="<?php wp_title(); ?>" />
		<meta property="og:type" content="website"/>
		<meta property="og:site_name" content="<?php bloginfo('name'); ?>"/>
		<meta property="og:url" content="http://c-is.co" />
		<meta property="og:image" content="<?php echo get_template_directory_uri(); ?>/assets/images/common/logo-facebook.png" />
		<meta property="og:description" content="C is the heavenly option" />
		<!-- <meta property="og:image:width" content="1240"/>
		<meta property="og:image:height" content="690"/> -->
		<meta property="og:locale" content="en_GB" /> 
		<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">
		<link rel="apple-touch-icon" sizes="57x57" href="<?php echo get_template_directory_uri(); ?>/apple-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="60x60" href="<?php echo get_template_directory_uri(); ?>/apple-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="72x72" href="<?php echo get_template_directory_uri(); ?>/apple-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="76x76" href="<?php echo get_template_directory_uri(); ?>/apple-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="114x114" href="<?php echo get_template_directory_uri(); ?>/apple-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="<?php echo get_template_directory_uri(); ?>/apple-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="<?php echo get_template_directory_uri(); ?>/apple-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="<?php echo get_template_directory_uri(); ?>/apple-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/apple-icon-180x180.png">
		<link rel="icon" type="image/png" sizes="192x192"  href="<?php echo get_template_directory_uri(); ?>/android-icon-192x192.png">
		<link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="96x96" href="<?php echo get_template_directory_uri(); ?>/favicon-96x96.png">
		<link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/favicon-16x16.png">
		<link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/manifest.json">
		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
		<meta name="theme-color" content="#ffffff">
		
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css">
		<link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">

		<?php wp_head(); ?> 
	</head>
	<?php if (is_page('works')) { ?>
		<body <?php body_class('works'); ?>>
	<?php } else { ?>
		<body <?php body_class(); ?>>
	<?php } ?>
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

		<div class="loader start" id="loader">
			<span class="center--vertical text-center"><img src="<?php echo get_template_directory_uri(); ?>/assets/images/common/loader.png" alt="MAIN LOGO"></span>
		</div>

		<div class="square" id="square">
			<span class="l1"></span>
			<span class="l2"></span>
			<span class="l3"></span>
			<span class="l4"></span>
		</div>
		<header class="header" role="banner">
			<a class="navigation-trigger" id="navigation-trigger"><span>Menu.</span></a>
			<a class="ajax-trigger home-button" id="home-button" href="/"><span>C is...</span><i></i></a>
			<span class="header__subtitle"><a class="ajax-trigger" href="/contact">Contact us</a><i></i></span>
			<span class="button button--back-history button--close" id="button--close"><i></i></span>

			<nav class="navigation" id="navigation" role="navigation">
				<ul>
					<li><a class="ajax-trigger" href="/about"><i></i>About</a></li>
					<li><a class="ajax-trigger" href="/works"><i></i>Works</a></li>
					<li><a class="ajax-trigger" href="/services"><i></i>Services</a></li>
					<li><a class="ajax-trigger" href="/contact"><i></i>Contact</a></li>
				</ul>
			</nav>
		</header>

		<div class="container" id="container">
