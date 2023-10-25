import numpy as np
import random as ran


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
                if car != 0 and car.position == position:
                    print(str(car.vehicle_vctr))
                else:
                    print(end='')

    def create_vehicles():
        Vehicle.cars.append(Vehicle(
            vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)],
            position = ran.randint(0, 4),
        ))
        
        Vehicle.cars[Vehicle.caramount].next_stop()


graph = Graph()

for episodes in range(graph.episodes):
    if Vehicle.caramount == -1:
        for Vehicle.caramount in range(5):
            graph.create_vehicles()
    for car in Vehicle.cars:
        if car.lifetime == 0:
            Vehicle.cars.remove(car)
            del car
            Vehicle.caramount -= 1
        else:
            car.step()
            car.lifetime -= 1
    graph.get_cars()
        #

