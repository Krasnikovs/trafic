from typing import Optional
import numpy as np
import random as ran
import time
import matplotlib.pyplot as plt

mu = 154
sigma = 0.4343


# 2.0714285714285716 1.2940207865093845
# s = np.random.lognormal(mu, sigma, 1000)
# a, aaa, aa = plt.hist(s, 100, density = True, align = 'mid')

# x = np.linspace(min(aaa), max(aaa), 1000)
# # Z = (x - mu)**2 / sigma
# # logmu = sum(np.log(x)) / len(x)
# # logsigma = np.sqrt(sum((np.log(x) - logmu)**2) / len(x))
        
# # print('z', Z, 'logmu', logmu, 'sigma', logsigma)
# pdf = (np.exp(-(np.log(x) - mu)**2 / (2 * sigma**2))
#     / (x * sigma * np.sqrt(2 * np.pi)))

# plt.plot(x, pdf, linewidth=2, color="r")
# plt.axis("tight")
# plt.show()

s = np.random.lognormal(mu, sigma, 1000)

# count, bins, ignored = plt.hist(s, 100, density=True, align='mid')

x = np.linspace(min(s), max(s), 10000)
pdf = (np.exp(-(np.log(x) - mu)**2 / (2 * sigma**2))
    / (x * sigma * np.sqrt(2 * np.pi)))

plt.plot(x, pdf, linewidth=2, color='r')

plt.axis('tight')

plt.show()
