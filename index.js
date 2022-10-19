const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {
        

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        
        const image = new Image()
        image.src = './img/spaceship.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            
            console.log(this.width)
            console.log(this.height)
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        // context.fillStyle = 'red';
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.save()
        context.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        context.rotate(this.rotation)
        context.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        
        context.restore()
    }

    update() {
        if(this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        
        this.radius = 3

        const image = new Image()
        image.src = './img/penis.png'
        image.onload = () => {
            const scale = .1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
        }
    }

    draw() {
        context.beginPath()
        // context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        // context.fillStyle = 'red'
        // context.fill()
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        context.closePath()
    }

    update() {
        if(this.image) {
        this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }
        
        const image = new Image()
        image.src = './img/invader.png'
        image.onload = () => {
            const scale = .4
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            console.log(this.width)
            console.log(this.height)

            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        // context.fillStyle = 'red';
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}) {
        if(this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
}

class Grid {
    constructor() {
        const randomX = Math.floor(Math.random()* canvas.width - 113.2)
        const randomY = Math.floor(Math.random() * (canvas.height / 2 - 179.2))

        this.position = {
            x: randomX,
            y: randomY
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []
        this.width = 113.2

        this.invaders.push(new Invader({position: {
            x: randomX,
            y: randomY
        }}))
    }
    
    update() {
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y
        this.velocity.y = 0
        
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 179.2
        } 
    }
}

const player = new Player()
const projectiles = []
const grids = []

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0;
let randomInterval = Math.floor(Math.random() * 1500 + 1500);

function animate() {
    requestAnimationFrame(animate);
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + 31 <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })
    grids.forEach((grid, g) => {
        grid.update()
        grid.invaders.forEach((invader, i) => {
            invader.update({
                velocity: grid.velocity
            })

            projectiles.forEach((projectile, p) => {
                if(projectile.position.y - 31 <= invader.position.y + invader.height && 
                    projectile.position.x + 31 >= invader.position.x && 
                    projectile.position.x - 31 <= invader.position.x + invader.width &&
                    projectile.position.y + 31 >= invader.position.y) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 =>invader2 === invader)
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)
                        
                        if(invaderFound && projectileFound) {
                            grid.invaders.splice(i, 1);
                            projectiles.splice(p, 1);
                            grids.splice(g, 1)
                            console.log(grids)

                            if(grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x
                            }
                        }
                    }, 0)
                }
            })
        })
    })

    const speed = 8;
    if(keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -Math.abs(speed)
        player.rotation = -.15
    } else if(keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = speed
        player.rotation = .15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    if(frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = 100
        frames = 0
    }

    frames++
}


animate();

addEventListener('keydown', ({ key }) => {
    switch(key) {
        case 'a': 
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        
    }
})

addEventListener('keyup', ({ key }) => {
    switch(key) {
        case 'a': 
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2 - 25,
                    y: player.position.y - 30
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }));
            break
    }
})