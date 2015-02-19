if (Meteor.isClient) {
    Template.games.helpers({
        players: function() {
            return Players.find({}, {sort: {name: 1}});
        }
    });

    Template.games.events({
        'submit #add-player': function(e) {
            var playersName = e.target.name.value;
            Players.insert({
                name: playersName,
                rating: 1200,
                numGames: 0,
                won: 0,
                lost: 0,
                drawn: 0,
                createdAt: new Date()
            });

            e.target.name.value = '';
            return false;
        },
        'change #playertoedit': function(e) {
            var player = Players.findOne({
                name: document.getElementById('playertoedit').value
            });

            if (typeof player === 'undefined') {
                document.getElementById('newname').value = '';
                document.getElementById('newrating').value = '';
                document.getElementById('newnumgames').value = '';
                document.getElementById('newnumwon').value = '';
                document.getElementById('newnumlost').value = '';
                document.getElementById('newnumdrawn').value = '';
            } else {
                document.getElementById('newname').value = player.name;
                document.getElementById('newrating').value = player.rating;
                document.getElementById('newnumgames').value = player.numGames;
                document.getElementById('newnumwon').value = player.won || 0;
                document.getElementById('newnumlost').value = player.lost || 0;
                document.getElementById('newnumdrawn').value = player.drawn || 0;
            }
        },
        'submit #edit-player': function(e) {
            var player = Players.findOne({name: e.target.name.value});
            var updateObj = {};
            if (e.target.newname.value.length !== 0) {
                updateObj['name'] = e.target.newname.value;
            }
            if (e.target.newrating.value.length !== 0) {
                updateObj['rating'] = parseInt(e.target.newrating.value);
            }
            if (e.target.newnumgames.value.length !== 0) {
                updateObj['numGames'] = parseInt(e.target.newnumgames.value);
            }
            if (e.target.newnumwon.value.length !== 0) {
                updateObj['won'] = parseInt(e.target.newnumwon.value);
            }
            if (e.target.newnumlost.value.length !== 0) {
                updateObj['lost'] = parseInt(e.target.newnumlost.value);
            }
            if (e.target.newnumdrawn.value.length !== 0) {
                updateObj['drawn'] = parseInt(e.target.newnumdrawn.value);
            }

            Players.update(player._id, {
                $set: updateObj
            });

            e.target.name.value = '';
            e.target.newname.value = '';
            e.target.newrating.value = '';
            e.target.newnumgames.value = '';
            e.target.newnumwon.value = '';
            e.target.newnumlost.value = '';
            e.target.newnumdrawn.value = '';

            return false;
        },
        'submit #record-game': function(e) {
            var player1 = Players.findOne({name: e.target.player1.value});
            var player2 = Players.findOne({name: e.target.player2.value});

            var A1 = parseFloat(e.target.score.value); //actual score 
            var A2 = 1 - A1;
            var K1 = Math.max(48 - (16/5)*player1.numGames, 32);
            var K2 = Math.max(48 - (16/5)*player2.numGames, 32);
            var R1 = player1.rating;
            var R2 = player2.rating;
            var E1 = 1/(1+Math.pow(10, (R2 - R1)/400));
            var E2 = 1/(1+Math.pow(10, (R1 - R2)/400));

            var newR1 = Math.round(R1+K1*(A1 - E1));
            var updateObj1 = {numGames: 1};
            if (A1 === 1) updateObj1['won'] = 1;
            else if (A1 === 0.5) updateObj1['drawn'] = 1;
            else updateObj1['lost'] = 1;
            Players.update(player1._id, {
                $set: {rating: newR1},
                $inc: updateObj1
            });

            var newR2 = Math.round(R2+K2*(A2 - E2));
            var updateObj2 = {numGames: 1};
            if (A2 === 1) updateObj2['won'] = 1;
            else if (A2 === 0.5) updateObj2['drawn'] = 1;
            else updateObj2['lost'] = 1;
            Players.update(player2._id, {
                $set: {rating: newR2},
                $inc: updateObj2
            });

            Games.insert({
                p1id: player1._id,
                p2id: player2._id,
                score: A1, //player1's score
                createdAt: new Date()
            });

            e.target.player1.value = '';
            e.target.score.value = 1;
            e.target.player2.value = '';
            return false;
        },
        'submit #remove-player': function(e) {
            var player = Players.findOne({name: e.target.name.value});
            if (typeof player !== 'undefined') Players.remove(player._id);
        }
    });
}