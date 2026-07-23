import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Test.module.scss";

/* ========== 录音录像模块 ========== */

const RECORD_TYPES = {
  audio: { mimeType: "audio/webm;codecs=opus", label: "录音" },
  video: { mimeType: "video/webm;codecs=vp9,opus", label: "录像" },
};

function RecorderPanel() {
  const [mode, setMode] = useState(null); // null | "audio" | "video"
  const [state, setState] = useState("idle"); // idle | prepared | recording | done
  const [error, setError] = useState("");
  const [recordedBlob, setRecordedBlob] = useState(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const videoRef = useRef(null);

  // 清理流
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // 开始准备设备
  const startPrepare = useCallback(
    async (m) => {
      setMode(m);
      setState("prepared");
      setError("");
      setRecordedBlob(null);
      chunksRef.current = [];
      stopStream();

      try {
        const isVideo = m === "video";
        const constraints = isVideo
          ? { audio: true, video: { facingMode: "environment", width: { ideal: 640 } } }
          : { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        // 视频预览
        if (isVideo && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError(err.message || "获取设备失败，请检查权限");
        setState("idle");
      }
    },
    [stopStream]
  );

  // 开始录制
  const startRecord = useCallback(() => {
    if (!streamRef.current) return;
    const cfg = mode === "video" ? RECORD_TYPES.video : RECORD_TYPES.audio;
    chunksRef.current = [];

    try {
      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: cfg.mimeType,
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: cfg.mimeType });
        setRecordedBlob(blob);
        setState("done");
        stopStream();
      };
      recorder.onerror = () => {
        setError("录制过程中出错");
        setState("idle");
        stopStream();
      };

      recorder.start();
      setState("recording");
    } catch (err) {
      setError("不支持的录制格式");
    }
  }, [mode, stopStream]);

  // 停止录制
  const stopRecord = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  // 取消
  const cancelRecord = useCallback(() => {
    stopStream();
    setMode(null);
    setState("idle");
    setError("");
    setRecordedBlob(null);
  }, [stopStream]);

  // 下载
  const download = useCallback(() => {
    if (!recordedBlob) return;
    const ext = mode === "video" ? "webm" : "webm";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(recordedBlob);
    a.download = `record_${Date.now()}.${ext}`;
    a.click();
  }, [recordedBlob, mode]);

  // 回放 URL
  const playbackUrl = recordedBlob ? URL.createObjectURL(recordedBlob) : null;

  return (
    <div className={styles.recorderPanel}>
      <div className={styles.recorderHeader}>
        <h2>录音 / 录像</h2>
      </div>

      {/* 选择模式（idle 状态） */}
      {state === "idle" && (
        <div className={styles.modeSelect}>
          <button
            className={`${styles.modeBtn} ${styles.audioBtn}`}
            onClick={() => startPrepare("audio")}
          >
            <span className={styles.modeIcon}>🎤</span>
            <span>录音</span>
          </button>
          <button
            className={`${styles.modeBtn} ${styles.videoBtn}`}
            onClick={() => startPrepare("video")}
          >
            <span className={styles.modeIcon}>📹</span>
            <span>录像</span>
          </button>
        </div>
      )}

      {/* 准备 / 录制中 */}
      {(state === "prepared" || state === "recording") && (
        <div className={styles.recorderBody}>
          {/* 视频预览（录像模式） */}
          {mode === "video" && (
            <video ref={videoRef} className={styles.previewVideo} autoPlay muted playsInline />
          )}

          {/* 音频录制指示 */}
          {mode === "audio" && state === "prepared" && (
            <div className={styles.audioReady}>
              <span className={styles.micIcon}>🎙️</span>
              <p>麦克风已就绪，点击开始录音</p>
            </div>
          )}

          {/* 录制中指示 */}
          {state === "recording" && (
            <div className={styles.recordingIndicator}>
              <span className={styles.recDot} />
              <span>录制中...</span>
            </div>
          )}

          {/* 录制控制按钮 */}
          <div className={styles.recorderActions}>
            {state === "prepared" && (
              <button className={styles.startRecBtn} onClick={startRecord}>
                开始录制
              </button>
            )}
            {state === "recording" && (
              <button className={styles.stopRecBtn} onClick={stopRecord}>
                停止录制
              </button>
            )}
            <button className={styles.cancelBtn} onClick={cancelRecord}>
              取消
            </button>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && <div className={styles.recorderError}>{error}</div>}

      {/* 录制完成 */}
      {state === "done" && (
        <div className={styles.recorderResult}>
          <p className={styles.resultLabel}>录制完成</p>

          {mode === "audio" && playbackUrl && (
            <audio controls src={playbackUrl} className={styles.playbackAudio} />
          )}

          {mode === "video" && playbackUrl && (
            <video controls src={playbackUrl} className={styles.playbackVideo} />
          )}

          <div className={styles.resultActions}>
            <button className={styles.downloadBtn} onClick={download}>
              下载文件
            </button>
            <button className={styles.reRecordBtn} onClick={cancelRecord}>
              重新录制
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== 地图定位模块 ========== */

const AMAP_KEY = "61037137803fa51759db615c94c099ce";
const AMAP_URL = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Geolocation`;

function loadAMapScript() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
      return;
    }
    const script = document.createElement("script");
    script.src = AMAP_URL;
    script.async = true;
    script.onload = () => resolve(window.AMap);
    script.onerror = () => reject(new Error("高德地图脚本加载失败"));
    document.head.appendChild(script);
  });
}

function TestPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [position, setPosition] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let map = null;

    async function initMap() {
      try {
        const AMap = await loadAMapScript();

        // 初始化地图，默认中心设为北京（后续定位成功会重新定位）
        map = new AMap.Map(mapRef.current, {
          zoom: 15,
          center: [116.397428, 39.90923],
          mapStyle: "amap://styles/fresh",
          resizeEnable: true,
        });

        mapInstance.current = map;

        // 使用 AMap.Geolocation 进行定位
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          zoomToAccuracy: true,
          buttonPosition: "RB",
          buttonDom: null, // 使用自定义按钮
          showMarker: true,
          showCircle: true,
          panToLocation: true,
        });

        map.addControl(geolocation);

        geolocation.getCurrentPosition((status, result) => {
          if (status === "complete") {
            const { position: pos, addressComponent } = result;
            const info = {
              lat: pos.getLat(),
              lng: pos.getLng(),
              address: result.formattedAddress,
              province: addressComponent?.province || "",
              city: addressComponent?.city || "",
              district: addressComponent?.district || "",
              street: addressComponent?.street || "",
              adcode: addressComponent?.adcode || "",
            };
            setPosition(info);
            setStatus("success");

            // 添加定位标记
            new AMap.Marker({
              position: [info.lng, info.lat],
              map,
              title: "当前位置",
              animation: "AMAP_ANIMATION_DROP",
            });
          } else {
            setStatus("error");
            setErrorMsg(result.message || "定位失败");
          }
        });
      } catch (err) {
        setStatus("error");
        setErrorMsg(err.message || "地图加载失败，请检查网络");
      }
    }

    initMap();

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, []);

  return (
    <div className={styles.mapPage}>
      <div className={styles.mapHeader}>
        <h1>高德地图定位服务</h1>
        <p>基于高德 JS API 的网页定位-test1</p>
      </div>

      {/* 录音录像模块 */}
      <RecorderPanel />

      {/* 地图容器 */}
      <div ref={mapRef} className={styles.mapContainer} />

      {/* 状态与信息区域 */}
      <div className={styles.locationCard}>
        {status === "loading" && (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>正在定位中...</p>
          </div>
        )}

        {status === "error" && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorText}>{errorMsg}</p>
            <button
              className={styles.retryBtn}
              onClick={() => window.location.reload()}
            >
              重新加载
            </button>
          </div>
        )}

        {status === "success" && position && (
          <div className={styles.successState}>
            <div className={styles.coordRow}>
              <span className={styles.label}>经度</span>
              <span className={styles.value}>{position.lng}</span>
            </div>
            <div className={styles.coordRow}>
              <span className={styles.label}>纬度</span>
              <span className={styles.value}>{position.lat}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.addressRow}>
              <span className={styles.label}>地址</span>
              <span className={styles.value}>
                {position.province}
                {position.city}
                {position.district}
                {position.street}
              </span>
            </div>
            <div className={styles.addressRow}>
              <span className={styles.label}>详细</span>
              <span className={styles.value}>{position.address}</span>
            </div>
            <div className={styles.addressRow}>
              <span className={styles.label}>区域编码</span>
              <span className={styles.value}>{position.adcode}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestPage;
