import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { listLogEntries } from "./API";
import LogEntryForm from "./LogEntryForm";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLoc, setAddEntryLoc] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: -0.023559,
    longitude: 37.90619300000003,
    zoom: 5,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
    console.log(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLoc({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/antohnw/ckguv2ma10hxi1amlfo3esnjz"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapboxApiAccessToken={
        process.env.MAPBOX_TOKEN ||
        "pk.eyJ1IjoiYW50b2hudyIsImEiOiJja2d1czJmaW0wbmpkMzVxcjhldndjYTc3In0.t_yVqlJFArAStOXzarKZCw"
      }
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <>
          <Marker
            key={entry._id}
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div
              onClick={() =>
                setShowPopup({
                  showPopup,
                  [entry._id]: true,
                })
              }
            >
              <img
                className="marker"
                style={{
                  height: "20px",
                  width: "20px",
                }}
                src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pngall.com%2Fwp-content%2Fuploads%2F2017%2F05%2FMap-Marker-Free-Download-PNG.png&f=1&nofb=1"
                alt="marker"
              />
            </div>
          </Marker>
          {showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              dynamicPosition={true}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup({})}
              anchor="top"
            >
              <div className="popup">
                <h5>{entry.title}</h5>
                <p>{entry.comments}</p>
                <small>
                  Visit Date: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
              </div>
            </Popup>
          ) : null}
        </>
      ))}
      {addEntryLoc ? (
        <>
          <Marker
            latitude={addEntryLoc.latitude}
            longitude={addEntryLoc.longitude}
          >
            <div>
              <img
                className="markerred"
                style={{
                  height: "20px",
                  width: "20px",
                }}
                src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.clker.com%2Fcliparts%2F3%2FY%2F0%2FN%2Fc%2Fm%2Fmarker-red.svg.hi.png&f=1&nofb=1"
                alt="marker"
              />
            </div>
          </Marker>
          <Popup
            latitude={addEntryLoc.latitude}
            longitude={addEntryLoc.longitude}
            dynamicPosition={true}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setAddEntryLoc(null)}
            anchor="top"
          >
            <div className="popup">
              <LogEntryForm
                location={addEntryLoc}
                onClose={() => {
                  setAddEntryLoc(null);
                  getEntries();
                }}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
};
export default App;
