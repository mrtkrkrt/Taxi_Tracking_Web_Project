- fetch('https://localhost:3000/login')
  .then(response => response.json())
  .then(data => this.setState({ totalReactPackages: data.total }));

- Program başında çekilen veriler map üzerinde gösterilecek

- Bunlara message brocker eklenecek ( BELKİİİİİİİİ )
- Kulllanıcı verilerini portresql'e al

- renderMarkers(map, maps) {
  let marker = new maps.Marker({
  position: myLatLng,
  map,
  title: 'Hello World!'
  });
  }
- onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
- <Marker lat={props.lat} lng={props.lng}} />
