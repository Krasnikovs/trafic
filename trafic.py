import numpy as np
import random as ran
from paho.mqtt import client as mqtt
import paho.mqtt.publish as publish

class Vehicle():
    cars = []
    caramount = -1
    
    def __init__(
        self,
        vehicle_vctr: np.array,
        position: int,
    ):
        self.vehicle_vctr = vehicle_vctr
        self.position = position
        self.lifetime : int = self.random_lognormal(mu = 2.014, sigma = 0.37)

    def step(self):
        if self.rem == 0:
            self.position = self.next_goal
            self.next_stop()
        else:
            self.rem -= 1
            self.position = 6

    def random_lognormal(self, mu, sigma):
        x = ran.randint(4, 12)
        e = 2.71828
        Z = (np.log(x) - mu) / sigma
        X = round((e**mu)*((e**Z)**sigma))
        return X

    def next_stop(self):
        self.next_goal = ran.randint(0, 4)
        if Graph.time_table[self.position][self.next_goal] == np.inf:
            self.rem = 0
        else:
            self.rem = Graph.time_table[self.position][self.next_goal]

    def vehicle_info(self):
        print(self.vehicle_vctr, end='')
        print(' Next', self.next_goal + 1, end='')
        # print(' rem:', self.rem)
        pass


class Graph():
    episodes = 20
    time_table = np.array([
        [0, 2, 5, np.inf, 7, 6],
        [2, 0, 6, 9, 4, 5],
        [5, 6, 0, 8, 7, 4],
        [np.inf, 9, 8, 0, 2, 9],
        [7, 4, 7, 2, 0, 7],
        [6, 5, 4, 9, 7, 0],
    ])

        
    #(cars: list[Vehicle]) -> dict[int, Vehicle]
    def get_cars():
        for position in range(7):
            print('V' + str(position + 1) + ': ' if position < 6 else 'R:')
            for car in Vehicle.cars:
                if car.position == position:
                    print(str(car.vehicle_vctr))
                else:
                    print(end='')

    def get_vehicles(client):
        for position in range(7):
            for car in Vehicle.cars:
                if car.position == position:

                    vctr = [
                        {'topic':'data/vctr', 'payload': str(car.vehicle_vctr), 'qos':0, 'retain':False}, 
                        {'topic': 'data/position', 'payload': car.position, 'qos':0, 'retain':False}
                    ]
                    result = client.publish(
                        topic = str(position),
                        payload = str(car.vehicle_vctr)
                    )

                    if result[0] == 0:
                        print(f'Sent')
                    else:
                        print(f'Failed')

                    # position = {'position': car.position}
                    # client.publish(
                    #     topic = 'data/mess', 
                    #     payload = position
                    # )


    def get_corner():
        position = int(input('Enter the vertex number: '))
        print('V' + str(position) + ': ' if position < 6 else 'R:')
        for car in Vehicle.cars:
            if car.position == position - 1:
                print(str(car.vehicle_vctr))
        pass

    def create_vehicles():
        Vehicle.cars.append(Vehicle(
            vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)],
            position = ran.randint(0, 4),
        ))
        
        Vehicle.cars[Vehicle.caramount].next_stop()

    def connect():
        def on_connect(client, userdate, flags, rc):
            if rc == 0:
                print('Suc')
            else:
                print('Failed and', rc)
        client_id = f'publish-{ran.randint(0, 1000)}'
        client = mqtt.Client(client_id)
        # client.username_pw_set(username = 'edi', password = 'ediedi123')
        client.on_connect = on_connect
        client.connect('localhost', 1883)
        return client


client = Graph.connect()
client.loop_start()

for episodes in range(Graph.episodes):
    if Vehicle.caramount == -1:
        for Vehicle.caramount in range(5):
            Graph.create_vehicles()
    for car in Vehicle.cars:
        if car.lifetime == 0:
            Vehicle.cars.remove(car)
            del car
            Vehicle.caramount -= 1
        else:
            car.step()
            car.lifetime -= 1
    
    Graph.get_vehicles(client)
        #
client.loop_stop()