# AirSensor Map

# Overview

AirSensor map is intended to provide an overview interface for spatiotemporal air sensor data. The (intended) interface consists of a map (Leaflet.js) with color-ramp coordinate point locations of air sensors that can be selected to show an hourly-aggregated barplot (d3.js) of the specified time-period. Futhermore, the interface includes temporal-control and updating for elements within the map and barplot, allowing the user to scurb between different time periods and play/pause timeseries air sensor data.

# Goals

    - Provide a robust spatiotemporal interface to timeseries air sensor data
    - Interface the AirSensor R package and data-structures 
    - Interface the AirSensor Dashboard Shiny architecture 

# 