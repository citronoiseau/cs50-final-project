# WEB ONLINE PING PONG GAME
#### Video Demo: https://youtu.be/dFfTTTl7NfQ
#### Description:

##### Frontend:
The project consists of two parts, frontend (which is here) and backend: https://github.com/citronoiseau/pingpong-backend.

You can generally play locally (with your friend or bot), or online.  Let's start with the general structure of the front end. The game's core is 4 classes, such as ball, board, paddle and player. 
They are all used in two modules, controller.js (which is used for local games) and multiplayer.js. They resemble each other in some way but still use different parts to operate the game loop, that's why 
I decided to keep them separated. To display the game I use canvas API that provides smooth gameplay. 

Let's start with the ball class. It has functions to move itself, detect collisions, and win situations. The collision system is not perfect yet, but it still can calculate angles at which
the ball should go: more or less straight if it hits the centre of a paddle, and at a sharper angle if it hits the bottom or top part. 

Then we have board class, which is more or less simple, its main idea is to hold all instances of players in one place. Also, it just holds round information.

The paddle class is simple too: it also checks for collision (but with the board this time) and has functions for moving. 

The last one is the player class, which is used to track scores and hold paddle and ball classes.

Now let's proceed to the controller.js. It has three main functions, a controller to initialize the game and classes, a start countdown to count down between rounds and game loop, and a function that draws all of the movements.
And multiplayer.js has more or less the same logic, but it uses a socket to connect to the backend server and send or receive updates. Moreover, I'm locking the game FPS to 59, because the hosted server is not that fast to send 
constant updates, so the game flow is not as smooth. I'm also using binary decoder to speed up the process of retrieving data.

In my game logic, the player who starts the game is the host. They send ball data and left paddle data to the socket, and only receive right paddle data. That's why, for example, the function to move the ball is locked for another player. The main difference between these two modules is that the game loop, countdown and initialize game uses socket and fetching to receive data. It can receive three updates, of data.left_paddle (which consists
of left paddle and ball), data.right_paddle (which consists only of the right paddle), and game_result which the player can receive at the end of the game, or when another player disconnects too early.
There are also a couple of helper functions, that are the same across two modules, to display the winner, to drawText (for score), to control paddles and to update the score.

In general, that's all for the main game. DOM consists of four screens and, a start menu where you can choose between two game mods and read how to control your paddle. Then there are local menu, where you can choose
between playing with your friend on one computer or playing with the bot. In the online menu, you can either create a new game or join one. When you create a game, you can copy the game URL, and your friend can just paste the link
into the browser, and play with you. 

There are also some helpers, such as different dialogues, for example for the player to choose the maximum amount of rounds, dialogue while the player is waiting for the friend, and dialogue to simply create the game. There are also 
some functions that I'm using across all modules, such as toast notifications, removeChildren (to switch between screens) and create.js, which is used to create DOM elements easier.


##### Backend:

There are only two main modules, app.py which is the server logic itself, and gameInfo.py which holds the game information, such as different classes (but they do not hold as much information as in frontend), that
are used mostly to keep track of movement. For that, I'm using Flask and SocketIO. The main class in-game info, where you can find functions to retrieve game state. I'm using it mostly to check if two players are joined to start a new game. 

app.py uses eventlet and simple cache to speed up the server. It keeps the game in the cache for around one hour. Then there are simple flask functions, to create a new game and set unique IDs for both game and the player.
Then there is the join game function, which again sets a unique id for another player. Then there is a status function, that uses using a function from gameInfo.py to tell the game if all players have joined already. 

There starts the socket part. The first two functions are fairly simple, they just check connection and disconnection from the server. Then we have handle_left_player_update, which receives the game state from the host, such as 
ball and paddle, but sometimes also rounds and winner. It's also locked, but to 120 fps this time, because I still want to improve server speed. There goes a similar function handle_right_player_update,
but this time it just receives the right paddle update. The last one is used to check pauses to place a countdown between different rounds.


