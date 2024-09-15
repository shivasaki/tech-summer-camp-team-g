from flask import Flask
from flask import request
import image_process

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/')
def flask_app():
    return 'faun'


@app.route('/roll', methods=['GET', 'POST'])
def roll():

    if request.method == 'POST':
        print("ロール方法が指定されました")
        return 'rolling (POST)'
    else:
        print("ロール方法が指定されていません")
        # openCVで画像を取得する
        return image_process.un("fa")
