		
		<footer class="footer clear" role="contentinfo">

		</footer>

		<form action="<?php echo get_template_directory_uri(); ?>/contact.php" class="form form--contact" id="form--contact">
			<a href="" class="contact-trigger"><span></span></a>
			<div class="form-message"></div>
			<div class="form-inner">
				<p class="input-values"><span>Name:</span><input type="text" name="name"></p>
				<p class="input-values"><span>E-mail:</span><input class="email" type="email" name="email"></p>
				<p><textarea name="message"></textarea></p>
				<p class="button button--submit"><input class="submit" type="submit" name="submit"></p>
			</div>
		</form>

		<script data-main="<?php echo get_template_directory_uri(); ?>/assets/js/scripts.min" src="<?php echo get_template_directory_uri(); ?>/assets/js/vendor/require.min.js"></script>
		
		<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
		<script>
		 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		 })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		 ga('create', 'UA-xxxxxx', 'auto');
		 ga('send', 'pageview');

		</script>
	</body>
</html>