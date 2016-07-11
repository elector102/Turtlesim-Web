
echo "install other packages"

sudo apt-get install git g++ libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential

echo "install ROS and ROS packages"

sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'

sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net --recv-key 0xB01FA116


sudo apt-get update

sudo apt-get install ros-indigo-ros-base

sudo apt-get install ros-indigo-rosbridge-server ros-indigo-turtlesim 

sudo rosdep init

rosdep update
echo "source /opt/ros/indigo/setup.bash" >> ~/.bashrc
source ~/.bashrc

echo
echo "install meteor"
curl https://install.meteor.com/ | sh

echo
echo "get code and compile"
cd ros_ws/
catkin_make
source devel/setup.bash

cd ..
cd turtlesim-web-app
meteor add mrt:three.js
meteor

echo " Install completed"