# Download and unpack grafana
curl -O https://dl.grafana.com/oss/release/grafana-8.4.2.linux-amd64.tar.gz
tar -zxvf grafana-8.4.2.linux-amd64.tar.gz > /dev/null 2>&1
mv grafana-8.4.2 grafana
rm grafana-8.4.2.linux-amd64.tar.gz
cp grafana_defaults.ini grafana/conf/defaults.ini

# # Download and unpack prometheus
curl -L -O https://github.com/prometheus/prometheus/releases/download/v2.33.4/prometheus-2.33.4.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz > /dev/null 2>&1
mv prometheus-2.33.4.linux-amd64 prometheus
rm prometheus-2.33.4.linux-amd64.tar.gz
cp mephisto-prometheus-config.yml prometheus/prometheus-config.yml

# Run grafana in background to receive the desired defaults
cd grafana
./bin/grafana-server > /dev/null 2>&1 &
GRAFANA_PID=$!
cd ..

until $(curl --output /dev/null --silent --head --fail http://localhost:3032); do
    printf '.'
    sleep 1
done

# Copy over the Mephisto datasource
curl -X "POST" "http://localhost:3032/api/datasources" \
-H "Content-Type: application/json" \
    --user admin:admin \
    --data-binary @mephisto_source.json

# Copy over the mephisto default dashboard
curl --fail -k -X "POST" "http://localhost:3032/api/dashboards/db" \
         -H "Content-Type: application/json" \
         -H "Accept: application/json" \
         --user admin:admin \
         --data-binary @default_mephisto_dash.json

# Close grafana
kill $GRAFANA_PID

sleep 3

echo "\nInstall should have completed, please view above for errors"