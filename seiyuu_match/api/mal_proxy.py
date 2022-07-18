import flask
import requests
import seiyuu_match

MAL_BASE_ADDRESS = 'https://api.myanimelist.net/v2'


@seiyuu_match.app.route('/mal_proxy/<path:route>')
def mal_proxy(route):
    url = MAL_BASE_ADDRESS + '/' + route
    headers = {'X-MAL-CLIENT-ID': seiyuu_match.app.config['MAL_CLIENT_ID']}
    request = requests.get(url, stream=True, params=flask.request.args, headers=headers)
    response = flask.Response(flask.stream_with_context(request.iter_content()),
                              content_type=request.headers['content-type'],
                              status=request.status_code)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response