import numpy as np
import cv2 as cv
from servo_controls import PCA9685
import threading
#import matplotlib.pyplot as plt

face_cascade = cv.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv.CascadeClassifier('haarcascade_eye.xml')
# img = cv.imread('hqdefault.jpg')
# gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

cap = cv.VideoCapture(0)

pwm = PCA9685(0x40, debug=False)
pwm.setPWMFreq(50)

pulse_x = 1500
pulse_y = 1500
PULSE_RANGE = 1000
off_x = 0
off_y = 0

def move(pulse_x, pulse_y):
    pwm.setServoPulse(0, pulse_x)
    pwm.setServoPulse(1, pulse_y)
    threading.Timer(0.5, lambda: pwm.stop(0)).start()
    threading.Timer(0.5, lambda: pwm.stop(1)).start()


move(pulse_x, pulse_y)

while(True):
    ret, img = cap.read()
    if not ret:
        print('Failed to load image')
        break
    cv.imwrite('test.jpg', img)

    img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(img, 1.3, 5)

    if len(faces) == 0:
        continue

    # TODO select the bigges face
    # sizes = np.vectorize(lambda face: face[2] * face[3])
    face = faces[0] #faces[np.argmax(sizes)]
    x, y, w, h = face
    center_x = x + w / 2
    center_y = y + h / 2

    # cv.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
    # img_face = img[y:y+int(h/2), x:x+w]
    # eyes = eye_cascade.detectMultiScale(img_face)
    # if len(eyes) != 2:
    #     print("I found {} eye(s)0 on this face".format(len(eyes)))
    #     continue
    #
    # # TODO calc the center of the eyes first
    # eye_a, eye_b = eyes
    # center_x = eye_a[0] + (eye_b[0] + eye_b[2]) / 2.0
    # center_y = eye_a[1] + (eye_b[1] + eye_b[3]) / 2.0

    img_w, img_h = img.shape
    offset_x = (center_x / float(img_w) - 0.5) * 2.0
    offset_y = (center_y / float(img_h) - 0.5) * 2.0
    # off_x = off_x + (offset_x - off_x) / 6
    # off_y = off_y + (offset_y - off_y) / 6
    print(face,img_w, img_h, center_x, center_y)
    print('> face position x={:.2f} y={:.2f}'.format(offset_x, offset_y))

    scale = 12
    pulse_x = pulse_x + offset_x * scale
    pulse_y = pulse_y + offset_y * scale
    # print('pulse x={} y={}', pulse_x, pulse_y)
    move(pulse_x, pulse_y)
    # threading.Timer(0.5, lambda: pwm.stop(channel)).start()
    # for (x,y,w,h) in faces:
        # cv.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        # img_face = gray[y:y+h, x:x+w]
        # roi_color = img[y:y+h, x:x+w]
        # eyes = eye_cascade.detectMultiScale(img_face)
        # for (ex,ey,ew,eh) in eyes:
        #     cv.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
    # cv.imshow('img',img)
    # plt.imshow(img)
    # plt.show()
    # plt.waitforbuttonpress()
    # cv.destroyAllWindows()
