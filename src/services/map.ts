import { Injectable } from '@angular/core'
import Map from 'ol/MAP'
import View from 'ol/View'
import { get as fromLonLat, getTransform } from 'ol/proj'
import TileLayer from 'ol/layer/tile'
import LayerVector from 'ol/layer/vector'
import SourceVector from 'ol/source/vector'
import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/feature'
import Image from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'
import TileImage from 'ol/source/tileimage'
import {Draw, Modify, Snap} from 'ol/interaction.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle} from 'ol/style.js';


import Overlay from 'ol/Overlay'
import Style from 'ol/style/style'
import Stroke from 'ol/style/stroke'
import Fill from 'ol/style/fill'
import Text from 'ol/style/text'
import Circle from 'ol/style/circle'
import Icon from 'ol/style/icon'
import Geometry from 'ol/geom/geometry'
import Point from 'ol/geom/point'
import MultiPoint from 'ol/geom/multipoint'
import MultiPolygon from 'ol/geom/multipolygon'
import Extent from 'ol/extent'
import Cluster from 'ol/source/cluster'
import Heatmap from 'ol/layer/Heatmap'
import OSM from 'ol/source/OSM'
import olInteraction from 'ol/interaction'
import InteractionMouseWheelZoom from 'ol/interaction/mousewheelzoom'
import Wkt from 'ol/format/wkt'
import loadingstrategy from 'ol/loadingstrategy'
import Easing from 'ol/easing'
import LineString from 'ol/geom/linestring'
import Stamen from 'ol/source/stamen'
import {getErrorLogger} from "@angular/core/src/errors";
import {Http} from "@angular/http";

export class MapService {
  _view
  _map
  _vector
  _source
  _modify
  _draw
  _snap
  _raster
  _typeSelect
  baseMaps = [];
  map: Map;
  view: View;


  worldThematicLayers = [
    { id: 0, displayName: 'Nüfus Dağılımı', url: 'YTB:an_dunya_nufus_2016', layer: undefined , info: false},
    { id: 1, displayName: 'Barış Endeksi', url: 'YTB:tm_dunya_baris_endeksi', layer: undefined, info: false },
    { id: 3, displayName: 'Müslüman Nüfüs', url: '	YTB:tm_dunyadaki_musluman', layer: undefined, info: false },
    { id: 2, displayName: 'Hristiyan Nüfüs', url: 'YTB:tm_dunyadaki_hiristyan', layer: undefined, info: false },
    { id: 4, displayName: 'Eğitimde Devlet Bütçesi', url: 'YTB:tm_egitime_ayirlan_devlet_butcesi', layer: undefined,info: false },
    { id: 5, parentId: 6, displayName: 'TİKA Temsilcilikleri', url: 'YTB:tika',layer: undefined, visible: false, icon: 'tika.png' },
  ];
  constructor() { }
  createMap(mapElement) {
    this._view = new View({
      center: [6.661594, 38.433237],
      zoom: 3,
      minZoom: 2,
      maxZoom: 20,
    })
    this._map = new Map({
      target: mapElement,
      view: this._view,
      controls: []
    })

    // this._raster = new TileLayer({
    //   source: new OSM()
    // });
    //
    // this._source = new VectorSource();
    // this._vector = new VectorLayer({
    //   source: this._source,
    //   style: new Style({
    //     fill: new Fill({
    //       color: 'rgba(255, 255, 255, 0.2)'
    //     }),
    //     stroke: new Stroke({
    //       color: '#ffcc33',
    //       width: 2
    //     }),
    //     image: new CircleStyle({
    //       radius: 7,
    //       fill: new Fill({
    //         color: '#ffcc33'
    //       })
    //     })
    //   })
    // });


    // this._modify = new Modify({source: this._source});
    // this._map.addInteraction(this._modify);
    //
    // this._typeSelect = document.getElementById('type');
  }
  setMap(map){
    this._map = map
  }
  createBaseMaps() {
    const googleRoad = new TileLayer({
      source: new TileImage({ url: 'http://mt1.google.com/vt/lyrs=m@113&hl=tr&&x={x}&y={y}&z={z}' }),
      visible: true
    })
    const googleHybrit = new TileLayer({
      source: new TileImage({ url: 'http://mt1.google.com/vt/lyrs=y@113&hl=tr&&x={x}&y={y}&z={z}' }),
      visible: false
    })
    const googleSat = new TileLayer({
      source: new TileImage({ url: 'http://mt1.google.com/vt/lyrs=s@13&hl=tr&&x={x}&y={y}&z={z}' }),
      visible: false
    })
    this._map.addLayer(googleRoad)
    this._map.addLayer(googleHybrit)
    this._map.addLayer(googleSat)

    this.baseMaps.push({ baseMap: googleRoad, displayName: 'Yol', style: { cursor: 'pointer' } });
    this.baseMaps.push({ baseMap: googleHybrit, displayName: 'Uydu', style: { cursor: 'pointer' } });
    this.baseMaps.push({ baseMap: googleSat, displayName: 'Hibrid', style: { cursor: 'pointer' } });
  }
  animateZoom(zoomLevel) {
    this._map.getView().animate({
      zoom: this._map.getView().getZoom() + zoomLevel,
      duration: 450
    })
  }
  createGlobalThematicLayers() {
    for (let thematicLayer of this.worldThematicLayers) {
      let imageWMS = new ImageWMS({
        url: "http://192.168.20.114:8091/geoserver/YTB/ows",
        params: { 'LAYERS': thematicLayer.url },
        serverType: 'geoserver'
      });
      let image = new Image({
        source: imageWMS,
        visible: false,
        opacity: 0.5
      });
      thematicLayer.layer = image;
      this._map.addLayer(image);
    }
  }
  addInteraction() {
    this._draw = new Draw({
      source: this._source,
      type: this._typeSelect.value
    });
    this._map.addInteraction(this._draw);
    this._snap = new Snap({source: this._source});
    this._map.addInteraction(this._snap);
  }
}
