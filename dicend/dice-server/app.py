from flask import Flask
from flask import request
import image_process
import request_roll

app = Flask(__name__)

stat = 0

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/')
def flask_app():
    return 'faun'


@app.route('/roll', methods=['GET', 'POST'])
def roll():
    global stat
    if request.method == 'POST':
        print("ロール方法が指定されただけ")
        return 'rolling (POST)'
    elif request.method == 'GET':
        stat = 1
        print("デフォルト設定でロールします")
        try:
            r = request_roll.roll()
            stat = 0
            return str(r)
        except Exception as e:
            print(f"Error: {e}")
            print({"status": "error", "message": str(e)}), 500
            stat = 0
            return "Failed"

@app.route('/status', methods=['GET'])
def status():
    global stat
    deme = image_process.detectDice()
    if stat == 0:
        return {"status": "completed", "result": str(deme)}
    else:
        return {"status": "rolling", "result": None}
# 1s毎にサイコロを認識する
# while True:
#     image_process.detectDice()
#     time.sleep(1)
#     print("1秒経過")
#     break