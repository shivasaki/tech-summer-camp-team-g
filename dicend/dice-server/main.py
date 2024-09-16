import cv2
import numpy as np

# DEBUG_MODE =

# 画像を読み込み
image = cv2.imread('dice_image21.png')

# 画像を確認
cv2.imshow("",image)

# グレースケールに変換
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# ２値化　スレッショルド 150 変える
_, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

# マスクの作成
h, w = binary.shape
mask = np.zeros((h + 2, w + 2), np.uint8)

for x in range(w):
    if binary[0, x] == 255:  # 上辺に接している白い領域を探す
        cv2.floodFill(binary, mask, (x, 0), 0)  # 塗りつぶし

# 下辺の白い領域を埋める
for x in range(w):
    if binary[h-1, x] == 255:  # 下辺に接している白い領域を探す
        cv2.floodFill(binary, mask, (x, h-1), 0)

# 左辺の白い領域を埋める
for y in range(h):
    if binary[y, 0] == 255:  # 左辺に接している白い領域を探す
        cv2.floodFill(binary, mask, (0, y), 0)

# 右辺の白い領域を埋める
for y in range(h):
    if binary[y, w-1] == 255:  # 右辺に接している白い領域を探す
        cv2.floodFill(binary, mask, (w-1, y), 0)

cv2.imshow("1",binary)

# サイコロの輪郭を検出
# contours, _ = cv2.findContours(binary, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

# # 明るさの最大値を保持する変数
# max_brightness = 0
# brightest_contour = None

# # 各輪郭の平均明るさを計算
# x, y, w, h = cv2.boundingRect(brightest_contour)
# cv2.rectangle(binary, (x, y), (x+w, y+h), (0, 255, 0), 2)

# ２値化した画像から白い塊を全部探す
contours, _ = cv2.findContours(
    binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# 最大輪郭を選択（サイコロの正面と仮定）
for contour in contours:
    area = cv2.contourArea(contour)

    # 面積でフィルタリング（サイコロの大きさに応じて調整）
    if 10000 < area < 20000:
        # 輪郭の外接矩形を取得
        x, y, w, h = cv2.boundingRect(contour)

        # アスペクト比でフィルタリング（正方形に近いもののみ）
        # 要検討
        if 15000 < w*h < 30000:  # 正方形に近い範囲
            dice_contour = contour

# サイコロの正面を抽出
x, y, w, h = cv2.boundingRect(dice_contour)

# 見る用
dice_roi = image[y:y+h, x:x+w]

binary_dice = binary[y:y+h, x:x+w]

# モルフォロジー変換で欠けた部分を補完（クロージング）
kernel = np.ones((5, 5), np.uint8)  # カーネルサイズを調整
opened = cv2.morphologyEx(binary_dice, cv2.MORPH_OPEN, kernel)
dilated = cv2.dilate(opened, kernel, iterations=2)

cv2.imshow("2",dilated)

# 切り抜いたサイコロの画像から、目の輪郭を検出
eye_contours, _ = cv2.findContours(
    dilated, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

# 目の数をカウント
eye_count = 0
for eye_contour in eye_contours:
    mask = np.zeros_like(dilated)
    cv2.drawContours(mask, [eye_contour], -1, 255, thickness=cv2.FILLED)

    # マスクを使って、輪郭内部のピクセルの値を取得
    mean_val = cv2.mean(dilated, mask=mask)[0]
    # print("mean_val: " + str(mean_val))
    # print("area: " + str(cv2.contourArea(eye_contour)))

    if 5000 > cv2.contourArea(eye_contour) > 90 and mean_val < 127:  # 小さいノイズを除去
        # 目、確定の時の処理
        eye_count += 1

        # 目を丸でマークした画像を作る
        (x, y), radius = cv2.minEnclosingCircle(eye_contour)
        center = (int(x), int(y))
        radius = int(radius)
        cv2.circle(dice_roi, center, radius, (0, 255, 0), 2)

print(f"サイコロの目の数: {eye_count}")

# 結果を表示
cv2.imshow("3",dice_roi)

wait_key = cv2.waitKey(0)
