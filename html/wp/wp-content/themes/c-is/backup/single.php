<?php get_header(); ?>

<?php if (have_posts()) : 
while (have_posts()) : the_post();

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
							<!-- imageSVG.setAttribute('viewBox', '450 0 1050 650'); -->
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
<?php endwhile; endif; ?>

<div class="container" id="container">
	<main class="main main--single main clear" id="main" role="main">
		<img class="arrow-down" src="/wp-content/themes/c-is/assets/images/common/arrow-down.png">
		<section class="content content--single" id="content">
			<article class="single-article">
				<div class="single-inner">
					<script type="text/template" id="template--index">
						<% _.each(datums, function (data) { %>
							<% _.each(data.post.attachments, function(attachment, index) { %>  
								<% if (index !== 0) { %>
								<div class="single-article-image">
									<img src="<%= attachment.url %>" alt="thumbnail">
								</div>
								<% }; %>
							<% }); %>

							<div class="single-article-text">
								<%= data.post.content %>
							</div>

							<div class="single-article-share">
								<ul class="clear">
									<li id="share--facebook">
										<a class="button--share" id="share--facebook" href="">
											<svg version="1.1" id="logo-facebook" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
												 width="22.124px" height="46px" viewBox="0 0 96.124 96.123" style="enable-background:new 0 0 96.124 96.123;"
												 xml:space="preserve">
												<g>
													<linearGradient id="lg" x1="0.5" y1="1" x2="0.5" y2="0">
														<stop offset="0%" stop-opacity="1" stop-color="#3B5998"/>
														<stop offset="40%" stop-opacity="1" stop-color="#3B5998">
														<animate attributeName="offset" values="0;1;" dur="0.2s" begin="logo-facebook.mouseover" fill="freeze"/>
														</stop>
														<stop offset="40%" stop-opacity="0" stop-color="#3B5998">
														<animate attributeName="offset" values="0;1;" dur="0.2s"  begin="logo-facebook.mouseover" fill="freeze"/>
														</stop>
														<stop offset="100%" stop-opacity="0" stop-color="#3B5998"/>
													</linearGradient>
													<path fill="#555" d="M72.089,0.02L59.624,0C45.62,0,36.57,9.285,36.57,23.656v10.907H24.037c-1.083,0-1.96,0.878-1.96,1.961v15.803
														c0,1.083,0.878,1.96,1.96,1.96h12.533v39.876c0,1.083,0.877,1.96,1.96,1.96h16.352c1.083,0,1.96-0.878,1.96-1.96V54.287h14.654
														c1.083,0,1.96-0.877,1.96-1.96l0.006-15.803c0-0.52-0.207-1.018-0.574-1.386c-0.367-0.368-0.867-0.575-1.387-0.575H56.842v-9.246
														c0-4.444,1.059-6.7,6.848-6.7l8.397-0.003c1.082,0,1.959-0.878,1.959-1.96V1.98C74.046,0.899,73.17,0.022,72.089,0.02z"/>
													<path class="animate-path" fill="url(#lg)" d="M72.089,0.02L59.624,0C45.62,0,36.57,9.285,36.57,23.656v10.907H24.037c-1.083,0-1.96,0.878-1.96,1.961v15.803
														c0,1.083,0.878,1.96,1.96,1.96h12.533v39.876c0,1.083,0.877,1.96,1.96,1.96h16.352c1.083,0,1.96-0.878,1.96-1.96V54.287h14.654
														c1.083,0,1.96-0.877,1.96-1.96l0.006-15.803c0-0.52-0.207-1.018-0.574-1.386c-0.367-0.368-0.867-0.575-1.387-0.575H56.842v-9.246
														c0-4.444,1.059-6.7,6.848-6.7l8.397-0.003c1.082,0,1.959-0.878,1.959-1.96V1.98C74.046,0.899,73.17,0.022,72.089,0.02z"/>
												</g>
											</svg>
										</a>
									</li>
									<li>
										<a class="button--share" href="https://twitter.com/intent/tweet?text=<%= data.post.title %>&amp;url=<%= data.post.url %>&amp;via=C" target="_blank">
											<svg version="1.1" id="logo-twitter" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22.124px" height="46px" x="0px" y="0px"
												 viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
												<linearGradient id="lg2" x1="0.5" y1="1" x2="0.5" y2="0">
													<stop offset="0%" stop-opacity="1" stop-color="#55acee"/>
													<stop offset="40%" stop-opacity="1" stop-color="#55acee">
													<animate attributeName="offset" values="0;1;" dur="0.4s" begin="logo-twitter.mouseover" fill="freeze"/>
													</stop>
													<stop offset="40%" stop-opacity="0" stop-color="#55acee">
													<animate attributeName="offset" values="0;1;" dur="0.4s"  begin="logo-twitter.mouseover" fill="freeze"/>
													</stop>
													<stop offset="100%" stop-opacity="0" stop-color="#55acee"/>
												</linearGradient>
												<g>
													<g>
														<path style="fill:#555;" d="M612,116.258c-22.525,9.981-46.694,16.75-72.088,19.772c25.929-15.527,45.777-40.155,55.184-69.411
															c-24.322,14.379-51.169,24.82-79.775,30.48c-22.907-24.437-55.49-39.658-91.63-39.658c-69.334,0-125.551,56.217-125.551,125.513
															c0,9.828,1.109,19.427,3.251,28.606C197.065,206.32,104.556,156.337,42.641,80.386c-10.823,18.51-16.98,40.078-16.98,63.101
															c0,43.559,22.181,81.993,55.835,104.479c-20.575-0.688-39.926-6.348-56.867-15.756v1.568c0,60.806,43.291,111.554,100.693,123.104
															c-10.517,2.83-21.607,4.398-33.08,4.398c-8.107,0-15.947-0.803-23.634-2.333c15.985,49.907,62.336,86.199,117.253,87.194
															c-42.947,33.654-97.099,53.655-155.916,53.655c-10.134,0-20.116-0.612-29.944-1.721c55.567,35.681,121.536,56.485,192.438,56.485
															c230.948,0,357.188-191.291,357.188-357.188l-0.421-16.253C573.872,163.526,595.211,141.422,612,116.258z"/>
														<path class="animate-path" fill="url(#lg2)" d="M612,116.258c-22.525,9.981-46.694,16.75-72.088,19.772c25.929-15.527,45.777-40.155,55.184-69.411
															c-24.322,14.379-51.169,24.82-79.775,30.48c-22.907-24.437-55.49-39.658-91.63-39.658c-69.334,0-125.551,56.217-125.551,125.513
															c0,9.828,1.109,19.427,3.251,28.606C197.065,206.32,104.556,156.337,42.641,80.386c-10.823,18.51-16.98,40.078-16.98,63.101
															c0,43.559,22.181,81.993,55.835,104.479c-20.575-0.688-39.926-6.348-56.867-15.756v1.568c0,60.806,43.291,111.554,100.693,123.104
															c-10.517,2.83-21.607,4.398-33.08,4.398c-8.107,0-15.947-0.803-23.634-2.333c15.985,49.907,62.336,86.199,117.253,87.194
															c-42.947,33.654-97.099,53.655-155.916,53.655c-10.134,0-20.116-0.612-29.944-1.721c55.567,35.681,121.536,56.485,192.438,56.485
															c230.948,0,357.188-191.291,357.188-357.188l-0.421-16.253C573.872,163.526,595.211,141.422,612,116.258z"/>
													</g>
												</g>
											</svg>
										</a>
									</li>
								</ul>
							</div>
						<% }); %>
					</script>
				</div>
				<div class="button-container">
					<a href="/" class="button button--back">BACK</a>
				</div>
			</article>
		</section>
		<div class="single-navigator">
			<script type="text/template" id="template--pager">
				<% _.each(datums, function (data) { %>

						<% if (typeof(data.previous_url) !== "undefined") { %>
						<a class="navigator-previous" href="<%= data.previous_url %>">PREV</a>
						<% }; %>
						<% if (typeof(data.next_url) !== "undefined") { %>
						<a class="navigator-next" href="<%= data.next_url %>">NEXT</a>
						<% }; %>
				<% }); %>
			</script>
		</div>
	</main>
</div>

<?php get_footer(); ?>