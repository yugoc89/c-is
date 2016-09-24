<?php get_header(); ?>

<?php
get_header()
?>
<?php
remove_filter( 'the_content', 'wpautop' );
remove_filter( 'the_excerpt', 'wpautop' );
?>

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

	<div class="article-display" id="article-display">
		<div class="headline-title">
			<span class="headline-title__category"></span>
			<h2><?php the_title(); ?></h2>
		</div>
		<div class="cube-container">
			<div class="Zcube">
				<div class="Ycube">
					<div class="cube">
						<svg class="card__image" id="card__image" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="650 0 650 650" preserveAspectRatio="xMidYMid slice">
						<!-- <svg class="card__image" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="400 0 1140 660" preserveAspectRatio="xMidYMid slice"> -->
							<defs>
								<clipPath id="clipPath1">
								<!-- r = 992 = hyp = Math.sqrt(960*960+250*250) -->
								<circle class="clip" cx="960" cy="250" r="992"></circle>
								</clipPath>
							</defs>
							<!-- the clip-path url reference to the id above -->
							<image class="display-image" clip-path="url(#clipPath1)" width="1920" height="650" xlink:href=""></image>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
<?php endwhile; endif; ?>

	<div class="container" id="container">
		<main class="main main--page clear" id="main" role="main">
			<section class="content content--page" id="content">
				<script type="text/template" id="template--index">
					<% _.each(datums, function (data) { %>
						<article class="article--page article--page<%= data.page.id %> clear">
							<div class="article--page-inner left">
								<%= data.page.content %>
							</div>
							<div class="person-info right">
								<div class="person-info-inner">
									<h5><%= data.page.custom_fields.people_0_name %></h5>
									<div class="person-info__description">
										<%= data.page.custom_fields.people_0_person %>
									</div>
								</div>
								<div class="person-info-inner">
									<h5><%= data.page.custom_fields.people_1_name %></h5>
									<div class="person-info__description">
										<%= data.page.custom_fields.people_1_person %>
									</div>
								</div>
							</div>
						</article>
					<% }); %>
				</script>
			</section>
		</main>
	</div>

<?php
get_footer()
?>