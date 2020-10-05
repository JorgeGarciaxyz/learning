# Memory Leaks - Sean Townsend / VP of Eng @Apptegy

# Managed Memory

Garbage Collection is the commonly used tech for freeing memory.

Ruby, JS, java, c# all have GCs running in the background.

The GCs role in life is to clean up after you and reclaim that memory back.

The GCs try to figure out the best time to clean the application and free the memory.
These are called "safe points" and run periodically.
The GCs introduce latency and pause, for mos use-cases it is irrelevant.

## When GC is Unpopular

- Firmware, drivers and Embedded development, very small footprints.
- Latency-sensitive applications (for example trading systems)
- Game development (GC pause = FPS loss)
- Excessive GC calls are also a problem as well as no GC calls

The trading systems for example, commonly allocate a lot of memory at the beggining of the day
and they prevent the GC to fire until the market it's closed.

# Garbage Collection Strategies

There two core ways to figure it out what can be freed:
1. Reference Counting
2. Live GC Roots aka "mark and sweep"

GCs are interested in incoming referenes, not outgoing.

Reference Counting is just a metric of "how many things are using this?"
- When the RC is 0, it's assumed the object is not being used and can be freed.

GC Roots traverse object graphs, anything marked reachable from the roos is "Live"
- Anything not live can be discarded

## What's going on then?

- The problem is always long-lived references to objects
- If an object is reachable from the root, the GC will not free it
- GC is non-deterministic, it does it best when faced with code it cannot control
- RAM is cheap, some memory wiggle room is ok but there are limits
- If allocation is looped/repeated, footprint expands quickly and unbounded
- Monitoring tools will show a stepwise increase in RAM utilization
- As Heap limits are reached, reboots will be required
- It'll stress the OS, threads become unresponsive, processes will be killed

## Common Gotchas
- Circular references are very common and hard to spot
- Static fields persist and can hold a reference lock on objects
- Global-scope state continuosly pointing to things it no longer needs
- Poor view lifecycle management, object instantiation without cleanup
- Basic
