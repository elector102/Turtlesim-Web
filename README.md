# Turtlesim-Web

This project has a ROS node that draws a Star and a Meteor web application using 
three.js (WebGL) that connect with ROS and replicate the TurtleSim movement.

This project runs on Ubuntu 14.04.

To install and configure run setup.sh (install packages for ROS indigo).


#Run Turtlesim-Web


##ROS


In separate terminals, start: 

> roscore  --> [RosCore](http://wiki.ros.org/roscore)

>rosrun turtlesim turtlesim_node   -->   [TurtleSim](http://wiki.ros.org/turtlesim/Tutorials)


>roslaunch rosbridge_server rosbridge_websocket.launch   -->   [RosBridge](http://wiki.ros.org/rosbridge_suite)


##Web Page

in Turtlesim-Web/turtlesim-web-app run in another terminal:

> meteor

Wait for : "=> App running at: http://localhost:3000/"


Now go to the browser and run : http://localhost:3000/


Meteor comunicates with [rosbridge](http://wiki.ros.org/rosbridge_suite) through a WebSocket(created for rosbridge) 
on port 9090 by default. and meteor uses [roslibjs](http://wiki.ros.org/roslibjs).

## Draw Start

in a terminal run:

>rosrun turtlesim_web publisher_star

