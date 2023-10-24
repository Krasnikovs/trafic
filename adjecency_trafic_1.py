import numpy as np
import random as ran

class Vehicle():
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
            self.next_stop(cars)
        else:
            self.rem -= 1
            self.position = 5

    def random_lognormal(self, mu, sigma):
        x = ran.randint(4, 12)
        e = 2.71828
        Z = (x - 8) / 2.757
        X = round((e**mu)*((e**Z)**sigma))
        return X

    def next_stop(self, caramount):
        self.next_goal = ran.randint(0, 4)
        if time_table[car[caramount].position][self.next_goal] == np.inf:
            self.rem = 0
        else:
            self.rem = time_table[car[caramount].position][self.next_goal]

    def get_cars(self):
        pass


def create_vehicles(caramount):
        car[caramount] = Vehicle(
            vehicle_vctr = [ran.randint(0, 128), ran.randint(0, 128)],
            position = ran.randint(0, 4),
        )
        
        car[caramount].next_stop(caramount)


def get_cars():
    for position in range(6):
        print('V' + str(position + 1) + ': ' if position < 5 else 'R: ')
        for cars in range(len(car)):
            if car[cars] != 0 and car[cars].position == position:
                print(str(car[cars].vehicle_vctr))
            else:
                print(end='')

car = [0] * 100
caramount = 0
episodes = 5

time_table = np.array([
    [0, 2, 5, np.inf, 7],
    [2, 0, 6, 9, 4],
    [5, 6, 0, 8, 7],
    [np.inf, 9, 8, 0, 2],
    [7, 4, 7, 2, 0],
])
for caramount in range(5):
    create_vehicles(caramount)
    
for episodes in range(episodes):
    if ran.randint(0, 5) == 0:
        caramount += 1
        create_vehicles(caramount)
    for cars in range(len(car)):
        if car[cars] == 0 or car[cars].lifetime == 0:
            car[cars] = 0
        else:
            car[cars].step()
            car[cars].lifetime -= 1
    episodes += 1
        #

get_cars()