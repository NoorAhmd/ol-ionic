import {Component, Input, OnInit} from '@angular/core';
import Map from 'ol/MAP'

import TileLayer from 'ol/layer/tile'
import {Draw, Modify, Snap} from 'ol/interaction.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle} from 'ol/style.js';


import Style from 'ol/style/Style'
import Stroke from 'ol/style/stroke'
import Fill from 'ol/style/fill'
import OSM from 'ol/source/OSM'

@Component({
  selector: 'map-drawer',
  templateUrl: 'map-drawer.html'
})
export class MapDrawerComponent implements OnInit{
  @Input() map : Map;
  // @Input() isEnabled: boolean = false

  constructor() {
    console.log('Hello MapDrawerComponent Component');

  }
  _raster
  _source
  _vector

  ngOnInit(): void {
    this._raster = new TileLayer({
      source: new OSM()
    });

    this._source = new VectorSource();
    this._vector = new VectorLayer({
      source: this._source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33'
          })
        })
      })
    });

    let modify = new Modify({source: this._source});
    this.map.addInteraction(modify);
    this.map.addLayer(this._vector)
    // this._modify = new Modify({source: this._source});
    // this._map.addInteraction(this._modify);
    //
    // this._typeSelect = document.getElementById('type');
  }
  _draw
  _snap
  onSelected(event){
    console.log('EVENT', event)
    // console.log('map', this.map)

    if(this._draw){
      this.map.removeInteraction(this._draw);
      this.map.removeInteraction(this._snap);
    }

    this._draw = new Draw({
      source: this._source,
      type: event
    });
    this.map.addInteraction(this._draw);
    this._snap = new Snap({source: this._source});
    this.map.addInteraction(this._snap);

  }



}
