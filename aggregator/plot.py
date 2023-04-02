import json
import matplotlib.pyplot as plt
import numpy as np

x = []
y = []

with open("./output/result.json") as data_points:
    read = data_points.read()
    content = json.loads(read)

    for point in content:
        x.append(point["x"])
        y.append(point["y"])

xpoints = np.array(x)
ypoints = np.array(y)

plt.plot(xpoints, ypoints)
plt.show()