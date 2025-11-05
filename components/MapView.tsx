"use client";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";

type FC = GeoJSON.FeatureCollection;

async function get(url: string) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error("fetch failed: " + url);
  return (await r.json()) as FC;
}

export default function MapView() {
  const [boundary, setBoundary] = useState<FC | null>(null);
  const [subs132, setSubs132] = useState<FC | null>(null);
  const [subs220, setSubs220] = useState<FC | null>(null);
  const [wells, setWells] = useState<FC | null>(null);
  const [cities, setCities] = useState<FC | null>(null);

  const [showBoundary, setShowBoundary] = useState(true);
  const [show132, setShow132] = useState(true);
  const [show220, setShow220] = useState(false);
  const [showWells, setShowWells] = useState(true);
  const [showCities, setShowCities] = useState(false);

  useEffect(() => {
    get("/data/Gujarat Boundry.geojson").then(setBoundary).catch(()=>{});
    get("/data/132Kv Sub Stations.geojson").then(setSubs132).catch(()=>{});
    get("/data/220KV Sub Stations.geojson").then(setSubs220).catch(()=>{});
    get("/data/Geothermal Wells.geojson").then(setWells).catch(()=>{});
    get("/data/Gujarat Cities.geojson").then(setCities).catch(()=>{});
  }, []);

  const boundaryStyle = useMemo(() => ({ color: "#64748b", weight: 1, fillOpacity: 0.05 }), []);
  const red    = { radius: 5, color: "#e11d48", fillColor: "#e11d48", fillOpacity: 0.9 };
  const purple = { radius: 6, color: "#7c3aed", fillColor: "#7c3aed", fillOpacity: 0.85 };
  const yellow = { radius: 4, color: "#111827", fillColor: "#f59e0b", fillOpacity: 0.9 };

  const center: [number, number] = [22.8, 72.5];

  return (
    <div className="relative h-[calc(100vh-3.5rem)]">
      <MapContainer center={center} zoom={7} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors" />

        {showBoundary && boundary && <GeoJSON data={boundary as any} style={boundaryStyle} />}

        {show132 && subs132 && <GeoJSON data={subs132 as any}
          pointToLayer={(_, latlng) => L.circleMarker(latlng, red)}
          onEachFeature={(f, l) => l.bindPopup(`<b>132 kV</b><br>${f?.properties?.name ?? ""}`)} />}

        {show220 && subs220 && <GeoJSON data={subs220 as any}
          pointToLayer={(_, latlng) => L.circleMarker(latlng, red)}
          onEachFeature={(f, l) => l.bindPopup(`<b>220 kV</b><br>${f?.properties?.name ?? ""}`)} />}

        {showWells && wells && <GeoJSON data={wells as any}
          pointToLayer={(_, latlng) => L.circleMarker(latlng, purple)}
          onEachFeature={(f, l) => l.bindPopup(`<b>Well</b><br>${f?.properties?.name ?? ""}`)} />}

        {showCities && cities && <GeoJSON data={cities as any}
          pointToLayer={(_, latlng) => L.circleMarker(latlng, yellow)}
          onEachFeature={(f, l) => l.bindPopup(`<b>City</b><br>${f?.properties?.name ?? ""}`)} />}
      </MapContainer>

      <aside className="absolute left-4 top-4 w-64 bg-white/95 backdrop-blur border rounded-xl shadow p-4 space-y-3">
        <h2 className="font-semibold">Layers</h2>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={showBoundary} onChange={e=>setShowBoundary(e.target.checked)} /> Gujarat Boundary</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={show132} onChange={e=>setShow132(e.target.checked)} /> 132 kV Substations</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={show220} onChange={e=>setShow220(e.target.checked)} /> 220 kV Substations</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={showWells} onChange={e=>setShowWells(e.target.checked)} /> Geothermal Wells</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={showCities} onChange={e=>setShowCities(e.target.checked)} /> Cities</label>
        </div>
        <hr />
        <h2 className="font-semibold">Project Suitability (demo)</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Resource (gradient): High / Medium / Low</li>
          <li>Grid access (to 132 kV): Basic / Med / Adv</li>
          <li>Water availability: Basic / Med / Adv</li>
          <li>Drilling feasibility: Basic / Med / Adv</li>
          <li>Market (power/heat): Basic / Med / Adv</li>
        </ul>
      </aside>
    </div>
  );
}
