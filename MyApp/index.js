const canvas = document.querySelector('canvas') //selecting canvas
const c = canvas.getContext('2d') //setting canvas to 2d

canvas.width = 1024 //setting width 
canvas.height = 576 //setting height

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite ({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite ({
    position: {
        x: 635,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter ({
    position: {
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    offset:
    {
        x:0,
        y:0
    },
    imageSrc: './img/Martial Hero 3/Sprite/Idle.png',
    framesMax: 10,
    scale: 2.5,
    offset: {
        x: 110,
        y: 50
    },
    sprites: {
        idle: {
            imageSrc: './img/Martial Hero 3/Sprite/Idle.png',
            framesMax: 10
        },
        run: {
            imageSrc: './img/Martial Hero 3/Sprite/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Martial Hero 3/Sprite/Going Up.png',
            framesMax: 3
        },
        fall: {
            imageSrc: './img/Martial Hero 3/Sprite/Going Down.png',
            framesMax: 3
        },
        attack1: {
            imageSrc: './img/Martial Hero 3/Sprite/Attack1.png',
            framesMax: 7
        },
        takeHit: {
            imageSrc: './img/Martial Hero 3/Sprite/Take Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Martial Hero 3/Sprite/Death.png',
            framesMax: 11
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 103,
        height: 50
    }
})

player.draw()

const enemy = new Fighter ({
    position:{
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y:0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

console.log(player)

const keys = {
    a: {
        pressed: false
    }, 
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastkey == 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastkey == 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastkey == 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastkey == 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && 
        player.framesCurrent === 4
        ) {
        enemy.takeHit()
        player.isAttacking = false
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 5) {
        player.isAttacking = false
    }
    
    //if player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
        ) {
        player.takeHit()
        enemy.isAttacking = false
        //document.querySelector('#playerHealth').style.width = player.health + '%'
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    //if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //end game based on health
    if (enemy.health <= 0 | player.health <= 0) {
        determineWinner({player, enemy, timerID})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!enemy.dead) {
        switch(event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastkey ='ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastkey ='ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }

    if (!player.dead) {
        switch(event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastkey ='d'
                break
            case 'a':
                keys.a.pressed = true
                player.lastkey ='a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})