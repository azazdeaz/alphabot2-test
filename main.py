import graphene
from flask import Flask
from flask_graphql import GraphQLView
from wheel_mutations import SetMotor, SetSpeed

class Mutation(graphene.ObjectType):
    set_motor = SetMotor.Field()
    set_speed = SetSpeed.Field()

class Query(graphene.ObjectType):
    hello = graphene.String(description='A typical hello world')

    def resolve_hello(self, info):
        return 'World'

schema = graphene.Schema(query=Query, mutation=Mutation)

query = '''
    query SayHello {
      hello
    }
'''
result = schema.execute(query)

app = Flask(__name__)
app.debug = True

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True # for having the GraphiQL interface
    )
)


if __name__ == '__main__':
    app.run()
