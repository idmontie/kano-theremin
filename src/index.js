const debug = require('debug')('theremin');
const DeviceManager = require('./kano').DeviceManager;
const MotionSensorKit = require('./kano').MotionSensorKit;

const Synth = require('./Synth');

DeviceManager.listConnectedDevices()
	.then((devices) => {
		// Filter devices to find a Motion Sensor Kit
		const msk = devices.find((device) => {
			return device instanceof MotionSensorKit;
		});

		if (!msk) {
			debug('No Motion Sensor Kit was found, exiting');
			process.exit();
		}

		const synth = new Synth();
		const P_MAX = 255;

		debug('Synth started');

		msk.setMode('proximity')
			.then(() => {
				debug('Proximity sensor started');
			});

		msk.on('proximity', (p) => {
			// Sometimes the sensor whill pick up a random 1 value
			if (p > 0 && p !== 1) {
				debug('Proximity value:', p);

				const freq = ~~(500 * (1 - ((p) / P_MAX)));
				const vol = 0.1;

				if (synth.active) {
					synth.updateNote(freq);
				} else {
					synth.startNote(freq, vol);
				}
			} else {
				if (synth.active) {
					debug('Stopping:', p);
    
					synth.stopNote();
				}
			}
		});
	}).catch((e) => {
		console.error(e);
		process.exit();
	});
