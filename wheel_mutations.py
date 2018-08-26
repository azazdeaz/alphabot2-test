import graphene
from motor_controls import MotorControls

controller = MotorControls()

class SetMotor(graphene.Mutation):
    class Arguments:
        left = graphene.Float()
        right = graphene.Float()

    ok = graphene.Boolean()

    def mutate(self, info, left, right):
        controller.setMotor(left, right)
        ok = True
        return SetMotor(ok=ok)

class SetSpeed(graphene.Mutation):
    class Arguments:
        left = graphene.Float()
        right = graphene.Float()
    ok = graphene.Boolean()

    def mutate(self, info, left, right):
        controller.setPWMA(left)
        controller.setPWMB(right)
        return MoveCamera(ok=True)
