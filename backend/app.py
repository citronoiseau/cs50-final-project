from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_caching import Cache
from data.game_info import Player, GameInfo
from random import randint
from uuid import uuid4

test_game_id = "aaa-aaa-aaa"

app = Flask(__name__)
socketio = SocketIO(app)
CORS(app)

config = {
    "CACHE_TYPE": "FileSystemCache",
    "CACHE_DEFAULT_TIMEOUT": 86400,  # in seconds, keep a game around for 24 hours max.
    "CACHE_THRESHOLD": 10000,  # increasing the default (500) to support more active games.
    "CACHE_DIR": "/tmp",
}


# tell Flask to use the above defined config
app.config.from_mapping(config)
game_cache = Cache(app)


def rand_xyz() -> str:
    a, z = ord("a"), ord("z")
    return "".join(chr(randint(a, z)) for _ in range(0, 3))


def test_uuid(ch: str) -> str:
    return f"{ch * 8}-{ch * 4}-{ch * 4}-{ch * 4}-{ch * 12}"

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


def new_game():
    id = test_game_id  # test id
    while id and game_cache.has(id):
        id = f"{rand_xyz()}-{rand_xyz()}-{rand_xyz()}"
    game = GameInfo(id)
    player1_id = test_uuid("a") if game.id == test_game_id else str(uuid4())
    player1 = Player(player1_id, "Player 1")
    game.players[player1.id] = player1
    game_cache.set(id, game)
    return {"id": id, "player": player1}

@app.route("/join_game/<id>")
def join_game(id: str):
    if not game_cache.has(id):
        raise RuntimeError(f"Game {id} does not exists.")
    game: GameInfo = game_cache.get(id)
    if len(game.players) == game.max_players:
        raise RuntimeError(f"Game {id} is full.")
    player2_id = test_uuid("b") if game.id == test_game_id else str(uuid4())
    player2 = Player(player2_id, "Player 2")
    game.players[player2.id] = player2
    game_cache.set(id, game)
    return {"id": id, "player": player2}

# Handle paddle and ball movement
@socketio.on("update_game_state_left")
def handle_left_player_update(data):
    game_id = data["game_id"]
    paddle_data = data["paddle"] 
    ball_data = data["ball"] 
    

    game: GameInfo = game_cache.get(game_id)
    if game:
        game.left_paddle = paddle_data["position"]  
        game.ball.position_x = ball_data["position_x"] 
        game.ball.position_y = ball_data["position_y"]  
        
        emit("game_state_updated", {
            "ball": {
                "position_x": game.ball.position_x,
                "position_y": game.ball.position_y
            },
            "left_paddle": game.left_paddle
        }, broadcast=True)

@socketio.on("update_game_state_right")
def handle_right_player_update(data):
    game_id = data["game_id"]
    paddle_data = data["paddle"]  

    game: GameInfo = game_cache.get(game_id)
    if game:
        game.right_paddle = paddle_data["position"]  
        
        emit("game_state_updated", {
            "right_paddle": game.right_paddle
        }, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)