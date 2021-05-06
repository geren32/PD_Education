let GeoLocation = {};

jQuery(function($)  {

    "use strict";

    let markers = [], staticMarkers = [], map, myLatlng, marker, image;

    let ibOptions = {
            alignBottom: true,
            content: 'text',
            pixelOffset: $(window).width() < 1199 ? new google.maps.Size(-160, 305) : new google.maps.Size(100, 255),
            boxStyle: $(window).width() < 1199 ? {width: "320px"} : {width: "393px"},
            closeBoxMargin: "-22px -22px",
            closeBoxURL: '/img/icon-close.png'
        },
        ib = new InfoBox(ibOptions);

    // Create markers
    function addMarker(location){
        image = {
            url: $('#map').attr('data-map-marker'),
            // scaledSize : new google.maps.Size(43, 57),
        };
        marker = new google.maps.Marker({
            position: location,
            icon: image,
        });

        markers.push(marker);
        marker.setMap(map);
        map.panTo(location);
    }

    function addStaticMarker(location, map, string, image, activeImage ) {
        const staticMarker = new google.maps.Marker({
            position: location,
            map: map,
            icon: image,
            mainImage: image,
            activeIcon: activeImage,
            active: false
        });
        const content = '<div class="info-box">' + string + '</div>';
        google.maps.event.addListener(staticMarker, 'click', function () {
            ib.setContent(content);
            ib.setPosition(location);
            ib.open(map);

            staticMarkers.forEach(function(marker) {
                marker.active = false;
                marker.setIcon(marker.mainImage);
            });

            map.setCenter(location);
            this.setIcon(this.activeIcon);
            this.active = true;
        });

        staticMarkers.push(staticMarker)
    }

    // initialize map
    function initialize() {
        const $mapEL = $('#map');
        let lat = $mapEL.attr("data-lat"),
            lng = $mapEL.attr("data-lng");

        myLatlng = new google.maps.LatLng(lat,lng);

        let setZoom = parseInt($mapEL.attr("data-zoom"));

        let styles = [];
        let styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

        let mapOptions = {
            zoom: setZoom,
            zoomControl: true,
            center: myLatlng,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            },
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false
        };

        // google Autocomplete options
        let southWestLatLng = new google.maps.LatLng({lat: 49.7656834, lng: 23.8685913}),
            northEastLatLng = new google.maps.LatLng({lat: 49.906071, lng: 24.166724}),
            lvivAutocompleteBounds = new google.maps.LatLngBounds(southWestLatLng, northEastLatLng);

        let options = {
            types: ['address'],
            componentRestrictions: {country: "ua"},
            bounds: lvivAutocompleteBounds,
            strictBounds: true
        };

        if ( $('#deliveryStreet').length ) {  // delivery page autocomlete
            let deliveryStreet = new google.maps.places.Autocomplete( // delivery page autocomlete
                (document.getElementById('deliveryStreet')),
                options
            );

            google.maps.event.addListener(deliveryStreet, 'place_changed', function() {
                let place = deliveryStreet.getPlace(),
                    newLocation;

                if ( !place.geometry.location ) return false;

                if ( markers.length ) {
                    for( let i=0; i < markers.length; i++ ){
                        markers[i].setMap(null);
                    }
                    map.panTo(myLatlng);
                }

                newLocation = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
                smoothZoomMap(map, 15);
                addMarker(newLocation);

            });
        }

        //Create map
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        $('.marker').each(function (i, el) {
            addStaticMarker(
                new google.maps.LatLng(
                    $(this).attr('data-lat'),
                    $(this).attr('data-lng')
                ),
                map,
                $(this).attr('data-string'),
                $(this).attr('data-image'),
                $(this).attr('data-image-active'),
                $(this).attr('data-delivery')
            )
        });

        map.addListener('click', function() {
            ib.close();
            staticMarkers.forEach(function(marker) {
                marker.active = false;
                marker.setIcon(marker.mainImage);
            });
        });

        ib.addListener('closeclick', function() {
            staticMarkers.forEach(function(marker) {
                marker.active = false;
                marker.setIcon(marker.mainImage);
            });
        });

    }

    // Smooth map zoom
    function smoothZoomMap(map, targetZoom){
        let currentZoom = arguments[2] || map.getZoom();
        if (currentZoom != targetZoom){
            google.maps.event.addListenerOnce(map, 'zoom_changed', function (event) {
                smoothZoomMap(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 1 : -1));
            });
            setTimeout(function(){ map.setZoom(currentZoom) }, 100);
        }
    }

    // Load map
    if ($('#map').length) {
        setTimeout(function(){
            initialize();
        }, 500);
    }

});
