window.onload = function() {
	girl.setPosition();
	var boygo = BoyWalk();

	$('button:first').click(function() {

		var audio1 = Html5Audio(audioConfig.playURL);
		audio1.end(function() {
			Html5Audio(audioConfig.cycleURL, true);
		});
		console.log(1+2);
		// 界面一背景动画
		$('#sun').addClass('rotation');
		$('.cloud1').addClass('cloud1Anim');
		$('.cloud2').addClass('cloud2Anim');

		// 页面滑动
		swipe.scrollTo(container.width(), 5000);

		// 小男孩动画、背景动画
		boygo.walkTo(5000, 0.51, 0)
			  .then(function() {
			  	boygo.stopWalk()
			}).then(function() {	
				return openDoor()
			}).then(function() {
				lamp.bright()
			}).then(function() {
				return boygo.toShop(3000)
			}).then(function() {
				return boygo.takeFlowergo()
			}).then(function() {
				bird.fly()
			}).then(function() {
				return boygo.outShop(3000)
			}).then(function() {
				lamp.dark()
			}).then(function() {
				return shutDoor()
			}).then(function() {
				boygo.walkTo(2000, 0.1, 0);
				swipe.scrollTo(container.width() * 2, 2000);
			}).then(function() {
				return boygo.walkTo(2000, 0.32, ((bridgeY - girl.getHeight()) / visualHeight) - 0.06);
			}).then(function() {
				var proportionX = ((girl.getOffset().left - boygo.getWidth() + girl.getWidth()) / 2.1) / visualWidth;
				console.log(girl.getOffset().left);
				console.log(boygo.getWidth());
				console.log(girl.getWidth());
				console.log(visualWidth);				
				console.log(proportionX);				
				return boygo.walkTo(1500, proportionX, 0);
			}).then(function() {
				boygo.resetOriginal();
			}).then(function() {
				setTimeout(function() {
					girl.rotate();
					boygo.rotate(function() {logo.run();});
				}, 1000);
			});
	})
}
		