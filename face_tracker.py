import numpy as np
import cv2 as cv
import matplotlib.pyplot as plt

face_cascade = cv.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv.CascadeClassifier('haarcascade_eye.xml')
# img = cv.imread('hqdefault.jpg')
# gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

cap = cv.VideoCapture(0)


while(True):
    ret, frame = cap.read()
    if not ret:
        print('Failed to load image')
        break
    
    faces = face_cascade.detectMultiScale(frame, 1.3, 5)
    sizes = np.vectorize(lambda face: face[2] * face[3])
    face = faces[np.argmax(sizes)]
    print(face)
    # for (x,y,w,h) in faces:
        # cv.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
        # roi_gray = gray[y:y+h, x:x+w]
        # roi_color = img[y:y+h, x:x+w]
        # eyes = eye_cascade.detectMultiScale(roi_gray)
        # for (ex,ey,ew,eh) in eyes:
        #     cv.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
    # cv.imshow('img',img)
    # plt.imshow(frame)
    # plt.show()
    # plt.waitforbuttonpress()
    # cv.destroyAllWindows()
