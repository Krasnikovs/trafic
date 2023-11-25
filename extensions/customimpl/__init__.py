#!/usr/bin/python2.7
###############################################################################
#
# @2018 Bevywise Networks - www.bevywise.com 
#
# This plugin helps you to receive all the data in the custom implementation.  
# Receive data from edge devices into any data store or send data to any other application.  
#
# __init__.py
#
# 
###############################################################################

from .customimpl import DataReceiver

__all__ = ['DataReceiver']
__all__ = [x.encode('ascii') for x in __all__]
