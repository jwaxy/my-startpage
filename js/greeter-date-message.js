class GreeterDateMessage {

	constructor() {
		this._greeterMessage = document.querySelector('#greeterMessage');	
		this._dateMessage = document.querySelector('#dateMessage');
		
		this._monthsArr = [
		    'Ocak\'ın',
		    'Şubat\'ın',
		    'Mart\'ın',
		    'Nisan\'ın',
		    'Mayıs\'ın',
		    'Haziran\'ın',
		    'Temmuz\'un',
		    'Ağustos\'un',
		    'Eylül\'ün',
		    'Ekim\'in',
		    'Kasım\'ın',
		    'Aralık\'ın'
		];

		this._daysArr = [
			'Pazar',
			'Pazartesi',
			'Salı',
			'Çarşamba',
			'Perşembe',
			'Cuma',
			'Cumartesi'
		];

		this._updateGreeterDateMessage();
	}

	_getDayOrdinal = (num) => { 
	  if (num.toString().length < 2) {
	    var first_digit = null;
	    var last_digit = num;
	  } else {
	    var first_digit = parseInt(num.toString()[0]);
	    var last_digit = parseInt(num.toString()[1]);
	  }

	  var last_words = ["", "biri", "ikisi", "üçü", "dördü", "beşi", "altısı", "yedisi", "sekizi", "dokuzu"];

	  if (first_digit == 1) {
	    if (last_digit == 0) {
	      return "onu";
	    } else {
	      return "on " + last_words[last_digit];
	    }
	  } else if (first_digit == 2) {
	    if (last_digit == 0) {
	      return "yirmisi";
	    } else {
	      return "yirmi " + last_words[last_digit];
	    }
	  } else if (first_digit == 3) {
	    if (last_digit == 0) {
	      return "otuzu";
	    } else {
	      return "otuz " + last_words[last_digit];
	    }
	  } else if (first_digit == null) {
	    return last_words[last_digit];
	  }
	}

	_updateGreeterDateMessage = () => {

		const date = new Date();
		const hour = date.getHours();
		let greeterSuffix = '';

		if (hour >= 6 && hour < 12) {
			greeterSuffix = 'Sabahlar';

		} else if (hour >= 12 && hour < 18) {
			greeterSuffix = 'Öğlenler';

		} else {
			greeterSuffix = 'Akşamlar';
		}

		this._greeterMessage.innerText = `İyi\n${greeterSuffix}!`;
		this._dateMessage.innerText = `Bugün ${this._monthsArr[date.getMonth()]} ` +
									`${this._getDayOrdinal(date.getDate())}, | ${this._daysArr[date.getDay()]}.`;
	}

}
