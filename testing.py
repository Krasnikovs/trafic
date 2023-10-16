vehicles = [[1], [2], [3], [4], [5], [6], [7], [8], [9]]
recording = [[0 for x in range(1)] for y in range(9)]
[[0 for x in range(3)] for y in range(5)]
for e in range(1):
    for i in range(9):
        if vehicles != None:
            if vehicles[i][e] > 0:
                print(vehicles[i][e], 'colletion', i, e)
                recording[i][e] = vehicles[i][e]
                print(recording)