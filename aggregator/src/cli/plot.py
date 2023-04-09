import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from src.config import Config

config = Config()

x = []
y = []

data = pd.read_json(config.result_destination)

grouped = data.groupby("x")

for name, group in grouped:
    x.append(name)
    y.append(grouped.get_group(name).y.sum())

xpoints = np.array(x)
ypoints = np.array(y)

plt.title("Time taken to run {} from {}".format(config.job_target, config.repository))
plt.xlabel('Time in seconds')
plt.ylabel("Workflow runs ({})".format(config.workflow_file_name))
plt.plot(xpoints, ypoints)
plt.show()
