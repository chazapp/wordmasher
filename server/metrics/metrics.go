package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	WSClients = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "websocket_clients",
		Help: "A Gauge for the number of connected WebSocket clients",
	})
)
