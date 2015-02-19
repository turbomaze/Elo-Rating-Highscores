if (Meteor.isClient) {
    Template.highscores.helpers({
        players: function() {
            var rawPlayers = Players.find({}, {sort: [
                ['rating', 'desc'], ['won', 'desc'],
                ['lost', 'asc'], ['drawn', 'desc']
            ]});

            //format their win-draw-lose records
            var players = rawPlayers.map(function(player) {
                player.won = player.won || 0;
                player.lost = player.lost || 0;
                player.drawn = player.drawn || 0;
                return player;
            });

            return players;
        },
        games: function() {
            var rawGames = Games.find({}, {sort: {createdAt: -1}, limit: 6});
            var games = rawGames.map(function(game) {
                var player1 = Players.findOne(game.p1id);
                var player2 = Players.findOne(game.p2id);
                var name1 = game.p1id;
                var name2 = game.p2id;
                if (player1 !== undefined) name1 = player1.name
                if (player2 !== undefined) name2 = player2.name
                var verb = (parseFloat(game.score) === 1) ? 'beat' : 'drew';

                return {
                    name1: name1,
                    verb: verb,
                    name2: name2
                };
            });
            return games;
        }
    });
}