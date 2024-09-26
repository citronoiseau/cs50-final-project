from dataclasses import dataclass, field

from enum import Enum

class GameState(Enum):
    SETUP = "SETUP"
    ACTIVE = "ACTIVE"
    FINISHED = "FINISHED"

@dataclass
class Player:
    id: str
    name: str
    score: int

@dataclass
class Ball:
    position_x: float
    position_y: float
    radius: float   

@dataclass
class Paddle:
    position_y: float

@dataclass
class GameStatus:
    state: str
    joined_players: list[str]
    winner: str

@dataclass
class GameInfo:
    id: str
    players: dict[str, Player] = dict
    current_player: int = 0
    winner: str = ""
    max_players: int = 2
    min_players: int = 2
    ball: Ball = field(default_factory=lambda: Ball(0, 0, 0, 0, 10))  
    left_paddle: Paddle = field(default_factory=lambda: Paddle(0))  
    right_paddle: Paddle = field(default_factory=lambda: Paddle(0))   

    def get_game_state(self) -> GameState:
        if len(self.players) < self.min_players:
            return GameState.SETUP
        elif self.winner:
            return GameState.FINISHED
        else:
            return GameState.ACTIVE

    def get_status(self) -> GameStatus:
        joined_players = [
            self.players[player_id].name for player_id in self.players.keys()
        ]
        return GameStatus(
            self.get_game_state(),
            joined_players,
            self.winner,
        )