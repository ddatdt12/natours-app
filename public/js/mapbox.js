/*  eslint-disable  */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGRhdGR0MTIiLCJhIjoiY2tyN200MHRtM3FpeDJubGZwdXhhZWE0eCJ9.-D03062BJrCrDkoCRzWB8w';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ddatdt12/ckr7mu9et3igz17l2eb9qvcq0',
    scrollZoom: true,
    // center: [-118.113491, 34.111745],
    zoom: 0.001,
    interactive: true
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 300,
      bottom: 300,
      left: 100,
      right: 100
    }
  });
};
