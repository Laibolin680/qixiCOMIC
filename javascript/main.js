// 小孩走路
// 小男孩动作
function BoyWalk() {

	var container = $('#content');
	// 看得见
	var visualWidth = container.width();
	var visualHeight = container.height();
	// 获取宽高
	var getValue = function(className) {
		var $elem = $('' + className + '');
		return {
			height: $elem.height(),
			top: $elem.position().top
		};
	}
	// 路的Y轴
	var pathY = function() {
		var data1 = getValue('.a_background_middle');
		return data1.top + data1.height / 2;
	}();

	var $boy = $("#boy");
	var boyHeight = $boy.height();
	var boyWidth = $boy.width();
	// 小男孩位置
	$boy.css({
		top: pathY - boyHeight + 25
	});

	// 动画
	// 暂停走路
	function pauseWalk() {
		$boy.addClass('pauseWalk');
	}
	// 恢复走路
	function restoreWalk() {
		$boy.removeClass('pauseWalk');
	}
	// 走路动作
	function slowWalk() {
		$boy.addClass('slowWalk');
	}


	// 用transition来做运动,异步行为$.Deferred
	function startRun(option, runTime) {
		var dfdPlay = $.Deferred();
		restoreWalk();

		$boy.transition(
			option,
			runTime,
			'linear',
			function() {
				dfdPlay.resolve();
			});
		return dfdPlay;
	}

	// 开始走路
	function walkRun(time, dist, disY) {
		time = time || 3000;
		slowWalk();

		var d1 = startRun({
			'left': dist + 'px',
			'top': disY ? disY : undefined
		},time);
		return d1;
	}

	// 移动距离
	function calculateDist(direction, proportion) {
		return (direction == "x" ? visualWidth :visualHeight) * proportion;
	}

	var instanceX;
	var instanceY;

	// 进店
	function walkToShop(runTime) {
		var defer = $.Deferred();//异步
		var doorObj = $('.door');
		// 门的坐标
		var offsetDoor = doorObj.offset();
		var doorOffsetLeft = offsetDoor.left;
		var doorOffsetTop = offsetDoor.top;
		// 小孩当前的坐标
		var offsetBoy = $boy.offset();
		var boyOffsetLeft = offsetBoy.left;
		var boyOffsetTop = offsetBoy.top;

		instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffsetLeft + $boy.width() / 2);
		instanceY = (doorOffsetTop + doorObj.height() / 2) - (boyOffsetTop + $boy.height() / 2);
		// 走进去
		var walkPlay = startRun({
			transform: 'translate(' + instanceX + 'px, ' + instanceY + 'px),scale(0.9, 0.9)',
			opacity: 0.1
		},runTime);
		// 走完之后
		walkPlay.done(function() {
			$boy.css({
				opacity: 0
			})
			defer.resolve();
		})
		return defer;
	}

	// 出店
	function walkOutShop(runTime) {
		var defer = $.Deferred();
		restoreWalk();
		// 走进去	
		var walkPlay = startRun({
			transform: 'translateX(' + instanceX +'px), scale(1, 1)',
			opacity: 1
		}, runTime);
		// 走完之后
		walkPlay.done(function() {
			defer.resolve();
		});
		return defer;
	}

	// 取花动画
	function takeFlower() {
		// 增加延时等待效果
		var defer = $.Deferred();

		setTimeout(function() {
			$boy.addClass('slowFlowerWalk');
			defer.resolve();
		}, 1000);
		return defer;
	}

	// 接口
	return {
		// 开始走路
		walkTo: function(time, proportionX, proportionY) {
			var distX = calculateDist('x', proportionX);
			var distY = calculateDist('y', proportionY);
			return walkRun(time, distX, distY);
		},
		// 停止走路
		stopWalk: function() {
			pauseWalk();
		},
		// 变色
		setColor: function(value) {
			$boy.css('background-color', value);
		},
		// 进入商店
		toShop: function() {
			return walkToShop.apply(null, arguments);
		},
		// 走出商店
		outShop: function() {
			return walkOutShop.apply(null, arguments);
		},
		takeFlowergo: function() {
			return takeFlower();
		},
		getWidth: function() {
			return boyWidth;
		},
		resetOriginal: function() {
			this.stopWalk();
			$boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
		},
		rotate: function(callback) {
			restoreWalk();
			$boy.addClass('boy-rotate');
			// 监听转身
			if (callback) {
				$boy.on(animationEnd, function() {
					callback();
					this.off();
				});
			}
		}
	}
}

// 门动画

function doorAction(left, right, time) {
	var $door = $('.door');
	var doorLeft = $('.door-left');
	var doorRight = $('.door-right');
	var defer = $.Deferred();
	var count = 2;

	var complete = function() {
		if(count == 1) {
			defer.resolve();
			return;
		}
		count--;
	};

	doorLeft.transition({'left': left}, time, complete);
	doorRight.transition({'left': right}, time, complete);

	return defer;
}

function openDoor() {
	return doorAction('-50%', '100%', 2000);
}
function shutDoor() {
	return doorAction('0%', '50%', 2000);
}

// 灯动画
var lamp = {
	// elem= $('.b_background'),
	bright: function() {
		$('.b_background').addClass('lamp-bright')
	},
	dark: function() {
		$('.b_background').removeClass('lamp-bright')
	}
};

// 飞鸟动画
var bird = {
	fly: function() {
		$('.bird').addClass('birdFly').transition({'right': $('#content').width() + 'px'}, 5000, 'linear');
	}
};

// 动画结束事件
var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if (~explorer.indexOf('webkit')) {
		return 'webkitAnimation';
	}
	return 'webkitAnimation';
})();


// logo动画
var logo = {
	elem: $('.logo'),
	run: function() {
		this.elem.addClass('logolightSpeedIn')
			.on(animationEnd, function() {
				$(this).addClass('logoshake').off();
			});
	}
};


var snowflakeURL = [
	'http://img.mukewang.com/55adde120001d34e00410041.png',
    'http://img.mukewang.com/55adde2a0001a91d00410041.png',
    'http://img.mukewang.com/55adde5500013b2500400041.png',
    'http://img.mukewang.com/55adde62000161c100410041.png',
    'http://img.mukewang.com/55adde7f0001433000410041.png',
    'http://img.mukewang.com/55addee7000117b500400041.png'
]

// 飘雪花
function snowflake() {
	var $flakeContainer = $('#snowflake');

	function getImagesName() {
		return snowflakeURL[[Math.floor(Math.random() *6)]];
	}

	// 雪花元素
	function creatSnowBox() {
		var url = getImagesName();
		return $('<div class="snowbox" />').css({
			'width': 41,
			'height': 41,
			'position': 'absolute',
			'background-size': 'cover',
			'z-index': 100000,
			'top': '41px',
			'background-image': 'url(' + url + ' )'
		}).addClass('snowRoll');
	}
	// 开始飘花
	setInterval(function() {
		// 轨迹
		var startPositionLeft = Math.random() * visualWidth - 100,
			startOpacity = 1,
			endPositionTop = visualHeight - 40,
			endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
			duration = visualHeight * 10 + Math.random() * 5000;

		// 随机透明度
		var randomStart = Math.random();
		randomStart = randomStart < 0.5 ? startOpacity : randomStart;

		// 创建一个雪花
		var $flake = creatSnowBox();

		// 设计起点位置
		$flake.css({
			'left': 'startPositionLeft',
			'opacity': 'randomStart'
		});

		// 加入到容器
		$flakeContainer.append($flake);

		// 开始执行动画
		$flake.transition({
			top: endPositionTop,
			left: endPositionLeft,
			opacity: 0.7
		},duration, 'ease-out', function() {
			$(this).remove()
		});
	}, 500);
}
// 音乐配置
var audioConfig = {
	enable: true,
	playURL: '../music/happy.wav',
	cycleURL: '../music/circulation.wav'
};

// 背景音乐
function Html5Audio(url, isloop) {
	var audio = new Audio(url);
	audio.autoPlay = true;
	audio.loop = isloop || false;
	audio.play();
	return {
		end: function(callback) {
			audio.addEventListener('ended', function() {
				callback();
			}, false);
		}
	};
}
