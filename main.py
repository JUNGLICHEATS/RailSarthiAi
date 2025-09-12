from graphviz import Digraph

# Create graph with a railway/metro map metaphor
dot = Digraph("RailSaarthiAI_Railway_Map", format="png")
dot.attr(rankdir="LR", size="12")

# Station style helper
def add_station(name, label, color="lightblue", shape="circle"):
    dot.node(name, label, shape=shape, style="filled", fillcolor=color, fontcolor="black")

# Add stations (technical layers as metro stations)
add_station("data", "Data Ingestion\n(Kafka, TimescaleDB)", "lightblue")
add_station("rules", "Rules Engine\n(OR-Tools, Pyomo)", "lightgreen")
add_station("ml", "Predictive Models\n(PyTorch, TensorFlow)", "lightyellow")
add_station("opt", "Optimization Core\n(OR + RL/Heuristics)", "orange", shape="hexagon")
add_station("fusion", "Decision Fusion\n(KPI Ranking)", "lightpink", shape="box")
add_station("sim", "What-If Simulation\n(SimPy/AnyLogic)", "lightcoral")
add_station("ui", "Controller UI\n(React, FastAPI)", "lightcyan")
add_station("api", "Secure API Layer\n(REST/gRPC, TLS)", "lightgoldenrod")
add_station("output", "Output Execution\n(TMS/Kavach)", "lightseagreen", shape="doublecircle")
add_station("feedback", "Feedback Loop\n(ML Retraining)", "violet", shape="doublecircle")

# Connect stations like colored metro lines
dot.edge("data", "rules", color="blue", penwidth="3")
dot.edge("rules", "ml", color="blue", penwidth="3")
dot.edge("ml", "opt", color="red", penwidth="3")
dot.edge("opt", "fusion", color="red", penwidth="3")
dot.edge("fusion", "sim", color="green", penwidth="3")
dot.edge("sim", "ui", color="green", penwidth="3")
dot.edge("ui", "api", color="purple", penwidth="3")
dot.edge("api", "output", color="purple", penwidth="3")
dot.edge("output", "feedback", color="black", penwidth="3")
dot.edge("feedback", "data", color="black", style="dashed", penwidth="2", label=" Feedback Loop")

# Add Legend as a cluster
with dot.subgraph(name="cluster_legend") as c:
    c.attr(label="Legend", fontsize="20", style="dashed")
    c.node("normal", "Normal Station", shape="circle", fillcolor="white", style="filled")
    c.node("decision", "Decision Hub", shape="hexagon", fillcolor="white", style="filled")
    c.node("terminal", "Terminal Station", shape="doublecircle", fillcolor="white", style="filled")
    c.node("line1", "Blue Line = Data & Rules", shape="box", style="filled", fillcolor="lightblue")
    c.node("line2", "Red Line = ML & Optimization", shape="box", style="filled", fillcolor="lightcoral")
    c.node("line3", "Green Line = Simulation", shape="box", style="filled", fillcolor="lightgreen")
    c.node("line4", "Purple Line = API & Output", shape="box", style="filled", fillcolor="plum")
    c.node("line5", "Dashed = Feedback Loop", shape="box", style="dashed")

# Save and render diagram
output_path = "/mnt/data/railsaarthiai_railway_map_with_legend"
dot.render(output_path)

output_path + ".png"