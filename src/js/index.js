import bg from "@images/bg"     //  背景图
import loading from "@images/loading"   //  加载动画
import loadingText from "@images/loadingText"   //  加载文字
import bullet from "@images/bullet" //  子弹
import me from "@images/me"     //  朕
import plain1 from "@images/plain1"		//	坏人

const startBtn = document.querySelector(".startBtn")
const cvs = document.querySelector("canvas")
const ctx = cvs.getContext("2d")


//	产生 [m,n) 范围的随机数 
const random = (m, n) => {
	return Math.random() * (n - m) + m
}

let _self;

//	搞起
class Fight {
	constructor() {
		_self = this
		this.init()
	}
	//  初始化，加载背景图和过场动画
	init() {
		Promise.all([
			this.createImg(bg),
			this.createImg(loading),
			this.createImg(loadingText),
			this.createImg(bullet),
			this.createImg(me),
			this.createImg(plain1),
		]).then(res => {
			//	画布大小
			this._width = 400
			this._height = 600
			//	加载背景及文字
			this.bg = res[0]
			this.bg.speed = 2;
			this.loading = res[1]
			this.loadingText = res[2]
			this.bg.top = 0
			this.loading.left = 0
			//	子弹
			this.bullet = res[3]
			this.bullet._width = this.bullet.width
			this.bullet._height = this.bullet.height
			this.bullet.speed = 5
			this.bullet.bullets = []
			this.bullet.interval = 500 //	子弹间隔
			//	朕
			this.me = res[4]
			this.me._width = this.me.width / 5			//	裁剪尺寸
			this.me._height = this.me.height
			this.me.real_w = this.me._width / 2			//	压缩后的真实尺寸	49
			this.me.real_y = this.me._height / 2		//	61
			this.me.posX = 200			//	初始位置
			this.me.posY = 500
			//	坏人
			this.plain1 = res[5]
			this.plain1._width = this.plain1.width / 4
			this.plain1._height = this.plain1.height
			this.plain1.real_w = this.plain1._width		//	49
			this.plain1.real_y = this.plain1._height	//	35
			this.plain1.interval = 1000		//	敌机间隔
			this.plain1.speed = 3
			this.enemies = []
			//  开始游戏开关
			this.start = false;
			//	循环绘画
			requestAnimationFrame(this.loop)
		})
	}
	loop() {
		ctx.clearRect(0, 0, _self._width, _self._height)
		_self.drawBg()
		//  游戏没开始，画加载背景
		if (_self.start === false) {
			_self.loadingFn()
		} else {
			//  游戏开始，朕登场(参数说明)
			//  1、寡人,
			//	2~5、图片x轴起始位置,图片y轴起始位置,图片宽度,图片高度,
			//	6~9、画在画布上的x轴位置,画在画布上的y轴位置,画出来的宽度,画出来的高度
			ctx.drawImage(_self.me, 0, 0, _self.me._width, _self.me._height, _self.me.posX, _self.me.posY, _self.me.real_w, _self.me.real_y)
			//  循环发射子弹
			for (let i = 0; i < _self.bullet.bullets.length; i++) {
				const blt = _self.bullet.bullets[i]
				blt.y -= _self.bullet.speed;
				if (blt.y <= 0) {
					_self.bullet.bullets.splice(i, 1)
					i--
				} else {
					ctx.drawImage(blt.src, blt.x, blt.y)
				}
			}
			//	循环产生敌机
			for (let i = 0; i < _self.enemies.length; i++) {
				const plt = _self.enemies[i]
				plt.y += _self.plain1.speed;
				if (plt.y >= _self._height) {
					_self.enemies.splice(i, 1)
					i--
				} else {
					ctx.drawImage(plt.src, 0, 0, _self.plain1._width, _self.plain1._height, plt.x, plt.y, _self.plain1.real_w, _self.plain1.real_y)
				}
			}
			let guard = true		//	防止执行过快
			if (_self.start && guard) {
				guard = false
				for (let i = 0; i < _self.bullet.bullets.length; i++) {
					for (let j = 0; j < _self.enemies.length; j++) {
						const blt = _self.bullet.bullets[i];
						const plt = _self.enemies[j];
						const x_dis = blt.x - plt.x;
						const y_dis = blt.y - plt.y;
						//	如果【子单水平位置】在【敌机的左边界】和【右边界】之间，并且【垂直位置】在【敌机机头】和【机尾】之间
						if ((x_dis >= 0 && x_dis <= _self.plain1._height) && (y_dis <= 0 && y_dis > -_self.plain1._height)) {
							_self.bullet.bullets.splice(i, 1)
							i--
							_self.enemies.splice(j, 1)
							j--
							break;
						}
					}
				}
			}
			guard = true
		}
		requestAnimationFrame(_self.loop)
	}
	//  背景
	drawBg() {
		//	为了保证背景滚动效果，需要用两张背景图上下拼接，当【下面】背景图滚动超出 canvas 显示范围时，将背景图位置重置为 0 
		this.bg.top = this.bg.top >= this._height ? 0 : this.bg.top + this.bg.speed
		ctx.drawImage(this.bg, 0, this.bg.top - this._height, this._width, this._height)
		ctx.drawImage(this.bg, 0, this.bg.top, this._width, this._height)
	}
	//  加载图片
	createImg(src) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = src
			img.onload = () => {
				resolve(img)
			}
		})
	}
	//  loading 文字 / 灰机 / 开始按键
	loadingFn() {
		this.loading.left = this.loading.left >= 300 ? 300 : this.loading.left + 4
		ctx.drawImage(this.loading, this.loading.left - 200, 300)
		if (this.loading.left === 300) {
			ctx.drawImage(this.loadingText, 50, 150, 300, 70)
			startBtn.style.opacity = 1
			//  点击开始
			startBtn.onclick = () => {
				this.start = true;
				startBtn.style.opacity = 0;
				//	朕跟着鼠标走
				document.addEventListener('mousemove', e => {
					//	水平方向不过界
					//	鼠标水平坐标 - canvas 距离窗口左侧的距离 - 朕的宽度/2 < 0		因为鼠标在飞机的中心，需要的是飞机不越界而不是鼠标不越界，因此需要多让出半个身位
					if (e.pageX - cvs.offsetLeft - this.me.real_w / 2 < 0) {
						this.me.posX = 0
					} else if (e.pageX - cvs.offsetLeft - this.me.real_w / 2 >= 0 && e.pageX - cvs.offsetLeft + this.me.real_w / 2 <= this._width) {
						this.me.posX = e.pageX - cvs.offsetLeft - this.me.real_w / 2
					} else {
						this.me.posX = this._width - this.me.real_w
					}
					//	垂直方向不过界
					if (e.pageY - cvs.offsetTop - this.me.real_y / 2 < 0) {
						this.me.posY = 0
					} else if (e.pageY - cvs.offsetTop - this.me.real_y / 2 > 0 && e.pageY - cvs.offsetTop + this.me.real_y / 2 < this._height) {
						this.me.posY = e.pageY - cvs.offsetTop - this.me.real_y / 2
					} else {
						this.me.posY = this._height - this.me.real_y
					}
				}, false)
				//	创建子弹
				setInterval(() => {
					//	图片的坐标原点为左上角，
					//	因此：
					//		子弹水平位置 = 朕位置 + 朕宽度/2 - 子弹宽度/2
					//		子弹垂直位置 = 朕位置 - 子弹高度
					this.createBullets(this.me.posX + this.me.real_w / 2 - this.bullet._width / 2, this.me.posY - this.bullet._height)
				}, this.bullet.interval)
				//	创建敌机
				setInterval(() => {
					this.createPlants()
				}, this.plain1.interval)
			}
		}
	}
	//	创建子弹
	createBullets(x, y) {
		let blt = new Object()
		blt.src = this.bullet;
		blt.x = x
		blt.y = y
		this.bullet.bullets.push(blt)
	}
	//	创建敌机
	createPlants() {
		let plt = new Object()
		plt.src = this.plain1
		//	敌机位置范围 0 ~ (canvas 宽度 - 敌机宽度)
		plt.x = random(0, this._width - this.plain1._width)
		plt.y = 0
		this.enemies.push(plt)
	}
}
new Fight()

const foo = () => { }

export default foo
