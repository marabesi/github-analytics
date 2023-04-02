import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

x = []
y = []

data = pd.read_json("./output/result.json")

grouped = data.groupby("x")

for name, group in grouped:
    x.append(name)
    y.append(grouped.get_group(name).y.sum())

xpoints = np.array(x)
ypoints = np.array(y)

plt.title("Time taken to run the test with coverage in github actions")
plt.xlabel('Time in seconds')
plt.ylabel('Workflow runs')
plt.plot(xpoints, ypoints)
plt.show()
