import flask

app = flask.Flask(__name__)
app.config.from_object('seiyuu_match.config')

import seiyuu_match.api
# import seiyuu_match.views