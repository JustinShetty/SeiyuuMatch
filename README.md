# SeiyuuMatch

> **Note**
> This functionality is now built into the native MAL filters when viewing Voice Acting Roles

For when you KNOW you've heard an anime voice actor before, but it's stuck on the tip of your... ear?

After you select a character, SeiyuuMatch cross references that voice actor's other roles with your MyAnimeList account to produce a list of shows you've seen them in.

## Setup
```
> npm install
> npm run build
> python3 -m venv venv
> source venv/bin/activate
> (venv) pip install -r requirements.txt
> (venv) FLASK_APP=seiyuu_match flask run
```
