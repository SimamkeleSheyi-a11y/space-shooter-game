SPACE SHOOTER GAME

A space shooter game made with WebGL for my computer graphics project.

HOW TO RUN

Just open index.html in any web browser. Chrome works best. No installation needed. No server needed.

HOW TO PLAY

Controls:
- Arrow Keys or WASD - Move the ship
- Spacebar - Shoot bullets

Rules:
- You start with 3 lives
- Shoot enemies to get points
- Basic enemies (red): 10 points
- Fast enemies (orange): 15 points
- Tough enemies (pink): 25 points
- If enemies reach the bottom of the screen, you lose a life
- If you crash into an enemy, you lose a life
- After losing a life, you get 1.5 seconds of invincibility (your ship blinks)
- The game gets harder with each wave
- Game over when you lose all lives


ENEMY TYPES

There are 3 types of enemies:

1. Basic Enemy (Red)
   - Diamond shape with antenna
   - Moves straight down
   - Dies in 1 hit
   - 10 points

2. Fast Enemy (Orange)
   - Diamond shape with antenna
   - Moves in a zigzag pattern using sine wave
   - Moves 1.8 times faster than basic
   - Dies in 1 hit
   - 15 points

3. Tough Enemy (Pink)
   - Same shape but 1.4 times larger
   - Moves slower (0.6 times basic speed)
   - Needs 2 hits to kill
   - 25 points


SHIP DETAILS

The player ship is made of 6 parts:
- Main fuselage (cyan)
- Cockpit (light blue)
- Left wing (cyan)
- Right wing (cyan)
- Left engine (orange)
- Right engine (orange)

The engines have a pulsing orange glow effect that animates using a sine wave.

WEAPON SYSTEM

Your ship fires 3 bullets at once in a spread pattern:
- One bullet goes straight up
- Two bullets go from the sides at slight angles
- There is a short cooldown between shots (6 frames)
- You can hold Spacebar for continuous fire

STARFIELD

The background has 200 stars. Each star has:
- Random position on screen
- Random size between 0.2 and 0.9
- Random brightness
- Unique twinkle speed and phase so they do not all flash together

PARTICLE EXPLOSIONS

When enemies are destroyed, orange particles burst outward in a circle pattern:
- Basic and fast enemies: about 20 particles
- Tough enemies: about 32 particles
- Particles fade out and shrink over time
- Maximum 200 particles at once to prevent lag

WAVE SYSTEM

- Each wave lasts about 8 seconds (500 frames)
- When a new wave starts, enemies spawn faster
- Spawn delay decreases by 2 frames per wave
- Minimum spawn delay is 15 frames
- Enemy speed also increases slightly with each wave

SOUND EFFECTS

All sounds are generated using Web Audio API oscillators (no audio files needed):
- Shooting: 880 Hz square wave
- Enemy destroyed: 400 Hz
- Tough enemy first hit: 600 Hz
- Player hit: 100 Hz
- Player death: 50 Hz
- New wave: two tones at 660 Hz then 880 Hz

INVINCIBILITY

After being hit by an enemy:
- You become invincible for 90 frames (1.5 seconds)
- Your ship blinks on and off during this time
- You cannot take damage while invincible

COLLISION DETECTION

The game checks distance between objects using the distance formula:
- Bullet vs Enemy: collision if distance is less than 0.1 units
- Player vs Enemy: collision if distance is less than 0.13 units

FILES

- index.html - The HTML file with all CSS styling
- space-shooter.js - All the game code and WebGL rendering

WEBGL FEATURES IMPLEMENTED

- Matrix transformations: identity, translate, scale, rotateZ, multiply
- Perspective projection with 45 degree field of view
- Custom vertex shader (position and color attributes)
- Custom fragment shader (outputs interpolated vertex colors)
- Vertex Buffer Objects with STATIC_DRAW for geometry
- Dynamic color buffers with DYNAMIC_DRAW
- No textures used - all coloring done through vertex colors
- Depth testing disabled - uses painter's algorithm (draw order)
- 5 separate geometry buffers: ship, enemy, bullet, star, particle
- 5 color buffers for different object types

KNOWN PROBLEMS

- Sound might not work until you click the start button (browser autoplay policy)
- Too many particles can slow down older computers
- No pause button
- No high score saving
- Screen tearing possible on some monitors

WHAT I WOULD ADD WITH MORE TIME

- A pause feature
- Boss enemies
- High score saving to localStorage
- More weapon types
- Mobile touch controls
