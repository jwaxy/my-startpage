class WeatherScreen {

	constructor() {
		this._weatherScreenVisibility = false;
		this._tempSymbol = '°C';

		this._weatherScreen = document.querySelector('#weatherScreen');
		this._weatherIcon = document.querySelector('#weatherTodayIcon');
		this._weatherLocation = document.querySelector('#weatherTodayLocation');
		this._weatherDescription = document.querySelector('#weatherTodayDescription');
		this._sunriseHour = document.querySelector('#sunriseTodayHour');
		this._sunsetHour = document.querySelector('#sunsetTodayHour');
		this._updateHour = document.querySelector('#updateTodayHour');
		this._weatherDockImageButton = document.querySelector('#buttonImageWeather');
		this._forecastContainer = document.querySelector('#forecastContainer');

		this._webMenu = document.querySelector('#webMenu');
		this._dashboard = document.querySelector('#rightDashboard');
		this._searchBoxContainer = document.querySelector('#searchBoxContainer');
	}

	_formatUnixTime = unix => {
		const date = new Date(unix*1000);
		const hour = date.getHours();
		const minutes = '0' + date.getMinutes();
		const formattedTime = hour + ':' + minutes.substr(-2);

		return formattedTime;
	}

	getWeatherScreenVisiblity = () => {
		return this._weatherScreenVisibility;
	}

	_getWeatherIcon = code => {
		const icon_tbl = {
			'01d': 'sun_icon.svg',
			'01n': 'moon_icon.svg',
			'02d': 'dfew_clouds.svg',
			'02n': 'nfew_clouds.svg',
			'03d': 'dscattered_clouds.svg',
			'03n': 'nscattered_clouds.svg',
			'04d': 'dbroken_clouds.svg',
			'04n': 'nbroken_clouds.svg',
			'09d': 'dshower_rain.svg',
			'09n': 'nshower_rain.svg',
			'10d': 'd_rain.svg',
			'10n': 'n_rain.svg',
			'11d': 'dthunderstorm.svg',
			'11n': 'nthunderstorm.svg',
			'13d': 'snow.svg',
			'13n': 'snow.svg',
			'50d': 'dmist.svg',
			'50n': 'nmist.svg'
		};

		return icon_tbl[code];
	}

	_updateWeatherDockButton = icon => {
		this._weatherDockImageButton.style.background = `url('assets/weather-icons/${icon}')`;
		this._weatherDockImageButton.style.backgroundSize = 'cover';
	}

	_setWeatherValue = (loc, desc, icon, sunr, suns, updt) => {
		
		this._weatherLocation.innerHTML = loc;
		this._weatherDescription.innerHTML = desc + this._tempSymbol;

		this._weatherIcon.style.background = `url('assets/weather-icons/${icon}')`;
		this._weatherIcon.style.backgroundSize = 'cover';

		this._sunriseHour.innerHTML = sunr;
		this._sunsetHour.innerHTML = suns;
		this._updateHour.innerHTML = updt;

		// Update weather button on dock
		this._updateWeatherDockButton(icon);
	}

	_createForecastBody = (fIcon, forecastTemp, foreDescription, fHour, fDate) => {

		// Main Div
	 	const forecastDay = document.createElement('div');
	 	forecastDay.className = 'weatherForecastDay';

	 	// Icon Container Div
	 	const forecastIconContainer = document.createElement('div');
	 	forecastIconContainer.className = 'weatherForecastDayIconContainer';

	 	// Icon Div
	 	const forecastIcon = document.createElement('div');
	 	forecastIcon.className = 'weatherForecastDayIcon';
	 	forecastIcon.style.background = `url('assets/weather-icons/${fIcon}')`;
	 	forecastIcon.style.backgroundSize = 'cover';

	 	// Details Div
	 	const forecastDetails = document.createElement('div');
	 	forecastDetails.className = 'weatherForecastDayDetails';

	 	const forecastTemperature = document.createElement('div');
	 	forecastTemperature.className = 'weatherForecastDayDetailsTemperature';
	 	forecastTemperature.innerHTML = forecastTemp;

	 	const forecastDescription = document.createElement('div');
	 	forecastDescription.className = 'weatherForecastDayDetailsDescription';
	 	forecastDescription.innerHTML = foreDescription;

	 	// Append details to div container
	 	forecastDetails.appendChild(forecastTemperature);
	 	forecastDetails.appendChild(forecastDescription);

	 	// Date Div
	 	const forecastDayDate = document.createElement('div');
	 	forecastDayDate.className = 'weatherForecastDayDate';

	 	const forecastHour = document.createElement('div');
	 	forecastHour.className = 'weatherForecastDayDateHour';
	 	forecastHour.innerHTML = fHour;

	 	const forecastDate = document.createElement('div');
	 	forecastDate.className = 'weatherForecastDayDateDate';
	 	forecastDate.innerHTML = fDate;

	 	// Append icon image to div container
	 	forecastIconContainer.appendChild(forecastIcon);

	 	// Append details to div container
	 	forecastDayDate.appendChild(forecastHour);
	 	forecastDayDate.appendChild(forecastDate);

		// Append to main div
		forecastDay.appendChild(forecastIconContainer);
		forecastDay.appendChild(forecastDetails);
		forecastDay.appendChild(forecastDayDate);

		// Append to the main container
	 	this._forecastContainer.appendChild(forecastDay);
	}


	_setErrValue = () => {
		const wLoc = 'Earth, Milky Way';
		const wDesc = 'dust & clouds, -1000';
		const wIcon = 'weather-error.svg';

		const time = '00:00';

		this._setWeatherValue(wLoc, wDesc, wIcon, time, time, time);
	}


	_processWeatherData = (data) => {

		const cityName = data.name;
		const countryName = data.sys.country;
		const weatherDescription = data.weather[0].description;
		const weatherIcon = data.weather[0].icon;
		const weatherTemp = Math.floor(data.main.temp);
		const sunRise = data.sys.sunrise;
		const sunSet = data.sys.sunset;
		const update = data.dt;

		const wLoc = cityName + ', ' + countryName;

		let wDesc = weatherDescription + ', ' + weatherTemp;
		wDesc = wDesc && wDesc[0].toUpperCase() + wDesc.slice(1)

		const wIcon = this._getWeatherIcon(weatherIcon);
		const rise = this._formatUnixTime(sunRise);
		const set = this._formatUnixTime(sunSet);
		const upd = this._formatUnixTime(update);

		this._setWeatherValue(wLoc, wDesc, wIcon, rise, set, upd);		
	}

	getWeatherData = (appID, cityID, units) => {

		const requestString = `https://api.openweathermap.org/data/2.5/weather?APPID=${appID}&id=${cityID}&units=${units}`;

		const request = new XMLHttpRequest();
		request.open('GET', requestString, true);
		request.onload = e => {
			if (request.readyState === 4 && request.status === 200 && request.status < 400) {
				this._processWeatherData(JSON.parse(request.response));
				this._tempSymbol = (units === 'metric') ? '°C' : '°F';
			} else {
				this._setErrValue();
			};
		};
		request.send();
	};


	getForecastData = (appID, cityID, units) => {

		const requestString = `https://api.openweathermap.org/data/2.5/forecast?APPID=${appID}&id=${cityID}&units=${units}`;

		const request = new XMLHttpRequest();
		request.open('GET', requestString, true);
		request.onload = e => {
			if (request.readyState === 4 && request.status === 200 && request.status < 400) {
				this._processForecastData(JSON.parse(request.response));
				this._tempSymbol = (units === 'metric') ? '°C' : '°F';
			} else {
				this._setErrValue();
			};
		};
		request.send();
	}

	_processForecastData = data => {
		
		// Empty forecast container to avoid duplication
		this._forecastContainer.innerHTML = '';

		const forecast = data.list;

		for (let i = 8; i < forecast.length; i+=8) {
			
			const foreIcon = forecast[i].weather[0].icon;
			const minimumTemp = forecast[i].main.temp_min;
			const maximumTemp = forecast[i].main.temp_max;
			const foreDescription = forecast[i].weather[0].description;
			const dateTime = forecast[i].dt_txt;

			const fIcon = this._getWeatherIcon(foreIcon);
			const minTemp = Math.floor(minimumTemp);
			const maxTemp = Math.floor(maximumTemp);
			const forecastTemp = minTemp + ' ~ ' + maxTemp + this._tempSymbol;
			const fHour = dateTime.substr(dateTime.indexOf(' ') + 1).slice(0, -3);;
			const fDate = dateTime.substr(0, dateTime.indexOf(' '));

			this._createForecastBody(fIcon, forecastTemp, foreDescription, fHour, fDate);
		}
	}

	showWeatherScreen = () => {
		this._weatherScreen.classList.add('showWeatherScreen');
	    this._weatherScreenVisibility = !this._weatherScreenVisibility;
	}

	hideWeatherScreen = () => {
		this._weatherScreen.classList.remove('showWeatherScreen');
	    this._weatherScreenVisibility = !this._weatherScreenVisibility;
	}

	toggleWeatherScreen = () => {

		console.log('toggle weather screen');

	    // If profile anim is still running,
	    // Return to avoid spam
		if (profileImage.getProfileAnimationStatus()) return;

		// Rotate profile
	    profileImage.rotateProfile();

	    if (this._weatherScreenVisibility) {
	    	// Hide weather screen
	    	this.hideWeatherScreen();

	    } else {
	    	// Show weather screen
	    	this.showWeatherScreen();  	
	    }

	    // Check if any of these are open, if yes, close it
	    if (this._webMenu.classList.contains('showWebMenu')) {
	    	console.log('web menu is open, closing...');
	    	webMenu.hideWebMenu();
	    	return;

	    } else if (this._searchBoxContainer.classList.contains('showSearchBox')) {
	    	console.log('searchbox is open, closing...');
	    	hideSearchBox();
	    	
	    } else if (this._dashboard.classList.contains('showRightDashboard')) {
	    	console.log('dashboard is open, closing...');
	    	dashboard.hideDashboard();
	    	// return;
	    }

	    // Toggle center box
	    centeredBox.toggleCenteredBox();
	}

}