import graphene
from servo_controls import PCA9685
import threading

pwm = PCA9685(0x40, debug=True)
pwm.setPWMFreq(50)
# while True:
 # setServoPulse(2,2500)
  # for i in range(500,2500,10):
  #   pwm.setServoPulse(0,i)
  #   time.sleep(0.02)
  #
  # for i in range(2500,500,-10):
  #   pwm.setServoPulse(0,i)
  #   time.sleep(0.02)

class Look(graphene.Mutation):
    class Arguments:
        pulse = graphene.Int()
        channel = graphene.Int()

    ok = graphene.Boolean()

    def mutate(self, info, pulse, channel):
        pwm.setServoPulse(channel, pulse)
        threading.Timer(0.5, lambda: pwm.stop(channel)).start()
        ok = True
        return Look(ok=ok)
