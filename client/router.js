Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function() {
    document.title = 'Highscores - OHS Chess';
    this.render('Highscores', {
        name: 'Highscores'
    });
});

Router.route('/games', function() {
    document.title = 'Games - OHS Chess';
    this.render('Games', {
        name: 'Games'
    });
});

Router.route('/calculate-wld', function() {
    var players = Players.find({});
    players.forEach(function(player) {
        var won = Games.find({
            p1id: player._id, score: 1
        }).count();
        var lost = Games.find({
            p2id: player._id, score: 1
        }).count();
        var drawn = Games.find({
            p1id: player._id, score: 0.5
        }).count();
        drawn += Games.find({
            p2id: player._id, score: 0.5
        }).count();

        Players.update(player._id, {
            $set: {won: won, lost: lost, drawn: drawn}
        });
    });
});