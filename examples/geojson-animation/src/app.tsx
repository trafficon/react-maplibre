/* global window */
import * as React from 'react';
import {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Map, Source, Layer} from '@vis.gl/react-maplibre';
import type {LayerProps} from '@vis.gl/react-maplibre';

import ControlPanel from './control-panel';

const pointLayer: LayerProps = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf'
  }
};

function pointOnCircle({center, angle, radius}) {
  return {
    type: 'Point',
    coordinates: [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius]
  };
}

export default function App() {
  const [pointData, setPointData] = useState(null);

  useEffect(() => {
    const animation = window.requestAnimationFrame(() =>
      setPointData(pointOnCircle({center: [-100, 0], angle: Date.now() / 1000, radius: 20}))
    );
    return () => window.cancelAnimationFrame(animation);
  });

  return (
    <>
      <Map
        initialViewState={{
          latitude: 0,
          longitude: -100,
          zoom: 3
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {pointData && (
          <Source type="geojson" data={pointData}>
            <Layer {...pointLayer} />
          </Source>
        )}
      </Map>
      <ControlPanel />
    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
