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
        travel_colletion: np.array,
        inArea: Optional[bool] = None,
        round: Optional[int] = None,
        cycle: Optional[int] = None,
        position: Optional[str] = None,
        corner_count: Optional[int] = None,
        last_corner: Optional[int] = None,

    ):
        self.id = id
        self.vehicle_vctr = vehicle_vctr    
        self.inArea = inArea
        self.round = round
        self.cycle = cycle
        self.postion = position
        self.corner_count = corner_count
        self.last_corner = last_corner
        self.travel_colletion = travel_colletion
    
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
        self.vehicles = [None for x in range(1000)]
        self.vehicle_count = 0
        

    def create_vehicle(self, cycle, cycle1):
        self.vehicle_count += 1
        
        self.vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)]
        self.vehicles[cycle] = Vehicle(
            id = cycle + 1,
            vehicle_vctr = self.vehicle_vctr,
            inArea = False,
            travel_colletion = [0] * 1000
        )
        if self.vehicle_count <= 10:
            self.position(cycle)


    def position(self, cycle):
        self.vehicles[cycle].last_corner = ran.randint(0, 4)

        if self.corners[self.vehicles[cycle].last_corner][0] == 0:
            self.vehicles[cycle].position = str(self.vehicles[cycle].last_corner) + '0'
            self.corners[self.vehicles[cycle].last_corner][0] = self.vehicles[cycle].id
            self.vehicles[cycle].corner = self.vehicles[cycle].last_corner
            self.vehicles[cycle].corner_count = 0
            self.vehicles[cycle].inArea = True
            self.vehicles[cycle].info()
            print('First corner:', self.vehicles[cycle].last_corner, self.vehicles[cycle].corner_count, cycle)
        
        elif self.corners[self.vehicles[cycle].last_corner][1] == 0:
            self.vehicles[cycle].position = str(self.vehicles[cycle].last_corner) + '1'
            self.corners[self.vehicles[cycle].last_corner][1] = self.vehicles[cycle].id
            self.vehicles[cycle].corner = self.vehicles[cycle].last_corner
            self.vehicles[cycle].corner_count = 1
            self.vehicles[cycle].inArea = True
            self.vehicles[cycle].info()
            print('First corner:', self.vehicles[cycle].last_corner, self.vehicles[cycle].corner_count, cycle)
        
        elif self.corners[self.vehicles[cycle].last_corner][2] == 0:
            self.vehicles[cycle].position = str(self.vehicles[cycle].last_corner) + '2'
            self.corners[self.vehicles[cycle].last_corner][2] = self.vehicles[cycle].id
            self.vehicles[cycle].corner = self.vehicles[cycle].last_corner
            self.vehicles[cycle].corner_count = 2
            self.vehicles[cycle].inArea = True
            self.vehicles[cycle].info()
            print('First corner:', self.vehicles[cycle].last_corner, self.vehicles[cycle].corner_count, cycle)
        
        else:
            print('no space for new car', self.vehicles[cycle].last_corner)
            self.vehicles[cycle].last_corner = None
            self.vehicles[cycle].inArea = False
            self.vehicle_count -= 1
        
    
    def change_position(self, cycle, cycle1):
        
        for vehicle_cycle in range(cycle):
            if self.vehicles[vehicle_cycle].inArea == True:
                if self.vehicles[vehicle_cycle].id <= cycle:
                    self.new_corner = ran.randint(0, 5)

                    if self.new_corner > 4:
                        print('vehicle gone', self.vehicles[vehicle_cycle].id)
                        print(self.vehicles[vehicle_cycle].id, self.vehicles[vehicle_cycle].last_corner, self.vehicles[vehicle_cycle].corner_count, vehicle_cycle, self.vehicles[vehicle_cycle].inArea)
                        self.corners[self.vehicles[vehicle_cycle].last_corner][self.vehicles[vehicle_cycle].corner_count] = 0
                        self.vehicles[vehicle_cycle].inArea = False
                        self.vehicle_count -= 1
                    
                    elif self.vehicles[vehicle_cycle].last_corner == self.new_corner:
                        print(self.vehicles[vehicle_cycle].id, 'didnt move')

                    elif self.corners[self.new_corner][0] == 0:
                        self.corners[self.new_corner][0] = self.vehicles[vehicle_cycle].id
                        print(self.vehicles[vehicle_cycle].id, self.vehicles[vehicle_cycle].last_corner, self.vehicles[vehicle_cycle].corner_count, vehicle_cycle)
                        self.corners[self.vehicles[vehicle_cycle].last_corner][self.vehicles[vehicle_cycle].corner_count] = 0
                        print('vehicle moved',)
                        self.vehicles[vehicle_cycle].info()
                        print('place:', self.new_corner)
                        self.travel_time(vehicle_cycle, cycle1)
                        self.vehicles[vehicle_cycle].last_corner = self.new_corner
                        
                    elif self.corners[self.new_corner][1] == 0:
                        self.corners[self.new_corner][1] = self.vehicles[vehicle_cycle].id
                        print(self.vehicles[vehicle_cycle].id, self.vehicles[vehicle_cycle].last_corner, self.vehicles[vehicle_cycle].corner_count, vehicle_cycle)
                        self.corners[self.vehicles[vehicle_cycle].last_corner][self.vehicles[vehicle_cycle].corner_count] = 0
                        print('vehicle moved',)
                        self.vehicles[vehicle_cycle].info()
                        print('place:', self.new_corner)
                        self.travel_time(vehicle_cycle, cycle1)
                        self.vehicles[vehicle_cycle].last_corner = self.new_corner
                        
                    elif self.corners[self.new_corner][2] == 0:
                        self.corners[self.new_corner][2] = self.vehicles[vehicle_cycle].id
                        print(self.vehicles[vehicle_cycle].id, self.vehicles[vehicle_cycle].last_corner, self.vehicles[vehicle_cycle].corner_count, vehicle_cycle)
                        self.corners[self.vehicles[vehicle_cycle].last_corner][self.vehicles[vehicle_cycle].corner_count] = 0
                        print('vehicle moved',)
                        self.vehicles[vehicle_cycle].info()
                        print('place:', self.new_corner)
                        self.travel_time(vehicle_cycle, cycle1)
                        self.vehicles[vehicle_cycle].last_corner = self.new_corner
                
            elif self.vehicles[vehicle_cycle].inArea == False:
                pass
        self.vehicle_cycle = vehicle_cycle
        self.cycle = cycle1 + 1
        print(self.vehicle_cycle)


    def travel_time(self, vehicle_cycle, cycle1):
        self.time_table = np.array([
            [0, 2, 5, 8, 7],
            [2, 0, 6, 9, 4],
            [5, 6, 0, 8, 7],
            [8, 9, 8, 0, 2],
            [7, 4, 7, 2, 0],
        ])
        
        self.vehicles[vehicle_cycle].travel_colletion[cycle1] = self.time_table[self.vehicles[vehicle_cycle].last_corner][self.new_corner]

        print(self.time_table[self.vehicles[vehicle_cycle].last_corner][self.new_corner])


    def loop(self):
        self.turn = 0
        self.rec = [None] * 50

        self.recording = [[0 for x in range(self.cycle)] for y in range(self.vehicle_cycle)]
        for e in range(self.cycle):
            for i in range(self.vehicle_cycle):
                if self.vehicles[i] != None:
                    if self.vehicles[i].travel_colletion[e] > 0:
                        print(self.vehicles[i].travel_colletion[e], 'colletion', self.vehicles[i].id)
                        self.recording[i][e] = self.vehicles[i].travel_colletion[e]


    def lgnorm_dis(self):
        self.loop()
        print(self.recording)
        logmean = [0] * self.vehicle_cycle
        mean = [0] * self.vehicle_cycle
        for i in range(self.vehicle_cycle):
            for e in range(self.cycle):
                if sum(self.recording[i]) != 0:
                    logmean[i] = np.log10(sum(self.recording[i])) / len(self.recording[i])
                    mean[i] = sum(self.recording[i]) / len(self.recording[i])
                else:
                    logmean[i] = 0
                    mean[i] = 0
        

        for i in range(self.vehicle_cycle):
            for j in range(self.vehicle_cycle - i - 1):
                if mean[j] < mean[j + 1]:
                    sub = mean[j + 1]
                    mean[j + 1] = mean[j]
                    mean[j] = sub
                if logmean[j] < logmean[j + 1]:
                    sub = logmean[j + 1]
                    logmean[j + 1] = logmean[j]
                    logmean[j] = sub


        for i in range(self.vehicle_cycle):
            if mean[i] == 0:
                new_mean = [0] * (i)
                for j in range(i):
                    new_mean[j] = mean[j]
                break

        for i in range(self.vehicle_cycle):
            if logmean[i] == 0:
                new_logmean = [0] * (i)
                for j in range(i):
                    new_logmean[j] = logmean[j]
                break
        
        mean_pov = [0] * len(new_mean)
        for i in range(len(new_mean)):
            mean_pov[i] = new_mean[i]**2

        logmu = sum(new_logmean) / len(new_logmean)
        mu = round(sum(new_mean) / len(new_mean), 4)
        mean_simbol = (new_logmean - logmu)**2

        sigma = round(np.sqrt((sum(mean_pov) / len(new_mean)) - mu**2), 4)
        logsigma = np.sqrt(sum(mean_simbol) / len(new_mean))

        e = 2.71828

        print('Log:', logmu, logsigma, new_logmean)
        print(mu, sigma, new_mean)

        x = np.linspace(min(new_logmean) +1, max(new_logmean) + 5, 10000)
        print('x', x)

        pdf = (np.exp(-(np.log(x) - logmu)**2 / (2 * logsigma**2))
            / (x * logsigma * np.sqrt(2 * np.pi)))
        print(pdf)
        
        #pdf1 = e ** (logmu + logsigma * Z)
        
        plt.plot(x, pdf, linewidth=2, color="r")
        plt.axis("tight")
        plt.show()


    def check(self):
        print(self.corners)


trafic = AdjTrafic()

cycle = 0
cycle1 = 0
trafic.inital_setup()
while True:
    print('Cycle:', cycle, cycle1)
    trafic.create_vehicle(cycle, cycle1)

    cycle += 1
    if (cycle % 10) == 0:
        trafic.change_position(cycle, cycle1)
        cycle1 += 1
        cycleContuation = input()
        if cycleContuation == 'c':
            pass
        elif cycleContuation == 's':
            trafic.check()
            trafic.lgnorm_dis()
            break
    trafic.check()
    #time.sleep(1)