#!/bin/bash

clean_up() {
  echo "Cleaning up services..."
  docker service rm nginx-viz
  docker service rm httpd-viz
  exit
}
trap 'clean_up' SIGINT

docker service create --name nginx-viz nginx &
docker service create --name httpd-viz httpd
wait

while true;
do
  NCOUNT=$((1 + RANDOM % 10))
  HCOUNT=$((1 + RANDOM % 10))
  docker service scale nginx-viz=$NCOUNT &
  docker service scale httpd-viz=$HCOUNT &
  wait
done

