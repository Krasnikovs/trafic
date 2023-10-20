from typing import Optional
import numpy as np
import random as ran
import time
import matplotlib.pyplot as plt

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
        pass

    def random_lognormal(self):
        pass

    def get_vehicles(self):
        pass
    
def create_vehicles(amount):
    for amount in range(amount):
        Vehicle(
            vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)],
            position = ran.randint(0, 5),
        )


for episodes in range(episodes):
    create_vehicles()
    for car in cars:
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
    # trafic.check()
    #time.sleep(1)