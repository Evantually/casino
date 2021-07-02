from app import db
from datetime import datetime

class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(16))
    value = db.Column(db.Integer)
    img_path = db.Column(db.String(128))

    def __repr__(self):
        return '{}'.format(self.name)