d3.json('/get_cards').then(function(data) {
    console.log(data);
    var card_placeholder = d3.select("#card_placeholder");
    var add_player = d3.select("#add_player");
    var reset_cards = d3.select("#reset_cards");
    var accept_bets = d3.select("#accept_bets");
    var payout_winnings = d3.select("#payout_winnings");
    add_player
        .on("click", function() {
            AddPlayer(card_placeholder, data);
        });
    reset_cards
        .on("click", function() {
            ResetCards();
        });
    accept_bets
        .on("click", function() {
            AcceptBets();
        });
    payout_winnings
        .on("click", function() {
            PayoutWinnings();
        });
    AddPlayer(card_placeholder, data);        
    AddPlayer(card_placeholder, data, "Josh", "500", "10000");
    AddPlayer(card_placeholder, data, "Joshie", "750", "10000");
    AddPlayer(card_placeholder, data, "Alex", "1000", "10000");
    AddPlayer(card_placeholder, data, "Evan", "1000", "10000");
});

function AddPlayer(card_placeholder, data, player_name="", bet="0", chips="0") {
    var card_div = card_placeholder
        .append("div")
        .classed("player col-md-4", true)
        .style("width", "50%")
        .style("height", "500px")
        .style("border-style", "solid");
    var cards_total = card_div
        .append("div")
        .classed("total", true);
    card_div
        .append("div")
        .classed("payout", true);
    var card_div_cards = card_div
        .append("div")
        .classed("row", true);
    var name_input = card_div
        .append("div")
        .classed("form-group", true);
    name_input
        .append("label")
        .text("Name ");
    name_input
        .append("input")
        .classed("form-control name", true)
        .property("value", player_name);
    var bet_input = card_div
        .append("div")
        .classed("form-group", true);
    bet_input
        .append("label")
        .text("Bet ");
    bet_input
        .append("input")
        .classed("form-control bet", true)
        .property("value", bet);
    var chips_input = card_div
        .append("div")
        .classed("form-group", true);
    chips_input
        .append("label")
        .text("Chips ");
    chips_input
        .append("input")
        .classed("form-control chips", true)
        .property("value", chips);
    var card_input = card_div
        .append("input")
        .classed("form-control card-input", true);
    card_div
        .append("div")
        .classed("btn btn-primary", true)
        .text("Add Card")
        .on("click", function() {
            AddCard(card_div_cards, card_input, cards_total, data);
        });
    card_div
        .append("div")
        .classed("btn btn-primary", true)
        .text("Remove Card")
        .on("click", function() {
            RemoveCard(card_div, card_div_cards, cards_total);
        });
    card_div
        .append("div")
        .classed("btn btn-primary remove-player", true)
        .text("Remove Player")
        .on("click", function() {
            RemovePlayer(card_div);
        });
    card_div
        .append("div")
        .classed("btn btn-primary surrender", true)
        .style("visibility", "hidden")
        .text("Surrender")
        .on("click", function() {
            Surrender(card_div, card_div_cards, cards_total);
        });
    card_div
        .append("div")
        .classed("btn btn-primary double-down", true)
        .style("visibility", "hidden")
        .text("Double Down")
        .on("click", function() {
            DoubleDown(card_div);
        });
    card_div
        .append("div")
        .classed("btn btn-primary split", true)
        .style("visibility", "hidden")
        .text("Split")
        .on("click", function() {
            Split(card_div, card_div_cards, cards_total, card_placeholder, data);
        });
}

function Split(card_div, card_div_cards, cards_total, card_placeholder, data) {
    AddPlayer(card_placeholder, data, player_name=card_div.select('.name').node().value, bet=card_div.select('.bet').node().value)
    card_div.select('.chips').node().value = parseInt(card_div.select('.chips').node().value) - parseInt(card_div.select('.bet').node().value);
    var new_player = d3.selectAll(".player:last-of-type");
    var new_player_card_input = new_player.select('.card-input')
    new_player_card_input.node().value = card_div.select('.card-input').node().value.split(',')[1] ? card_div.select('.card-input').node().value.split(',')[1] : card_div.select('.card-input').node().value;
    AddCard(new_player.select('.row'), new_player_card_input, new_player.select('.total'), data);
    RemoveCard(card_div, card_div_cards, cards_total);
}

function DoubleDown(card_div) {
    bet = parseInt(card_div.select('.bet').node().value);
    chips = parseInt(card_div.select('.chips').node().value);
    card_div.select('.bet').node().value = bet * 2;
    card_div.select('.chips').node().value = chips - bet;
    card_div.select('.double-down').style('visibility', 'hidden');
    card_div.select('.surrender').style('visibility', 'hidden')
}

function ResetCards() {
    d3.selectAll(".cards").remove();
    cards_totals = d3.selectAll(".total").nodes();
    cards_totals.forEach(total => {
        cards_total = d3.select(total);
        cards_total.attr("total", 0);
        cards_total.text(`Total: 0`);
    });
}

function RemoveCard(card_div, card_div_cards, cards_total) {
    card_div_cards.selectAll(".cards:last-of-type").remove();
    var cards = card_div.selectAll(".cards").nodes();
    var values = [];
    cards.forEach(element => {
        values.push(parseInt(d3.select(element).attr("value")));
    });
    total = CalculateTotal(values);
    cards_total.attr("total", total);
    cards_total.text(`Total: ${total}`);
    CalculateBJPayout();
}

function AddCard(card_div, card_input, cards_total, data) {
    try {
        if (card_input.node().value.includes(',')) {
            cards = card_input.node().value.split(',');
            for (i=0; i<cards.length; i++) {
                card = data[parseInt(cards[i])-1];
                GetCardByValue(card, card_div);
            }
        } else {
            card = data[parseInt(card_input.node().value)-1];
            GetCardByValue(card, card_div);
        }
        var values = [];
        var cards = card_div.selectAll(".cards").nodes();
        cards.forEach(element => {
            values.push(parseInt(d3.select(element).attr("value")));
        });
        var total = CalculateTotal(values);
        cards_total.attr("total", total);
        cards_total.text(`Total: ${total}`);
        CalculateBJPayout();
    } catch {
        card_div.select(".col-md-4:last-of-type").remove();
    }

}

function GetCardByValue(card, card_div) {
    var card_area = card_div
        .append("div")
        .classed("col-md-4 cards", true)
        .attr("value", parseInt(card.value))
        .attr("name", card.name)
        .style("width", "75px")
        .style("height", "125px");
    card_area
        .append("object")
        .attr("data", card.img_path)
        .attr("type", "image/svg+xml")
        .attr("width", "70px")
        .attr("height", "120px");
    card_area
        .append("div")
        .text(card.name);
}

function CalculateTotal(values) {
    var total = 0;
    values.forEach(value => {
        total += value
    });
    if (total > 21 && values.includes(11)) {
        values[values.indexOf(11)] = 1;
        total = CalculateTotal(values)
    } else if (total > 21) {
        total = `${total} - BUSTED`;
    }
    return total;
}

function CalculateBJPayout() {
    var dealer = d3.selectAll(".player:first-of-type");
    dealer_cards = dealer.selectAll('.cards').nodes().length;
    dealer_total = parseInt(dealer.select('.total').attr('total'));
    dealer_blackjack = determineBlackjack(dealer_cards, dealer_total);
    players = d3.selectAll(".player");
    console.log(players);
    players.each(function(d, i) {
        player = d3.select(this);
        player_nodes = player.selectAll('.cards').nodes();
        player_values = [];
        card_names = [];
        for (i=0;i<player_nodes.length;i++) {
            player_values.push(parseInt(d3.select(player_nodes[i]).attr("value")));
            card_names.push(d3.select(player_nodes[i]).attr("name"));
        }
        if (player_nodes.length === 2) {
            player.select(".surrender").style("visibility", "visible");
            player.select(".double-down").style("visibility", "visible");
            if (player_values[0] === player_values[1] || card_names[0] === card_names[1]) {
                player.select(".split").style("visibility", "visible");
            }
        } else {
            player.select(".surrender").style("visibility", "hidden");
            player.select(".double-down").style("visibility", "hidden");
            player.select(".split").style("visibility", "hidden");
        }
        player_total = parseInt(player.select('.total').attr('total'));
        player_blackjack = determineBlackjack(player_nodes.length, player_total);
        player_bet = parseInt(player.select('.bet').node().value);
        if (player_blackjack && dealer_blackjack) {
            payout = player_bet;
        } else if (player_blackjack) {
            payout = player_bet * 2.5;
        } else if (player_total > 21) {
            payout = 0;
        } else if (dealer_total > 21 || player_total > dealer_total) {
            payout = player_bet * 2;
        } else if (player_total === dealer_total) {
            payout = player_bet;
        } else {
            payout = 0;
        }
        player.select('.payout').text(`Payout: ${payout}`);
        player.select('.payout').attr('value', payout);
    });
}

function AcceptBets() {
    bets = d3.selectAll('.bet').nodes();
    chips = d3.selectAll('.chips').nodes();
    bets.forEach((bet, i) => {
        amount_bet = parseInt(bet.value);
        chips_amount = parseInt(chips[i].value);
        if (chips_amount >= amount_bet) {
            chips[i].value = chips_amount - amount_bet;
        } else {
            bet.value = chips_amount;
            chips[i].value = 0;
        }
    });
}

function PayoutWinnings() {
    payouts = d3.selectAll('.payout').nodes();
    chips = d3.selectAll('.chips').nodes();
    names = d3.selectAll('.name').nodes();
    counts = {};
    payouts.forEach((payout, i) => {
        payout_amount = parseInt(payout.textContent.split(':')[1]);
        chips_amount = parseInt(chips[i].value);
        counts[names[i].value] = counts[names[i].value] ? counts[names[i].value] + chips_amount + payout_amount : chips_amount + payout_amount;
        chips.value = counts[names[i].value];
    });
    console.log(counts);
    for ([key,value] of Object.entries(counts)) {
        player_divs = d3.selectAll('.player').filter(function() {
            return player = d3.select(this).select('.name').property("value") == key;
        });
        console.log(player_divs);
        for (var i=0; i<player_divs.nodes().length; i++) {
            if (i === 0) {
                d3.select(player_divs.nodes()[i]).select('.chips').node().value = value;
            } else {
                RemovePlayer(d3.select(player_divs.nodes()[i]))
            }
        }
    }

}

function determineBlackjack(cards, total) {
    if (cards === 2 && parseInt(total) === 21) {
        return true;
    } else {
        return false;
    }
}

function Surrender(card_div) {
    cards = card_div.selectAll('.cards').remove();
    player_bet = parseInt(card_div.select('.bet').node().value);
    chips = parseInt(card_div.select('.chips').node().value);
    card_div.select('.chips').node().value = chips + Math.floor(player_bet * 0.5);
    card_div.select('.surrender').style('visibility', 'hidden')
    card_div.select('.double-down').style('visibility', 'hidden');
}

function RemovePlayer(card_div) {
    card_div.remove();
}