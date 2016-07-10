/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

#include "ros/ros.h"
#include "geometry_msgs/Twist.h"
#include "geometry_msgs/Pose.h"
#include <turtlesim/Pose.h>
#include <sstream>
#include <math.h>

#define maxY 11.08888912
#define PI 3.14159265
#define ni   5 // puntas de la estrella

std::vector<turtlesim::Pose> STAR;
bool objective_reached = false;
bool start_point_reached = false;
bool rotation_reached = false;
double thetaObjective = 0;

int actual_objective = 0;

bool first_time = true;


turtlesim::PoseConstPtr pose_d;
geometry_msgs::Pose pasicion;
geometry_msgs::Pose pose_actual;
turtlesim::Pose startPose;


bool hasReachedObjective(){
    return fabsf(pose_d->x - STAR[actual_objective].x) < 0.1 && fabsf(pose_d->y - STAR[actual_objective].y) < 0.1;
}

bool hasReachedStartPoint(){
    return fabsf(pose_d->x - startPose.x) < 0.1 && fabsf(pose_d->y - startPose.y) < 0.1;
    
}

bool hasReachedRotation(){
    return (bool)(fabsf(pose_d->theta - thetaObjective) < 0.01);    
}


//double ly(double y) { return maxY - y; }

void computePolygon(turtlesim::PoseConstPtr center)
{
    turtlesim::Pose aux;
    double r = 2,
           cx = center->x - r,
           cy = center->y,
           px = center->x + r,
           py = center->y,
           theta = 2*PI/ni,
           beta = atan2(py - cy, px - cx),
           x, y, xPrime, yPrime;
 
    STAR.clear();
 
    for (int i = 0; i < ni; i++) {
        x = r * cos(i * theta);
        y = r * sin(i * theta);
 
        // Rotate the polygon such that the mouse click matches the  polygon corner
        xPrime = x * cos(beta) - y * sin(beta);
        yPrime = x * sin(beta) + y * cos(beta);
        
        // Translate the polygon to it's original position
        xPrime += cx;
        yPrime += cy;
        aux.x = xPrime;
        aux.y = yPrime;
        
        STAR.push_back(aux);
    }
 
}

void newThetaObjective(){
    double d_x;
    double d_y;
    double thetaAux;
    d_x = STAR[actual_objective].x - pose_d->x;
    d_y = STAR[actual_objective].y - pose_d->y;
    thetaAux = fabs(atan2(d_y, d_x));
    
    if(d_y <0){//abajo
        thetaObjective = (2 * PI) - thetaAux;
        
    }else{
        thetaObjective = thetaAux;
    }        
}
void poseCallBack(const turtlesim::PoseConstPtr& pose){
    pose_d = pose;
        
    if(first_time){
        ROS_INFO_NAMED("circle", "First pose received");
        first_time = false;
        startPose.x = pose->x;
        startPose.y = pose->y;
        startPose.theta = pose->theta;
        computePolygon(pose);        
    }
    if(hasReachedRotation()){
        ROS_INFO_ONCE_NAMED("circle", "Rotation reached");
        rotation_reached = true;
    }
    if(hasReachedObjective()){
        ROS_INFO_ONCE_NAMED("circle", "Objective reached");
        objective_reached = true;
        rotation_reached = false;
    }

    if(hasReachedStartPoint()){
        ROS_INFO_ONCE_NAMED("circle", "Start Point reached");
        start_point_reached = true;
    }
}

int main(int argc, char **argv) {
    // Initiate new ROS node named "talker"
    ros::init(argc, argv, "publisherStar");
    ros::NodeHandle n;

    ros::Subscriber pose_subscriber = n.subscribe("/turtle1/pose", 100, &poseCallBack);
    ros::Publisher velocity_publisher = n.advertise<geometry_msgs::Twist>("/turtle1/cmd_vel", 100);
    ros::Rate loop_rate(100); //1 message per second

    int count = 0;
    while (ros::ok()) // Keep spinning loop until user presses Ctrl+C
    {

        ros::spinOnce(); // Need to call this function often to allow ROS to process incoming messages
        geometry_msgs::Twist vel_msg;

        if (!first_time) {
            if (objective_reached) {

                actual_objective += 2;
                if (actual_objective > 4) {
                    actual_objective -= 5;
                }
                newThetaObjective();
                objective_reached = false;
            }  
            else if (!rotation_reached) {
                //set a random linear velocity in the x-axis
                vel_msg.linear.x = 0;
                vel_msg.linear.y = 0;
                vel_msg.linear.z = 0;
                //set a random angular velocity in the y-axis
                vel_msg.angular.x = 0;
                vel_msg.angular.y = 0;
                vel_msg.angular.z = (double) 1.0;

            } else if (rotation_reached) {
                //set a random linear velocity in the x-axis
                vel_msg.linear.x = (double) 1.0;
                vel_msg.linear.y = 0;
                vel_msg.linear.z = 0;
                //set a random angular velocity in the y-axis
                vel_msg.angular.x = 0;
                vel_msg.angular.y = 0;
                vel_msg.angular.z = 0;
            }


        } else {
            //set a random linear velocity in the x-axis
            vel_msg.linear.x = 0;
            vel_msg.linear.y = 0;
            vel_msg.linear.z = 0;
            //set a random angular velocity in the y-axis
            vel_msg.angular.x = 0;
            vel_msg.angular.y = 0;
            vel_msg.angular.z = 0;

        }

        //publish the message
        velocity_publisher.publish(vel_msg);
        
        loop_rate.sleep(); // Sleep for the rest of the cycle, to enforce the loop rate
        count++;
    }
    return 0;
}
