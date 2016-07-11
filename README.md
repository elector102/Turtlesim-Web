# Turtlesim-Web

This project have a ROS node that draw a Star and a Meteor web aplication using 
three.js (WebGL) that conect with ROS and replica the TurtleSim movement

This project running on Ubuntu 14.04

For install and configure run setup.sh



#Run Turtlesim-Web


##ROS


In separate terminals, start: 

>roscore   -->   [RosCore](http://wiki.ros.org/roscore)

>rosrun turtlesim turtlesim_node   -->   [TurtleSim](http://wiki.ros.org/turtlesim/Tutorials)


>roslaunch rosbridge_server rosbridge_websocket.launch   -->   [RosBridge](http://wiki.ros.org/rosbridge_suite)


##Web Page

in Turtlesim-Web/turtlesim-web-app run in other terminal:

>meteor

expected to appear : "=> App running at: http://localhost:3000/"

Now go to the browser and run : http://localhost:3000/



Meteor comunicates with [rosbridge](http://wiki.ros.org/rosbridge_suite) through a WebSocket(create for rosbridge) 
on port 9090 by depault. and meteor use [roslibjs](http://wiki.ros.org/roslibjs).



