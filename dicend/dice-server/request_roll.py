import requests
import image_process

# http://localhost:5000/rollを呼び出す
def roll():
    #print("Calling http://localhost:5000/roll")
    try:
        # http://localhost:5000/rollにアクセスする
        r = requests.post('http://192.168.167.254/roll')
        
        # Roll する
        print("Roll: ", r.status_code)
        if r.status_code != 202:
            return r.status_code
        
        # status をポーリング
        print("Status: ")
        while(True):
            r = requests.get('http://192.168.167.254/status')
            if "ready" in r.text:
                print("Ready.")
                break
            else:
                print(".", end="", flush=True)
                
        
        return r.status_code
    except Exception as e:
        print(f"Error: {e}")
        print({"status": "error", "message": str(e)}), 500
        return "Failed"