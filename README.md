# ruuvi

A simple node application, which logs Ruuvitag data to InfluxDB and visualized by Grafana. Provides also a simple web interface.

Can be installed on a Raspberry Pi 3

## Prerequisites

* Install Node
```
curl -sL https://deb.nodesource.com/setup_8.x | bash -
```

* BLE (Bluetooth low energy) and run without root
```
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
sudo apt-get install libcap2-bin
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

* Install InfluxDB
```
sudo apt-get update && sudo apt install apt-transport-https curl
curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
sudo apt-get update && sudo apt-get install influxdb
sudo systemctl enable influxdb
```

* Install Grafana
```
sudo apt-get install apt-transport-https curl
curl https://bintray.com/user/downloadSubjectPublicKey?username=bintray | sudo apt-key add -
sudo apt-get install grafana
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable grafana-server
```
