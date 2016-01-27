abstract class Asset {
  ready : boolean = false;
  onReady: (asset: Asset) => any = function ( asset : Asset) {};
}
