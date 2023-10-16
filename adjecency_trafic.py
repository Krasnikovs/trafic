from typing import Optional
import numpy as np
import random as ran
import time
import matplotlib.pyplot as plt

class Vehicle():
    def __init__(
        self,
        name: str,
        vehicle_vctr: np.array,
        inArea: Optional[bool] = None,
    ) -> None:
        return

    def position(self):
        new_corner = ran.randint(4)

        if self.corners[new_corner][0] == 0:
            self.corners[new_corner][0] = self.vehicle_vctr
        elif self.corners[new_corner][1] == 0:
            self.corners[new_corner][1] = self.vehicle_vctr
        elif self.corners[new_corner][2] == 0:
            self.corners[new_corner][2] = self.vehicle_vctr
        else:
            return
    
    def change_corner(self):
        new_corner = ran.randint(5)

        if new_corner == 5:
            self.vehicles[]
        elif self.corners[new_corner][0] == 0:
            self.corners[new_corner][0] = self.vehicle_vctr
        elif self.corners[new_corner][1] == 0:
            self.corners[new_corner][1] = self.vehicle_vctr
        elif self.corners[new_corner][2] == 0:
            self.corners[new_corner][2] = self.vehicle_vctr
        else:
            return

class AdjTrafic():
    def __init__(self):
        return
    
    def inital_setup(self):
        self.corners = [[0 for x in range(5)] for y in range(3)]
        self.vehicles = [[None for x in range(1)] for y in range(10)]

    def create_vehicle(self):
        self.vehicle_vctr = [ran.randint(128), ran.randint(128)]
        
        self.vehicles[i] = Vehicle(
            name = "aa",
            vehicle_vctr = self.vehicle_vctr,
            inArea = True,
        )

        

        # if self.vehicles[0] == None:
        #     self.vehicles[0] = self.vehicle_vctr
        # elif self.vehicles[1] == None:
        #     self.vehicles[1] = self.vehicle_vctr
        # elif self.vehicles[2] == None:
        #     self.vehicles[2] = self.vehicle_vctr
        # elif self.vehicles[3] == None:
        #     self.vehicles[3] = self.vehicle_vctr
        # elif self.vehicles[4] == None:
        #     self.vehicles[4] = self.vehicle_vctr
        # elif self.vehicles[5] == None:
        #     self.vehicles[5] = self.vehicle_vctr
        # elif self.vehicles[6] == None:
        #     self.vehicles[6] = self.vehicle_vctr
        # elif self.vehicles[7] == None:
        #     self.vehicles[7] = self.vehicle_vctr
        # elif self.vehicles[8] == None:
        #     self.vehicles[8] = self.vehicle_vctr
        # elif self.vehicles[9] == None:
        #     self.vehicles[9] = self.vehicle_vctr
        # else:
        #     print('no space')

    def position(self):
        new_corner = ran.randint(4)

        if self.corners[new_corner][0] == 0:
            self.corners[new_corner][0] = self.vehicles[i]
        elif self.corners[new_corner][1] == 0:
            self.corners[new_corner][1] = self.vehicles[i]
        elif self.corners[new_corner][2] == 0:
            self.corners[new_corner][2] = self.vehicles[i]
        else:
            return
    
    def change_corner(self):
        new_corner = ran.randint(5)

        if new_corner == 5:
            self.car(inArea = False)
        elif self.corners[new_corner][0] == 0:
            self.corners[new_corner][0] = self.vehicles[i]
        elif self.corners[new_corner][1] == 0:
            self.corners[new_corner][1] = self.vehicles[i]
        elif self.corners[new_corner][2] == 0:
            self.corners[new_corner][2] = self.vehicles[i]
        else:
            return

    def position_change(self):
        self.new_corner = ran.randint(5)
        if self.new_corner != 5 and self.new_corner != self.current_corner:
            self.travel_time()
            self.corners[self.current_corner] = None
            self.current_corner = self.new_corner
            self.corners[self.current_corner] = self.vctrA
        elif self.new_corner == self.current_corner:
            print("slow")
            self.position_change()
            return
        else:
            print("its gone")
            self.vctrExists = False
            self.corners[self.current_corner] = None
        print(self.corners)


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


trafic = AdjTrafic()
trafic.loop()