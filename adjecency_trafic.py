from typing import Optional
import numpy as np
import random as ran
import time
import matplotlib.pyplot as plt

class Vehicle():
    def __init__(
        self,
        id: int,
        vehicle_vctr: np.array,
        inArea: Optional[bool] = None,
        round: Optional[int] = None,
        cycle: Optional[int] = None,
        position: Optional[str] = None,
        corner_count: Optional[int] = None,
    ):
        self.id = id
        self.vehicle_vctr = vehicle_vctr    
        self.inArea = inArea
        self.round = round
        self.cycle = cycle
        self.postion = position
        self.corner_count = corner_count
    
    def info(self):
        print(self.id, self.vehicle_vctr, self.inArea)

    def car_info(self):
        self.id, self.vehicle_vctr, self.inArea, self.round

class AdjTrafic():
    def __init__(
            self, 
            vehicle_space: Optional[bool] = True,
    ):
        self.vehicle_space = vehicle_space,
    
    def inital_setup(self):
        self.corners = [[0 for x in range(3)] for y in range(5)]
        self.vehicles = [None for x in range(100)]
        self.vehicle_count = 0
        self.initial_corner = [0 for x in range(100)]

    def create_vehicle(self, cycle, cycle1):
        self.vehicle_count += 1
        if self.vehicle_count <= 10:
            self.vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)]

            self.vehicles[cycle] = Vehicle(
                id = cycle + 1,
                vehicle_vctr = self.vehicle_vctr,
                inArea = True,
            )
        

            self.position(cycle)

    def position(self, cycle):
        self.initial_corner[cycle] = ran.randint(0, 4)

        if self.corners[self.initial_corner[cycle]][0] == 0:
            self.vehicles[cycle].position = str(self.initial_corner[cycle]) + '0'
            self.corners[self.initial_corner[cycle]][0] = self.vehicles[cycle].id
            self.vehicles[cycle].corner = self.initial_corner[cycle]
            self.vehicles[cycle].corner_count = 0
            self.vehicles[cycle].info()
            print('New corner:', self.initial_corner[cycle], 0)
            return
        
        elif self.corners[self.initial_corner[cycle]][1] == 0:
            self.vehicles[cycle].position = str(self.initial_corner[cycle]) + '1'
            self.corners[self.initial_corner[cycle]][1] = self.vehicles[cycle].id
            self.vehicles[cycle].corner = self.initial_corner[cycle]
            self.vehicles[cycle].corner_count = 1
            self.vehicles[cycle].info()
            print('New corner:', self.initial_corner[cycle], 1)
            return
        
        elif self.corners[self.initial_corner[cycle]][2] == 0:
            self.vehicles[cycle].position = str(self.initial_corner[cycle]) + '2'
            self.corners[self.initial_corner[cycle]][2] = self.vehicles[cycle].id
            self.vehicles[cycle].corner = self.initial_corner[cycle]
            self.vehicles[cycle].corner_count = 2
            self.vehicles[cycle].info()
            print('New corner:', self.initial_corner[cycle], 2)
            return
        
        else:
            print('no space for new car', self.initial_corner[cycle])
            return
        
    
    def change_position(self, cycle1):
        
        for i in range(cycle + 1):
            if self.vehicles[i] == None:
                return
            elif self.vehicles[i] != None:
                new_corner = ran.randint(0, 5)

                if new_corner > 4:
                    print('vehicle gone', self.vehicles[i].id)
                    self.corners[self.initial_corner[i]][self.vehicles[i].corner_count]
                    self.vehicles[i] = None
                    self.vehicle_count -= 1
                    return
                                    
                elif self.corners[new_corner][0] == 0:
                    self.corners[new_corner][0] = self.vehicles[i].id
                    self.corners[self.initial_corner[i]][self.vehicles[i].corner_count] = 0
                    self.vehicles[i].info()
                    return
                    
                elif self.corners[new_corner][1] == 0:
                    self.corners[new_corner][1] = self.vehicles[i].id
                    self.corners[self.initial_corner[i]][self.vehicles[i].corner_count] = 0
                    self.vehicles[i].info()
                    return
                    
                elif self.corners[new_corner][2] == 0:
                    self.corners[new_corner][2] = self.vehicles[i].id
                    self.corners[self.initial_corner[i]][self.vehicles[i].corner_count] = 0
                    self.vehicles[i].info()
                    return

    def travel_time(self):
        self.time_table = np.array([
            [0, 7, 5, 6, 5],
            [7, 0, 8, 3, 4],
            [5, 8, 0, 9, 1],
            [6, 3, 9, 0, 1],
            [5, 4, 1, 1, 0],
        ])
        # time.sleep(time_table[1][2])
        
        print(self.current_corner, self.new_corner)
        print(self.time_table[self.current_corner][self.new_corner])
        self.rec[self.turn] = np.log(self.time_table[self.current_corner][self.new_corner])



    def loop(self):
        self.inital_position()
        self.turn = 0
        self.rec = [None] * 50
        
        while self.vctrExists == True:
            self.position_change()
            print(self.rec[self.turn])
            self.turn = self.turn + 1

        self.recording = [0] * (self.turn - 1)
        for i in range(self.turn - 1):
            self.recording[i] = self.rec[i]
        
        # if self.new_corner == 5 and self.turn == 1:
        #     return
        # else:
        #     self.lgnorm()


    def lgnorm(self):
        mean = sum(self.recording) / len(self.recording)
        aaa = [0] * (len(self.recording))
        for i in range(len(self.recording)):
            aaa[i] = (self.recording[i] - mean)**2
        sigma = np.sqrt(sum(aaa) / (len(aaa)))
        # s = np.random.lognormal(mean, sigma, 1000)

        # count, bins, ignored = plt.hist(s, 100, density=True, align="mid")

        # x = np.linspace(min(bins), max(bins), 10000)
        # pdf = (np.exp(-(np.log(x) - mean)**2 / (2 * sigma**2))
        #     / (x * sigma * np.sqrt(2 * np.pi)))

        

        plt.plot(x, pdf, linewidth=2, color="r")
        plt.axis("tight")
        plt.show()

    def check_space(self):
        print('checking space', cycle)
        if self.vehicles[cycle] != None:
            if self.vehicles[cycle].inArea == False:
                self.vehicles[cycle] = None
                self.vehicle_space = True
                print('free space')
                return self.vehicle_space
            elif self.vehicles[cycle].inArea == True:
                self.vehicle_space = False
                print('change to false')
                return self.vehicle_space
        elif self.vehicles[cycle] == None:
            self.vehicle_space = True
            print('free space -')
            return self.vehicle_space
        else:
            print('sad')

    def check(self):
        print(self.corners)


trafic = AdjTrafic()

cycle = 0
cycle1 = 0
trafic.inital_setup()
while True:
    print('Cycle:', cycle, cycle1)
    trafic.create_vehicle(cycle, cycle1)
    trafic.change_position(cycle1)

    cycle += 1
    if (cycle % 10) == 0:
        cycle1 += 1
    trafic.check()
    time.sleep(1)