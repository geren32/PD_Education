jQuery(function ($) {

		var maps = [],
				mapStyles = [ { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#e9e9e9" }, { "lightness": 17 } ] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" }, { "lightness": 20 } ] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#ffffff" }, { "lightness": 17 } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 } ] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#ffffff" }, { "lightness": 18 } ] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [ { "color": "#ffffff" }, { "lightness": 16 } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" }, { "lightness": 21 } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#dedede" }, { "lightness": 21 } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 } ] }, { "elementType": "labels.text.fill", "stylers": [ { "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#f2f2f2" }, { "lightness": 19 } ] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [ { "color": "#fefefe" }, { "lightness": 20 } ] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 } ] }],
				ibOptions = {
						alignBottom: true,
						content: 'text',
						pixelOffset: new google.maps.Size(-150, -40),
						boxStyle: {
								width: "300px"
						},
						closeBoxMargin: "5px 5px 5px 5px",
						closeBoxURL: 'img/icon-close.png'
				},
				ib = new InfoBox(ibOptions);

		function Map(id, mapOptions) {
				this.map = new google.maps.Map(document.getElementById(id), mapOptions);
				this.markers = [];
				this.infowindows = [];
				this.clusters = null;
		}

		function addMarker(mapId, location, index, string, image) {
				maps[mapId].markers[index] = new google.maps.Marker({
						position: location,
						map: maps[mapId].map,
						icon: {
								url: image
						}
				});

				var content = '<div class="info-box">' + string + '</div>';

				google.maps.event.addListener(maps[mapId].markers[index], 'click', function () {
						ib.setContent(content);
						ib.setPosition(location);
						ib.open(maps[mapId].map);
				});

		}

		function initialize(mapInst) {

			var lat = mapInst.attr("data-lat"),
					lng = mapInst.attr("data-lng"),
					myLatlng = new google.maps.LatLng(lat, lng),
					setZoom = parseInt(mapInst.attr("data-zoom")),
					mapId = mapInst.attr('id');

			var mapOptions = {
					zoom: setZoom,
					disableDefaultUI: true,
					scrollwheel: false,
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.RIGHT_BOTTOM
					},
					streetViewControl: false,
					streetViewControlOptions: {
						position: google.maps.ControlPosition.LEFT_BOTTOM
					},
					fullscreenControl: false,
					center: myLatlng,
					styles: mapStyles
			};

			maps[mapId] = new Map(mapId, mapOptions);

			$('.marker[data-rel="' + mapId + '"]').each(function (i, el) {
					addMarker(
							mapId,
							new google.maps.LatLng(
									$(this).attr('data-lat'),
									$(this).attr('data-lng')
							),
							i,
							$(this).attr('data-string'),
							$(this).attr('data-image')
					);
			});

		}

		$('.map').each(function () {
				initialize($(this));
		});

});