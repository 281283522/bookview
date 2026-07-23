import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

function DataTransferAnimation() {
  const containerRef = useRef(null);
  const lottieRefs = useRef([null, null, null]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const jsonData1 = {
      "v": "5.7.4",
      "fr": 30,
      "ip": 0,
      "op": 60,
      "w": 100,
      "h": 100,
      "nm": "Animation 1",
      "ddd": 0,
      "assets": [],
      "layers": [{
        "ddd": 0,
        "ind": 1,
        "ty": 4,
        "nm": "Shape Layer",
        "sr": 1,
        "ks": {
          "o": {"a":0,"k":100},
          "r": {"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":0},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":60,"s":360}]},
          "p": {"a":0,"k":[50,50,0]},
          "a": {"a":0,"k":[0,0,0]},
          "s": {"a":0,"k":[100,100,100]}
        },
        "ao": 0,
        "shapes": [{
          "ty":"gr","it":[
            {"ind":0,"ty":"el","p":{"a":0,"k":[50,50]},"s":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":[40,40]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":30,"s":[20,20]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":60,"s":[40,40]}]},"nm":"Ellipse"},
            {"ty":"st","c":{"a":0,"k":[0.133,0.718,0.345,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":3},"nm":"Stroke"},
            {"ty":"tr","p":{"a":0,"k":[50,50]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0},"nm":"Transform"}
          ],"nm":"Circle Group"
        }],
        "ip": 0,"op": 60,"st": 0,"bm": 0
      }],
      "markers": []
    };

    const jsonData2 = {
      "v": "5.7.4",
      "fr": 30,
      "ip": 0,
      "op": 60,
      "w": 100,
      "h": 100,
      "nm": "Animation 2",
      "ddd": 0,
      "assets": [],
      "layers": [{
        "ddd": 0,
        "ind": 1,
        "ty": 4,
        "nm": "Shape Layer",
        "sr": 1,
        "ks": {
          "o": {"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":100},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":30,"s":50},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":60,"s":100}]},
          "r": {"a":0,"k":0},
          "p": {"a":0,"k":[50,50,0]},
          "a": {"a":0,"k":[0,0,0]},
          "s": {"a":0,"k":[100,100,100]}
        },
        "ao": 0,
        "shapes": [{
          "ty":"gr","it":[
            {"ind":0,"ty":"sh","ks":{"a":0,"k":{"i":[[0,0],[0,50],[50,50],[50,0]],"o":[[50,0],[50,50],[0,50],[0,0]],"v":[[0,0],[0,50],[50,50],[50,0]],"c":true}},"nm":"Rectangle"},
            {"ty":"st","c":{"a":0,"k":[0,0.667,1,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":3},"nm":"Stroke"},
            {"ty":"tr","p":{"a":0,"k":[50,50]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0},"nm":"Transform"}
          ],"nm":"Rectangle Group"
        }],
        "ip": 0,"op": 60,"st": 0,"bm": 0
      }],
      "markers": []
    };

    const jsonData3 = {
      "v": "5.7.4",
      "fr": 30,
      "ip": 0,
      "op": 60,
      "w": 100,
      "h": 100,
      "nm": "Animation 3",
      "ddd": 0,
      "assets": [],
      "layers": [{
        "ddd": 0,
        "ind": 1,
        "ty": 4,
        "nm": "Shape Layer",
        "sr": 1,
        "ks": {
          "o": {"a":0,"k":100},
          "r": {"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":0,"s":0},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":60,"s":-360}]},
          "p": {"a":0,"k":[50,50,0]},
          "a": {"a":0,"k":[0,0,0]},
          "s": {"a":0,"k":[100,100,100]}
        },
        "ao": 0,
        "shapes": [{
          "ty":"gr","it":[
            {"ind":0,"ty":"sh","ks":{"a":0,"k":{"i":[[25,0],[50,50],[25,100],[0,50]],"o":[[50,50],[25,0],[50,50],[25,100]],"v":[[25,0],[50,50],[25,100],[0,50]],"c":true}},"nm":"Triangle"},
            {"ty":"st","c":{"a":0,"k":[1,0.5,0,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":3},"nm":"Stroke"},
            {"ty":"tr","p":{"a":0,"k":[50,50]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0},"nm":"Transform"}
          ],"nm":"Triangle Group"
        }],
        "ip": 0,"op": 60,"st": 0,"bm": 0
      }],
      "markers": []
    };

    const animData = [jsonData1, jsonData2, jsonData3];
    const names = ["1.json", "1-1.json", "1.json"];

    animData.forEach((data, index) => {
      const item = document.createElement("div");
      item.className = "lottie-item";
      item.innerHTML = `<div class="lottie-container" id="lottie-${index}"></div><div class="file-name">${names[index]}</div>`;
      container.appendChild(item);

      lottieRefs.current[index] = lottie.loadAnimation({
        container: document.getElementById(`lottie-${index}`),
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: data
      });
    });

    return () => {
      lottieRefs.current.forEach(instance => {
        if (instance) {
          instance.destroy();
        }
      });
    };
  }, []);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundColor: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div ref={containerRef} className="lottie-wrapper">
        {/* Lottie animations will be rendered here */}
      </div>

      <style>{`
        .lottie-wrapper {
          display: flex;
          gap: 60px;
          padding: 20px;
        }

        .lottie-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .lottie-container {
          width: 120px;
          height: 120px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .file-name {
          color: #86868b;
          font-size: 14px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}

export default DataTransferAnimation;
