import React from 'react';

const Loading = () => {
  return (
    <>
      <div className="flower">
        <div className="petal petal1"></div>
        <div className="petal petal2"></div>
        <div className="petal petal3"></div>
        <div className="petal petal4"></div>
        <div className="petal petal5"></div>
        <div className="petal petal6"></div>
        <div className="petal petal7"></div>
        <div className="petal petal8"></div>
        <div className="center"></div>
      </div>
      <style>{`
        .flower {
          width: 300px;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          animation-name: rotateFlower;
          animation-duration: 8s;
          animation-iteration-count: infinite;
          animation-timing-function: ease;
        }

        .petal {
          position: absolute;
          width: 35px;
          height: 60px;
          background: linear-gradient(180deg, #97c2be, #2f857c);
          border-radius: 50%;
          animation-name: changeColor;
          animation-duration: 8s;
          animation-direction: reverse;
          animation-iteration-count: infinite;
        }

        .petal1 {
          transform: rotate(0deg) translateY(-50%);
          animation-delay: 0.1s;
        }

        .petal2 {
          transform: rotate(45deg) translateY(-50%);
          animation-delay: 0.2s;
        }

        .petal3 {
          transform: rotate(90deg) translateY(-50%);
          animation-delay: 0.3s;
        }

        .petal4 {
          transform: rotate(135deg) translateY(-50%);
          animation-delay: 0.4s;
        }

        .petal5 {
          transform: rotate(180deg) translateY(-50%);
          animation-delay: 0.5s;
        }

        .petal6 {
          transform: rotate(225deg) translateY(-50%);
          animation-delay: 0.6s;
        }

        .petal7 {
          transform: rotate(270deg) translateY(-50%);
          animation-delay: 0.7s;
        }

        .petal8 {
          transform: rotate(315deg) translateY(-50%);
          animation-delay: 0.8s;
        }

        .center {
          position: absolute;
          width: 30px;
          height: 30px;
          background-color: #f1d2d2;
          border-radius: 50%;
        }

        .petal {
          position: absolute;
          width: 35px;
          height: 60px;
          background: linear-gradient(180deg, #e5f0ef, #2f857c);
          border-radius: 50%;
          animation-name: changeColor;
          animation-duration: 8s;
          animation-direction: reverse;
          animation-iteration-count: infinite;
        }

        .flower {
          width: 300px;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          animation-name: rotateFlower;
          animation-duration: 8s;
          animation-iteration-count: infinite;
          animation-timing-function: ease;
        }

        @keyframes changeColor {
          0% {
            background: linear-gradient(180deg, #fbe6e6, #dc3539);
          }
          25% {
            background: linear-gradient(180deg, #fbe6e6, #dc3539);
          }
          50% {
            background: linear-gradient(180deg, #fbe6e6, #dc3539);
          }
          75% {
            background: linear-gradient(180deg, #fbe6e6, #dc3539);
          }
          100% {
            background: linear-gradient(180deg, #fbe6e6, #dc3539);
          }
        }

        @keyframes rotateFlower {
          0% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.5) rotate(360deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </>
  );
};

export default Loading;
