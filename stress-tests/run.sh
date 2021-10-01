#!/bin/bash

url_api=$(gp url 8080)
function_name="grain.hey"
function_version="0.0.0"
data='{"name":"Bob"}'

hey -n 300 -c 150 -m POST -T "Content-Type: application/json" -d ${data} "${url_api}/functions/${function_name}/${function_version}"

# This opens 150 connections, and sends 300 requests. 
