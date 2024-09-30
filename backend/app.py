from flask import Flask, request
from flask_socketio import SocketIO, emit, disconnect
from flask_cors import CORS
from flask_caching import Cache
from data.gameInfo import Player, GameInfo
from random import randint
from uuid import uuid4
from dataclasses import asdict

test_game_id = "aaa-aaa-aaa"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}}) 
socketio = SocketIO(app, cors_allowed_origins="http://localhost:8080")  

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


@app.route("/new_game")
def new_game():
    id = test_game_id  # test id
    while id and game_cache.has(id):
        id = f"{rand_xyz()}-{rand_xyz()}-{rand_xyz()}"
    game = GameInfo(id)
    player1_id = test_uuid("a") if game.id == test_game_id else str(uuid4())
    player1 = Player(player1_id, "host", "Player 1", 0)
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
    player2 = Player(player2_id, "guest", "Player 2", 0)
    game.players[player2.id] = player2
    game_cache.set(id, game)
    return {"id": id, "player": player2}


@app.route("/status/<id>")
def status(id: str):
    if not game_cache.has(id):
        raise RuntimeError(f"Game {id} does not exists.")
    return asdict(game_cache.get(id).get_status())


@socketio.on('connect')
def handle_connect():
    id = request.args.get('id')  
    if not id or not game_cache.has(id):
        print(f"Game ID {id} is invalid or missing.")
        disconnect()  
    else:
        print(f"Player connected to game {id}")


@socketio.on("update_game_state_left")
def handle_left_player_update(data):
    id = request.args.get('id')  
    paddle_data = data["paddle"] 
    ball_data = data["ball"] 
    

    game: GameInfo = game_cache.get(id)
    if game:
        game.left_paddle = paddle_data["position"]  
        game.ball.position_x = ball_data["position_x"] 
        game.ball.position_y = ball_data["position_y"]  
        game.rounds = data["rounds"]
        scores_data = data["scores"] 
        winner = data["winner"]

        if len(scores_data) == 2:
            player_ids = list(game.players.keys()) 
            if len(player_ids) == 2:
                game.players[player_ids[0]].score = scores_data[0]  
                game.players[player_ids[1]].score = scores_data[1]   

        if winner:  
            game.winner = winner
        

        emit("game_state_updated", {
            "ball": {
                "position_x": game.ball.position_x,
                "position_y": game.ball.position_y
            },
            "left_paddle": game.left_paddle,
            "scores": [game.players[player_ids[0]].score, game.players[player_ids[1]].score]  if len(player_ids) == 2 else [0, 0],
            "rounds": game.rounds,
            "winner": game.winner,
        }, broadcast=True)



@socketio.on("update_game_state_right")
def handle_right_player_update(data):
    id = request.args.get('id')  
    paddle_data = data["paddle"]  

    game: GameInfo = game_cache.get(id)
    if game:
        game.right_paddle = paddle_data["position"]  
        
        emit("game_state_updated", {
            "right_paddle": game.right_paddle
        }, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)


@socketio.on("game_pause_updated")
def handle_board_pause(data):
    id = request.args.get('id') 
    isPaused = data["isPaused"]

    game: GameInfo = game_cache.get(id)
    if game:
        game.isPaused = isPaused
        
        emit("game_pause_updated", {
            "isPaused": game.isPaused
        }, broadcast=True)


