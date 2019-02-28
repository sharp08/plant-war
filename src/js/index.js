import bg from "@images/bg"     //  背景图
import loading from "@images/loading"   //  加载动画
import loadingText from "@images/loadingText"   //  加载文字
import bullet from "@images/bullet" //  子弹
import me from "@images/me"     //  朕

const box = document.querySelector('#id')
const cvs = document.querySelector("canvas")
const startBtn = document.querySelector(".startBtn")

const ctx = cvs.getContext("2d")

let _self;

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
			this.createImg(me)
		]).then(res => {
			this.bg = res[0]
			this.loading = res[1]
			this.loadingText = res[2]

			this.bullet = res[3]
			this.bullet.bullets = []

			this.me = res[4]

			this.me.posX = 200
			this.me.posY = 500

			this.bg.top = 0
			this.loading.left = 0
			//  开始游戏
			this.start = false;

			requestAnimationFrame(abc)
			function abc() {
				ctx.clearRect(0, 0, 400, 600)
				_self.drawBg()
				//  游戏没开始，画加载背景
				if (_self.start === false) {
					_self.loadingFn()
				}
				//  游戏开始，朕登场
				if (_self.start) {
					ctx.drawImage(_self.me, 0, 0, 490 / 5, 122, _self.me.posX, _self.me.posY, 50, 50)

				}
				//  子弹
				if (_self.start) {
					_self.tem += 2

					for (let i = 0; i < _self.bullet.bullets.length; i++) {
						const blt = _self.bullet.bullets[i]
						blt.y -= 2;
						if (blt.y <= 0) {
							_self.bullet.bullets.splice(i, 1)
						} else {
							ctx.drawImage(blt.src, blt.x, blt.y)
						}
					}
				}
				requestAnimationFrame(abc)
			}
		})
	}
	//  背景
	drawBg() {
		this.bg.top = this.bg.top >= 600 ? 0 : this.bg.top + 2
		ctx.drawImage(this.bg, 0, this.bg.top - 600, 400, 600)
		ctx.drawImage(this.bg, 0, this.bg.top, 400, 600)
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
				let x, y;
				document.addEventListener('mousemove', e => {
					//	水平方向不过界
					if (e.pageX - cvs.offsetLeft - 25 < 0) {
						this.me.posX = 0
					} else if (e.pageX - cvs.offsetLeft - 25 >= 0 && e.pageX - cvs.offsetLeft + 25 <= 400) {
						this.me.posX = e.pageX - cvs.offsetLeft - 25
					} else {
						this.me.posX = 350
					}
					//	垂直方向不过界
					if (e.pageY - cvs.offsetTop - 25 < 0) {
						this.me.posY = 0
					} else if (e.pageY - cvs.offsetTop - 25 > 0 && e.pageY - cvs.offsetTop + 25 < 600) {
						this.me.posY = e.pageY - cvs.offsetTop - 25
					} else {
						this.me.posY = 550
					}
				}, false)
				setInterval(() => {
					this.createBullets(this.me.posX + 25 - 4, this.me.posY - 18)
				}, 1000)
			}
		}
	}
	createBullets(x, y) {
		let blt = new Object()
		blt.src = this.bullet;
		blt.x = x
		blt.y = y
		this.bullet.bullets.push(blt)
		console.log(this.bullet.bullets)
	}


}
new Fight()











const foo = () => { }

export default foo
