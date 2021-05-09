# Change these path to the output folder in your system:

client_path = "/Path/to/metrics-client"
server_path = "/Path/to/metrics-server"

import json
import os

mi_list = []
cyc_list = []
lloc_list = []


def get_metrics_from_file(filename):
    with open(filename) as json_file:
        data = json.load(json_file)
        mi_list.append(data["metrics"]["mi"]["mi_visual_studio"])
        cyc_list.append(data["metrics"]["cyclomatic"]["sum"])
        lloc_list.append(data["metrics"]["loc"]["lloc"])


def main(filepath):
    for root, dirs, files in os.walk(filepath):
        for filename in files:
            get_metrics_from_file(root + "/" + filename)

    print("Maintanability Index:", sum(mi_list) / len(mi_list))
    print()
    print("Cyclomatic complexity:", sum(cyc_list) / len(cyc_list))
    print()
    print("Lines of code (lloc):", sum(lloc_list))
    mi_list.clear()
    cyc_list.clear()
    lloc_list.clear()


print(" ")
print("========== Metrics for client ==========")
main(client_path)
print(" ")
print("========== Metrics for server ==========")
main(server_path)
print("===================================")
print(" ")
