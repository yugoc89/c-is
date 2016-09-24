		</div>
		<footer class="footer clear" role="contentinfo">

		</footer>

		<?php if (wp_is_mobile()) {
			echo '<script src="' . get_template_directory_uri() . '/assets/js/scripts-sp.min.js"></script>';
		} else {
			echo '<script src="' . get_template_directory_uri() . '/assets/js/scripts.min.js"></script>';
		} ?>
		
		<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-77774043-1', 'auto');
		  ga('send', 'pageview');

		</script>

		<?php wp_footer(); ?>
	</body>
</html>