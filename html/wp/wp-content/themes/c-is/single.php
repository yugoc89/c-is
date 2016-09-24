<?php get_header(); ?>

<main class="main main--works clear" id="main" role="main">
	<div class="scroll-arrows scroll-arrows--single">
		<span class="arrow-down"></span>
	</div>
	<article class="content content--single single-post" id="single-post">
		<div class="overlay overlay--single"></div>
		<span class="button button--close single-post__close" id="button--single-close"><i></i></span>
		
		<div class="single-post-inner" id="single-post-inner"></div>
		<script type="text/template" id="template--post">
			<h2 class="left"><%= datums.title.rendered %></h2>
			<section class="section single-post__top-image">
				<div class="single-post__mock">
					<div class="mock-inner">
						<img class="scaled" src="<%= datums.featured_media %>">
					</div>
				</div>
			</section>
			<section class="section single-post__details">
				<div class="single-post__desc clear">
					<h3 class="left"><%= datums.title.rendered %></h3>
					<div class="desc-inner right">
						<strong><%= datums.acf.desc_title %></strong>
						<%= datums.content.rendered %>
					</div>
				</div>
			</section>
			<section class="section single-post__images clear">
			<% _.each(datums.acf.images, function (data) { %>
			<% console.log(datums.acf.images); %>
				<!-- <div class="single-post__image" style="background-image: url(<%= data.image.sizes.large %>);"> -->
				<div class="single-post__image">
					<img src="<%= data.image.sizes.large %>">
				</div>
			<% }); %>
			</section>
			<section class="section single-post__notes">
				<div class="single-post__desc--bottom clear">
					<% if(datums.acf.url) { %>
					<p><span class="desc-heading">URL:</span><span><a href="<%= datums.url %>" target="_blank"><%= datums.acf.url %></a></span></p>
					<% }; %>
					<p><span class="desc-heading">Skillset:</span><span><%= datums.acf.skillset %></span></p>
				</div>
			</section>
			<section class="section single-post__share">
				<ul class="clear">
					<li id="share--facebook">
						<a class="button--share" id="share--facebook" href="">
							<svg version="1.1" id="icon-facebook" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
								 width="30.124px" height="46px" viewBox="0 0 96.124 96.123" style="enable-background:new 0 0 96.124 96.123;"
								 xml:space="preserve">
								<g>
									<path fill="#ccc" d="M72.089,0.02L59.624,0C45.62,0,36.57,9.285,36.57,23.656v10.907H24.037c-1.083,0-1.96,0.878-1.96,1.961v15.803
										c0,1.083,0.878,1.96,1.96,1.96h12.533v39.876c0,1.083,0.877,1.96,1.96,1.96h16.352c1.083,0,1.96-0.878,1.96-1.96V54.287h14.654
										c1.083,0,1.96-0.877,1.96-1.96l0.006-15.803c0-0.52-0.207-1.018-0.574-1.386c-0.367-0.368-0.867-0.575-1.387-0.575H56.842v-9.246
										c0-4.444,1.059-6.7,6.848-6.7l8.397-0.003c1.082,0,1.959-0.878,1.959-1.96V1.98C74.046,0.899,73.17,0.022,72.089,0.02z"/>
								</g>
							</svg>
						</a>
					</li>
					<li>
						<a class="button--share" href="https://twitter.com/intent/tweet?text=<%= datums.title.rendered %>&amp;url=<%= datums.acf.url %>&amp;via=C" target="_blank">
							<svg version="1.1" id="icon-twitter" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30.124px" height="46px" x="0px" y="0px"
								 viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
								<g>
									<g>
										<path fill="#ccc" d="M612,116.258c-22.525,9.981-46.694,16.75-72.088,19.772c25.929-15.527,45.777-40.155,55.184-69.411
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
			</section>
		</script>
	</article>
</main>

<?php get_footer(); ?>