/**
 * @requires ./canvaslayer.js
 * @requires ./rest.js
 * @requires ./ui.js
 */

L.SensorLayer = L.FeatureGroup.extend({
	initialize: function (opts) {
		L.FeatureGroup.prototype.initialize.call(this, opts)
		L.Util.setOptions(this, opts)
		let markers = []

		function clicked(e) {
			const device = e.target.options['id']
			rest.getDeviceMeasurements({id: device, h:1}, opts.showDeviceData)
		}

		function dragend() {
			canvasTiles.redraw()
		}
		let _this = this
		//Temp. download all
		rest.getBboxMeasurements({bl: '-100,-100',ur: '100,100', h:'1'}, (data) => {
			for (let k in data) {
				let marker = L.marker(data[k]['loc'],
					{title: 'i', id: data[k]['device'], 'pm2.5': data[k]['values']['pm25'], draggable:'true'})
				marker.on('click', clicked)
				marker.on('dragend', dragend)
				_this.addLayer(marker)
				markers.push(marker)
			}
		})

		var canvasTiles = new L.CanvasLayer({
			opacity: 0.5,
			getMarkers: () => {
				return markers //TODO: INDEX
			},
			getValue: (marker) => {
				return marker.options['pm2.5'];
			}
		})

		this.addLayer(canvasTiles)
	}
})

L.sensorLayer = function (opts) {
	return new L.SensorLayer(opts)
}
