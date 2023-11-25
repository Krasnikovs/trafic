#!/bin/bash

# @Bevywise.com IOT Initiative. All rights reserved 
# www.bevywise.com Email - support@bevywise.com
#
# Shell script to start the broker. The broker will start based on the port 
# specified in the <Product_home>/conf/broker.conf file.  

#Finding Script Path and cd To Script Path

SCRIPT=$0
SCRIPTPATH=`dirname $SCRIPT`
cd $SCRIPTPATH

# Setting up the path required 
export PATH=.:lib:bin:python:$PATH


# Starting the Broker

../lib/MQTTRoute "$@"
