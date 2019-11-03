const AudioContext = require('web-audio-engine').StreamAudioContext;
const Speaker = require('speaker');

module.exports = class Synth {
	constructor() {
		this.active = false;

		this.context = new AudioContext();
		this.context.pipe(new Speaker());

		this.osc = this.context.createOscillator();
		this.gain = this.context.createGain();

		this.osc.type = 'sawtooth';
		this.osc.connect(this.gain);
		this.gain.gain.value = 0;
		this.gain.connect(this.context.destination);
		this.osc.start();

		this.context.resume();

		this.stopNote = this.stopNote.bind(this);
		this._setFreqVol = this._setFreqVol.bind(this);
		this.startNote = this.startNote.bind(this);
		this.updateNote = this.updateNote.bind(this);
	}

	_setFreqVol(freq, vol) {
		if (freq) {
			this.osc.frequency.value = freq;
		}

		if (vol) {
			this.gain.gain.value = vol;
		}
	}

	startNote(freq, vol) {
		this.active = true;

		this._setFreqVol(freq, vol);
	}

	updateNote(freq, vol) {
		this._setFreqVol(freq, vol);
	}

	stopNote() {
		this.active = false;
		this.gain.gain.value = 0;
	}
};
