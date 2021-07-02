from app import app, db
from app.models import Card
from datetime import datetime
from flask import render_template, url_for, flash, redirect, jsonify

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/blackjack')
def blackjack():
    return render_template('blackjack.html')

@app.route('/craps')
def craps():
    return render_template('craps.html')

@app.route('/initial_setup')
def initial_setup():
    all_cards = Card.query.all()
    for c in all_cards:
        db.session.delete(c)
    db.session.commit()
    card_names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    card_values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
    card_paths = []
    for card_name in card_names:
        card_paths.append(url_for('static', filename=f'imgs/{card_name}.png'))
    for index, card_name in enumerate(card_names):
        card = Card(name=card_name, value=card_values[index], img_path=card_paths[index])
        db.session.add(card)
    db.session.commit()
    return 'Database updated'

@app.route('/get_cards')
def get_cards():
    cards = Card.query.all()
    card_info = []
    for card in cards:
        card_info.append({
            'name': card.name,
            'value': card.value,
            'img_path': card.img_path
        })
    return jsonify(card_info)