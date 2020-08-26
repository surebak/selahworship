import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Slide from "./Slide";

interface IText2Slides {
  uid: any;
  page: any;
  setRender: any;
  lyric?: any;
}

function block2line(singleBlock: any) {
  try {
    if (singleBlock.length === 0) {
      // console.log("is this empty?");
    }
  } catch (err) {}

  let dom = [];
  for (let i in singleBlock) {
    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (korean.test(singleBlock[i])) {
      dom.push(
        <div key={i} className="Slide__line --kr">
          {singleBlock[i]}
        </div>
      );
    } else {
      dom.push(
        <div key={i} className="Slide__line">
          {singleBlock[i]}
        </div>
      );
    }
  }
  return dom;
}

function getSlide(
  props: any,
  output: any,
  blocks: any,
  slide: any,
  style: any
) {
  let maxHeight =
    (slide.height - props.page.padding.top - props.page.padding.bottom) / 0.75; //pt to px
  // console.log("maxHeight:", maxHeight);
  let renderSlide = [];
  let oneSlide: any = [];
  let tempHeight = 0;
  if (output.current != null && typeof output.current != "undefined") {
    let theOutput: any = output.current;
    if (typeof theOutput.children != "undefined") {
      // console.log(theOutput.children);
      for (let i in theOutput.children) {
        if (typeof theOutput.children[i].clientHeight != "undefined") {
          let margin = 0; //블럭간 마진
          if (oneSlide.length > 0) {
            //이미 슬라이드에 블럭이 있으면 블럭마진 추가
            margin = style.fontSize;
          }
          tempHeight += margin + theOutput.children[i].clientHeight;
          try {
            if (blocks[i].length === 0) {
              // console.log("force new slide");
              // 강제 슬라이드 넘김
              renderSlide.push(
                // oneSlide 에 축적한 블럭들을 renderSlide 로 보냄
                <Slide key={i} page={props.page}>
                  {oneSlide}
                </Slide>
              );
              oneSlide = []; // oneSlide 는 비우고
              tempHeight = 0; // 다음 슬라이드 비우고
            }
          } catch (err) {}

          if (tempHeight <= maxHeight) {
            // 아직 슬라이드가 최대높이를 초과하지 않으면
            try {
              if (blocks[i].length != 0) {
                oneSlide.push(
                  <div
                    key={i}
                    className="Slide__block"
                    style={{
                      marginBottom: style.fontSize * props.page.scale + "pt",
                      fontSize: style.fontSize * props.page.scale + "pt",
                    }}
                  >
                    {block2line(blocks[i])}
                  </div>
                );
              }
            } catch (err) {}
          } else {
            // 슬라이드가 최대 높이를 초과하려고 할 때
            renderSlide.push(
              // oneSlide 에 축적한 블럭들을 renderSlide 로 보냄
              <Slide key={i} page={props.page}>
                {oneSlide}
              </Slide>
            );
            oneSlide = []; // oneSlide 는 비우고
            oneSlide.push(
              <div
                key={i}
                className="Slide__block"
                style={{
                  marginBottom: style.fontSize * props.page.scale + "pt",
                  fontSize: style.fontSize * props.page.scale + "pt",
                }}
              >
                {block2line(blocks[i])}
              </div>
            );
            tempHeight = theOutput.children[i].clientHeight; // 다음 슬라이드에 첫번째 블럭의 높이를 저장
          }
        }
      }
      if (oneSlide.length > 0) {
        renderSlide.push(
          <Slide key={Math.random() * 1000} page={props.page}>
            {oneSlide}
          </Slide>
        );
      }
    }
  }
  return renderSlide;
}

function text2json(text: any) {
  let block = [];
  let dom = [];
  let convertText: any = text.split("\n");
  for (let i in convertText) {
    if (convertText[i] === "") {
      block.push(dom);
      dom = [];
    } else {
      dom.push(convertText[i]);
    }
  }
  if (dom.length > 0) {
    block.push(dom);
  }

  return block;
}

function text2array(text: string, style: any) {
  let dom = [];
  let block = [];
  let body = [];
  let convertText: any = text.split("\n");
  // console.log(convertText);

  for (let i in convertText) {
    if (convertText[i] === "") {
      block.push(dom);
      dom = [];
    } else {
      dom.push(
        <div
          key={i}
          className="Output__line"
          style={{ fontSize: style.fontSize + "pt" }}
        >
          {convertText[i]}
        </div>
      );
    }
  }
  block.push(dom);
  for (let i in block) {
    body.push(
      <div
        key={i}
        className="Output__block"
        style={{ marginBottom: style.fontSize + "pt" }}
      >
        {block[i]}
      </div>
    );
  }
  return body;
}

const Text2Slides: React.FunctionComponent<IText2Slides> = (props) => {
  const output = useRef(null);
  const render = useRef(null);
  const [lyric, setLyric] = useState("");
  const [block, setBlock] = useState([[null, null]]);
  const [states, setStates] = useState({
    paddingView: false,
  });
  const [style, setStyle] = useState({
    fontSize: 56,
    padding: {
      top: 100,
      right: 40,
      bottom: 100,
      left: 40,
    },
  });

  useEffect(() => {
    try {
      let tempSize: any = localStorage.getItem("fontSize");
      console.log("tempSize:", tempSize);
      if (!tempSize) {
        tempSize = 52;
      }
      tempSize = parseInt(tempSize);
      setStyle({
        ...style,
        fontSize: tempSize,
      });
    } catch (err) {}
  }, []);
  useEffect(() => {
    props.setRender(render, props.uid, lyric);
  }, [render]);

  useEffect(() => {
    try {
      if (typeof props.lyric != "undefined") {
        setLyric(props.lyric);
      }
    } catch (err) {}
  }, [props.lyric]);

  useLayoutEffect(() => {
    try {
      setBlock(text2json(lyric));
    } catch (err) {}
  });

  function getClass(states: any) {
    let tClass = "Text2Slides";
    if (states.paddingView) {
      tClass += " --paddingView";
    }
    return tClass;
  }

  return (
    <div className={getClass(states)}>
      <div
        ref={output}
        className="Output --sample"
        style={{
          width: props.page.width + "pt",
          height: props.page.height + "pt",
          paddingTop: props.page.padding.top + "pt",
          paddingRight: props.page.padding.right + "pt",
          paddingBottom: props.page.padding.bottom + "pt",
          paddingLeft: props.page.padding.left + "pt",
        }}
      >
        {text2array(lyric, style)}
      </div>
      <div className="Settings">
        <div className="Settings__label">
          <i className="fas fa-text-height"></i>
        </div>
        <input
          type="number"
          className="Text2Slides__input"
          name="font-size"
          value={style.fontSize}
          onFocus={() => {
            setStates({
              ...states,
              paddingView: true,
            });
          }}
          onBlur={() => {
            setStates({
              ...states,
              paddingView: false,
            });
          }}
          onChange={(e) => {
            let theFontSize: any = parseInt(e.currentTarget.value);
            // console.log("fontSize:", theFontSize);
            localStorage.setItem("fontSize", e.currentTarget.value);
            setStyle({
              ...style,
              fontSize: theFontSize,
            });
          }}
        />
      </div>
      <div className="Container">
        <div className="Input --sample">
          <textarea
            placeholder={"Paste text here"}
            onChange={(e) => {
              // console.log(e.currentTarget.value);
              setLyric(e.currentTarget.value);
              // console.log("text2json:", text2json(lyric));
              props.setRender(render, props.uid, e.currentTarget.value);
            }}
            name=""
            id=""
            defaultValue={props.lyric}
          ></textarea>
          {/* <div
            className="Generate"
            onClick={() => {
              generatePPTX(rendering, style.fontSize);
            }}
          >
            PPT 다운로드
          </div> */}
        </div>

        <div className="Rendering">
          <div
            ref={render}
            data-font={style.fontSize}
            className="Rendering__scroll-area"
          >
            {getSlide(props, output, block, props.page, style)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Text2Slides;
