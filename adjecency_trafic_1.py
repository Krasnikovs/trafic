import numpy as np
import random as ran


class Vehicle():

    cars = []
    caramount = 0

    def __init__(
        self,
        id: int,
        vehicle_vctr: np.array,
        position: int,
    ):
        self.id = id
        self.vehicle_vctr = vehicle_vctr
        self.position = position
        self.lifetime : int = self.random_lognormal(mu = 2.014, sigma = 0.37)

    def step(self, time_table):
        if self.rem == 0:
            self.position = self.next_goal
            self.next_stop()
        else:
            self.rem -= 1
            self.position = 5

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


class Graph():
    episodes = 20
    time_table = np.array([
        [0, 2, 5, np.inf, 7],
        [2, 0, 6, 9, 4],
        [5, 6, 0, 8, 7],
        [np.inf, 9, 8, 0, 2],
        [7, 4, 7, 2, 0],
    ])
    #(cars: list[Vehicle]) -> dict[int, Vehicle]
    def get_cars(self):
        for position in range(6):
            print('V' + str(position + 1) + ': ' if position < 5 else 'R:')
            for car in Vehicle.cars:
                if car != 0 and car.position == position:
                    print(str(car.vehicle_vctr))
                else:
                    print(end='')

    def create_vehicles(self):
        Vehicle.cars.append(Vehicle(
            vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)],
            position = ran.randint(0, 4),
        ))
        
        Vehicle.cars[].next_stop()

    def create_initial_vehicles(self, caramount):
        Vehicle.cars.append(Vehicle(
            vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)],
            position = ran.randint(0, 4),
        ))
        
        Vehicle.cars[caramount].next_stop()

graph = Graph()

for Vehicle.caramount in range(5):
    graph.create_initial_vehicles(Vehicle.caramount)
graph.get_cars()
for episodes in range(graph.episodes):
    for car in Vehicle.cars:
        if car.lifetime == 0:
            # del Vehicle.cars[car.cara]
            del car
        else:
            car.step(graph.time_table)
            car.lifetime -= 1
    if ran.randint(0, 5) == 0:
        Vehicle.caramount += 1
        graph.create_vehicles(Vehicle.caramount)
        #

graph.get_cars()