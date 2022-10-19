const scoreEl = document.querySelector('#score')
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
    constructor() {
        //  const randomX =  -)
        //  const randomY = Math.floor(Math.random() * (canvas.height / 2 - 179.2) + 100)

        this.velocity = {
            x: 3,
            y: 0
        }
        
        const image = new Image()
        image.src = './img/invader.png'
        image.onload = () => {
            const scale = 0.4
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
                x: Math.floor(Math.random() * 300 + 200),
                y: Math.floor(Math.random() * (canvas.height / 2 - this.height))
            }
        }
    }

    draw() {
        // context.fillStyle = 'red';
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
        if(this.position.x > canvas.width) {
            console.log('here');
        }
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        
    }

    update() {
        if(this.image) {
            this.draw()
            this.position.x += this.velocity.x 
            this.position.y += this.velocity.y
            this.velocity.y = 0
            
            if(this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x
                this.velocity.y = 179.2
            }
        }
    }
}

class Particle {
    constructor( {position, velocity, radius, color }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = this.color
        context.fill()
        context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const player = new Player()
const projectiles = []
const invaders = []
const particles = []

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
let score = 0;

for (let i = 0; i < 150; i++) {
    particles.push(
        new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: 1,
            },
            radius: Math.random() * 2,
            color: 'white'
        }))
} 

function animate() {
    requestAnimationFrame(animate);
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    
    particles.forEach(particle => {
        if(particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }
        particle.update()
    })

    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + 31 <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })
    invaders.forEach((invader, i) => {
        invader.update()

        projectiles.forEach((projectile, p) => {
            if(projectile.position.y - 31 <= invader.position.y + invader.height && 
                projectile.position.x + 31 >= invader.position.x && 
                projectile.position.x - 31 <= invader.position.x + invader.width &&
                projectile.position.y + 31 >= invader.position.y) {
                setTimeout(() => {
                    const invaderFound = invaders.find(invader2 =>invader2 === invader)
                    const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)
                    
                    if(invaderFound && projectileFound) {
                        score += 150
                        scoreEl.innerHTML = score;
                        invaders.splice(i, 1);
                        projectiles.splice(p, 1);
                    }
                }, 1)
            }
        })

        if(invader.position.y - 2 *invader.height > canvas.height) {
            setTimeout(() => {
                 invaders.splice(i, 1)
            })
         }
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
        invaders.push(new Invader())
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