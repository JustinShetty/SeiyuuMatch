import flask
import seiyuu_match

@seiyuu_match.app.route('/')
def index():
    return flask.render_template('index.html')