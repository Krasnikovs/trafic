import numpy as np
import random as ran
import time
import matplotlib.pyplot as plt


class AdjTrafic():
    def __init__(self):
        return
    
    def inital_position(self):
        listA = [12, 38, 43]
        self.vctrA = np.array(listA)
        self.vctrExists = True

        self.corners = [None, None, None, None, None]
        self.current_corner = ran.randint(0, 4)
        self.corners[self.current_corner] = self.vctrA
        print("Inital position:", self.corners)


    def position_change(self):
        self.new_corner = ran.randint(0, 5)
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
        
        if self.new_corner == 5 and self.turn == 1:
            return
        else:
            self.lgnorm()


    def lgnorm(self):
        mean = sum(self.recording) / len(self.recording)
        aaa = [0] * (len(self.recording))
        for i in range(len(self.recording)):
            aaa[i] = (self.recording[i] - mean)**2
        sigma = np.sqrt(sum(aaa) / (len(aaa) - 1))
        s = np.random.lognormal(mean, sigma, 1000)

        count, bins, ignored = plt.hist(s, 100, density=True, align="mid")

        x = np.linspace(min(bins), max(bins), 10000)
        pdf = (np.exp(-(np.log(x) - mean)**2 / (2 * sigma**2))
            / (x * sigma * np.sqrt(2 * np.pi)))

        plt.plot(x, pdf, linewidth=2, color="r")
        plt.axis("tight")
        plt.show()


trafic = AdjTrafic()
trafic.loop()