from typing import Optional
import numpy as np
import random as ran

class Vehicle():
    def __init__(
        self,
        vehicle_vctr: np.array,
        inVertex: np.array = None,
        position: np.array = None,

    ):
        self.vehicle_vctr = vehicle_vctr
        self.postion = position
        self.lifetime : int = self.random_lognorm(sigma, mu)

    def step(self, graph):
        for i in range(graph):
            if self.vehicle_vctr == graph[i]:
                self.postion = graph[i]
        space = np.array
        space_c = 0
        for i in range(graph - 1):
            for e in range(graph[i]):
                if graph[i][e] == 0:
                    space[space_c] = graph[i]
                    space_c += 1
                    return
        
        next_position = ran.random(len(space))

        pass

    def random_lognormal(self, mu, sigma):
        x = ran.random(1, 10)
        e = 2.71828
        Z = (x - mu) / sigma
        X = (e**mu)*((e**Z)**sigma)
        return X

    def get_vehicles(self):
        pass

graph = [v1, v2, v3, v4, v5, r1]
    
def create_vehicles(amount):
    for amount in range(amount):
        Vehicle(
            vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)],
            position = ran.randint(0, 5),
        )

car = Vehicle()

for episodes in range(episodes):
    create_vehicles()
    for car in range(car):
        car.step(graph)
        # 






def travel_time(self):
    self.time_table = np.array([
        [0, 2, 5, 8, 7],
        [2, 0, 6, 9, 4],
        [5, 6, 0, 8, 7],
        [8, 9, 8, 0, 2],
        [7, 4, 7, 2, 0],
    ])
        
def get_cars():
    pass

trafic = AdjTrafic()

cycle = 0
cycle1 = 0
trafic.inital_setup()
while True:
    trafic.create_vehicle(cycle, cycle1)

    cycle += 1
    if cycle == 9:
        print('Initial positions')
        trafic.trafic_map()
    if (cycle % 10) == 0:
        trafic.change_position(cycle, cycle1)
        trafic.trafic_map()
        cycle1 += 1
        cycleContuation = input()
        if cycleContuation == 'c':
            pass
        elif cycleContuation == 's':
            
            trafic.lgnorm_dis()
            break