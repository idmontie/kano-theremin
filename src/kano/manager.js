const SerialPort = require('serialport');
const MotionSensor = require('./motionsensorkit.js');
const PixelKit = require('./retailpixelkit.js');
const vendorIds = {
	'2341': 'msk',
	'0403': 'rpk'
};
const productIds = {
	'814e': 'msk',
	'6015': 'rpk'
};

class DeviceManager {
	/**
     * Request all the connected Kano devices. It resolves the promise with an array
     * of classes representing the connected devices and ready to use (no need to
     * connect or configure).
     *
     * @return {Promise}
     */
	static listConnectedDevices() {
		return SerialPort.list()
			.then((ports) => {
				// Filter only ids that exist on the `vendorIds` dictionary
				const serialPorts = ports.filter((port) => {
					if(port.vendorId && port.productId) {
						const vid = port.vendorId.toLowerCase();
						const pid = port.productId.toLowerCase();
						return vendorIds[vid] && productIds[pid];
					}
				});

				const devicesPromise = serialPorts.map((port) => {
					switch(vendorIds[port.vendorId]) {
					case 'msk': {
						const msk = new MotionSensor({
							path: port.path,
							SerialChannel: this.SerialChannel
						});
						return msk.connect();
					}
					case 'rpk': {
						const rpk = new PixelKit({
							path: port.path,
							SerialChannel: this.SerialChannel
						});
						return rpk.connect();
					}
					default:
					}
				});
				return Promise.all(devicesPromise);
			});
	}
}

module.exports = DeviceManager;
