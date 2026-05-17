# Typing Game

Djangoで作成したタイピングゲームです。

## セットアップ

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 環境変数

```bash
export DJANGO_SECRET_KEY='任意の秘密鍵'
export DB_USER='PostgreSQLのユーザー名'
export DB_PASSWORD='PostgreSQLのパスワード'
```

## 起動

```bash
python manage.py migrate
python manage.py runserver
```

ブラウザで `http://127.0.0.1:8000/` を開きます。
