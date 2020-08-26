import React from "react";

interface ISlide {
  page: any;
}

const Slide: React.FunctionComponent<ISlide> = (props) => {
  return (
    <div
      className="Slide"
      style={{
        background: props.page.background,
        color: props.page.color,
        width: props.page.width * props.page.scale + "pt",
        height: props.page.height * props.page.scale + "pt",
        paddingTop: props.page.padding.top * props.page.scale + "pt",
        paddingRight: props.page.padding.right * props.page.scale + "pt",
        paddingBottom: props.page.padding.bottom * props.page.scale + "pt",
        paddingLeft: props.page.padding.left * props.page.scale + "pt",
        // letterSpacing: -2 * 0.75 * props.page.scale + "pt",
      }}
    >
      <div
        className="Slide__padding-viewer"
        style={{
          position: "absolute",
          left: props.page.padding.left * props.page.scale + "pt",
          right: props.page.padding.right * props.page.scale + "pt",
          top: props.page.padding.top * props.page.scale + "pt",
          bottom: props.page.padding.bottom * props.page.scale + "pt",
        }}
      ></div>
      {props.children}
    </div>
  );
};
export default Slide;
