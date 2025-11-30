// MapLibreMap.jsx
import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapLibreMap = ({ locations }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json", // Dark mode
      center: [67.0011, 24.8607], // Default Karachi
      zoom: 4,
    });

    // Add zoom buttons
    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current.on("load", () => {
      // Clear old markers and routes if exist
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeLayer("route");
        mapRef.current.removeSource("route");
      }

      // Add markers
      locations.forEach((loc) => {
        new maplibregl.Marker({ color: "#ffcc00" })
          .setLngLat([loc.lng, loc.lat])
          .addTo(mapRef.current);
      });

      // Draw route (polyline)
      if (locations.length > 1) {
        const routeCoords = locations.map((loc) => [loc.lng, loc.lat]);

        mapRef.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: routeCoords,
            },
          },
        });

        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#00eaff",
            "line-width": 4,
          },
        });
      }
    });

    return () => mapRef.current.remove();
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    />
  );
};

export default MapLibreMap;
