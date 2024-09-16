import "./toast.css";
import { useEffect, useState } from "react";
import EventBus from "../pubsub/eventBus";
import { createPortal } from "react-dom";

// 기존 토스트 라이브러리가 제공하는 기능은 무조건 있어야함
// +@ (1차)
// 이미지나 css를 커스텀할 수 있는 기능 (width, height 포함)
// setTimeOut빼고 예, 아니오 선택 << 약간의 모달 기능도 추가할 수 있는
// 클릭하면 사라짐
// hover하면 대기 (setTimeOut 클린업)

// (2차)
// css animation ex) 번개 콰광
// progressbar
// 로딩 (promise Pending, reject, resolve)

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (toast) => {
      const id = Date.now();

      setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);

      setTimeout(() => {
        // setToasts((prevToasts) => prevToasts.slice(1));
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, toast.time);
    };

    const unsubscribe = EventBus.subscribe("SHOW_TOAST", handleToastEvent);

    return () => unsubscribe();
  }, []);

  return createPortal(
    <div className={`toast-container`}>
      {toasts.map((toast, index) => {
        return <Test key={index} toast={toast}></Test>;
      })}
    </div>,
    document.body
  );
};

const Test = ({ toast }) => {
  const defaultTheme = "default";
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    setProgressWidth(0);
  }, []);

  console.log("toast", toast);

  return (
    <div className={`toast ${toast.theme ? toast.theme : defaultTheme}`}>
      {toast.message}
      {toast.showProgress && (
        <div
          className="toast-progress-bar"
          style={{
            transition: `width ${toast.time / 1000}s`,
            width: `${progressWidth}%`,
          }}
        ></div>
      )}
    </div>
  );
};

export default Toast;