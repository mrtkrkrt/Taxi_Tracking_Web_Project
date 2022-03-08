* fetch('https://localhost:3000/login')
   .then(response => response.json())
   .then(data => this.setState({ totalReactPackages: data.total }));

* Api yazılacak
* Veriler temizlenip kaydedilecek
* Program başında çekilen veriler map üzerinde gösterilecek
* Bunlara message brocker eklenecek