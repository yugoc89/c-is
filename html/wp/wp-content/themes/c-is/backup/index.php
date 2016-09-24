<?php get_header(); ?>

<?php
$args = array( 'numberposts' => 1 );
$lastposts = get_posts( $args );
foreach($lastposts as $post) : setup_postdata($post);
$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'full' );
$post_categories = get_the_category( $post->ID );
?>
	
	<div class="article-display" id="article-display">
		<div class="headline-title">
			<span class="headline-title__category"><?php echo $post_categories[0]->name; ?></span>
			<h2><?php the_title(); ?></h2>
		</div>
		<div class="cube-container">
			<div class="Zcube">
				<div class="Ycube">
					<div class="cube">
						<a class="panel-link panel-link--web" href="<?php the_slug(); ?>">
							<svg class="card__image" id="card__image" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="650 0 650 650" preserveAspectRatio="xMidYMid slice">
							<!-- <svg class="card__image" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="400 0 1140 660" preserveAspectRatio="xMidYMid slice"> -->
								<defs>
									<clipPath id="clipPath1">
									<!-- r = 992 = hyp = Math.sqrt(960*960+250*250) -->
									<circle class="clip" cx="960" cy="250" r="992"></circle>
									</clipPath>
								</defs>
								<!-- the clip-path url reference to the id above -->
								<image class="display-image" clip-path="url(#clipPath1)" width="1920" height="650" xlink:href="<?php echo $thumb['0'];?>"></image>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
<?php endforeach; wp_reset_postdata();?>

<div class="container" id="container">
	<main class="main main--home clear" id="main" role="main">
		<section class="content content--home content--archives" id="content">
			<script type="text/template" id="template--index">
				<% _.each(datums, function (data) { %>
					<% _.each(data.posts, function(post) { %>  
					<article class="article article<%= post.id %>">
						<div class="article-inner">
						<% if(typeof(post.attachments[0]) !== "undefined") { %>
							<div class="article-image">
								<img src="<%= post.attachments[0].url %>" height="<%= post.attachments[0].images.full.height %>">
							</div>
						<% } %>
						<% _.each(post.categories, function(category) { %>  
							<div class="center--vertical">
								<p class="article-category">#<%= category.title %></p>
								<h3 class="article-name"><%= post.title %></h3>
								<span class="read-button">read</span>
							</div>
							<a class="article-link article-link" href="/works/<%= category.slug %>/<%= post.slug %>"></a>
						<% }); %>
						</div>
					</article>

					<% }); %>
				<% }); %>
			</script>
		</section>
	</main>
</div>

<?php get_footer(); ?>