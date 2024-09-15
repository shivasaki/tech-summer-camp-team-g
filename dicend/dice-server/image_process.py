import cv2
import numpy as np

GAUSSIAN_SIZE = (7, 7)

camera = cv2.VideoCapture(0)

# 背景画像とダイスの画像を取得


def un(x):
    print(x)
    if x == "fa":
        return "un"
    return "x"


result, image_base = camera.read()
if not result:
    exit()
image_base_blured = cv2.GaussianBlur(image_base, GAUSSIAN_SIZE, 0)

cv2.imshow("baseImage", image_base)
cv2.waitKey(0)

# カメラの画像を読み取るとき、前回のカメラのバッファを読んでる？
result, image_dice = camera.read()
result, image_dice = camera.read()
if not result:
    exit()
image_dice_blured = cv2.GaussianBlur(image_dice, GAUSSIAN_SIZE, 0)

# HSVに変換した上で差分をとる

base_hsv = cv2.cvtColor(image_base_blured, cv2.COLOR_RGB2HSV)
dice_hsv = cv2.cvtColor(image_dice_blured, cv2.COLOR_RGB2HSV)

diff_hsv = cv2.absdiff(base_hsv, dice_hsv)

# 2次元目を3つに分割→HSVの差分のチャンネルを分離
diff_imagelist = np.split(diff_hsv, 3, 2)

width = diff_hsv.shape[0]
height = diff_hsv.shape[1]

hdiff = diff_imagelist[0].reshape(width, height)
sdiff = diff_imagelist[1].reshape(width, height)
vdiff = diff_imagelist[2].reshape(width, height)

image_dice[hdiff > 15] = [255, 0, 0]
image_dice[sdiff > 50] = [0, 255, 0]
image_dice[vdiff > 65] = [0, 0, 255]

cv2.imshow("diceImage", image_dice)
cv2.waitKey(0)

cv2.destroyAllWindows()
