import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import {MapService} from "../../services/map";

import { Proj } from 'ol/proj';
import Map from 'ol/MAP'
import View from 'ol/View'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  @ViewChild('map')
  private mapEl: ElementRef;
    olMap: Map;
  // osm: OlOSM;
  // source: OlXYZ;
  // layer: OlTileLayer;
  _view: View;
  _map: Map;
  baseMaps = [];
  // @Output() mapInitialized = new EventEmitter<Map>();
  constructor(public navCtrl: NavController , public mapService: MapService) {}
  ngOnInit() {
    this._view = new View({
      center: [6.661594, 38.433237],
      zoom: 3,
      minZoom: 2,
      maxZoom: 20,
    })
    this._map = new Map({
      target: document.getElementById('olMAP'),
      view: this._view,
      controls: []
    })
    // this.mapService.createMap(document.getElementById('olMAP'));

    this.mapService.setMap(this._map);
    // this.mapInitialized.emit(this._map)
    this.mapService.createBaseMaps();
    this.mapService.createGlobalThematicLayers();
  }
  zoomIn(){
    this.mapService.animateZoom(1);
  }
  zoomOut(){
    this.mapService.animateZoom(-1);
  }

  enableBaseMap(clickedBaseMap) {
    for (let baseMap of this.mapService.baseMaps) {
      if (baseMap.baseMap.getVisible()) {
        baseMap.baseMap.setVisible(false);
        break;
      }
    }
    clickedBaseMap.baseMap.setVisible(true);
  }
  enableThematicLayer(clickedLayer) {

    for (let thematicLayer of this.mapService.worldThematicLayers) {
      if (thematicLayer.layer != clickedLayer.layer) {
        thematicLayer.layer.setVisible(false);
      }
    }
    if (clickedLayer.layer.getVisible()) {
      clickedLayer.layer.setVisible(false);
    } else {

      clickedLayer.layer.setVisible(true);
      console.log("Layers are :", clickedLayer);
    }
  }
  clearGlobalThematicLayer() {
    for (let thematicLayer of this.mapService.worldThematicLayers) {
      thematicLayer.layer.setVisible(false);
    }


  }
  zoomToMyLocation() {
    this.mapService._map.getView().getCenter();
  }
}
