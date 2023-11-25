#!/bin/bash

# @Bevywise.com IOT Initiative. All rights reserved 
# www.bevywise.com Email - support@bevywise.com
#
# Shell script to stop the broker. The broker will stop based on the processid 
# Clear the port specified in the <Product_home>/conf/broker.conf file.  

#Finding Script Path and cd To Script Path

SCRIPT=$0
SCRIPTPATH=`dirname $SCRIPT`
cd $SCRIPTPATH


# Stoping the Broker

echo "Stoping Bevywise MQTTRoute....		"
file_name=Broker.pid
PID=`cat $file_name`
kill $PID
echo "Thanks for using BevyWise MQTTRoute"

