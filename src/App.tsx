import React, { useState, useEffect } from 'react';
import Text2Slides from './Text2Slides';
import pptxgen from 'pptxgenjs';
import { Helmet } from 'react-helmet';

function getTitle(route: any) {
  let title = 'SelahWorship';
  if (route) {
    title = route.match.params[0];
    console.log('the title:', title);
  }
  return title;
}

function getDescription(route: any, project: any) {
  let desc = '예배, 찬양, 자막, 워십, 찬양가사, 워십가사, 예배자막, 찬양자막, 워십자막, 예배PPT, 찬양PPT, 워십PPT';
  if (route) {
    desc = project.items[0].lyric;
    // console.log("the title:", desc);
  }
  return desc;
}

function generatePPTX(project: any) {
  // 1. Create a new Presentation
  // console.log("fontsize:", rendering.current.dataset.font);
  let pres = new pptxgen();
  pres.layout = 'LAYOUT_4x3';
  if (project.page.isWide) {
    pres.layout = 'LAYOUT_WIDE';
  }

  for (let i in project.items) {
    let rendering = project.items[i].rendering;
    if (rendering.current != null && typeof rendering.current != 'undefined') {
      let theRendering: any = rendering.current;
      if (typeof theRendering.children != 'undefined') {
        for (let i in theRendering.children) {
          console.log('rendering children:', theRendering.children[i].children);
          if (typeof theRendering.children[i].children != 'undefined') {
            let slide = pres.addSlide();
            slide.bkgd = project.page.background;
            let tempText = '';
            for (let k in theRendering.children[i].children) {
              let margin = '\n\n';
              if (tempText === '') {
                margin = '';
              }
              if (typeof theRendering.children[i].children[k].innerText != 'undefined') {
                console.log(theRendering.children[i].children[k].innerText);
                tempText += margin;
                tempText += theRendering.children[i].children[k].innerText;
              }
            }
            let textboxText = tempText;
            let textboxOpts = {
              x: project.page.padding.left / 72,
              y: project.page.padding.top / 72,
              w: project.page.width / 72 - project.page.padding.left / 72 - project.page.padding.right / 72,
              h: project.page.height / 72 - project.page.padding.top / 72 - project.page.padding.bottom / 72,
              color: project.page.color.replace('#', ''),
              fontSize: rendering.current.dataset.font,
              fontFace: 'Arial',
              align: project.page.align,
              valign: project.page.vAlign,
              bold: true,
              inset: 0,
            };
            slide.addText(textboxText, textboxOpts);
          }
        }
      }
    }
    let slide = pres.addSlide();
    slide.bkgd = project.page.background;
  }
  let d = new Date();
  pres.writeFile('Selah_' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() + '.pptx');
}

interface IApp {
  title?: any;
  lyric?: any;
  route?: any;
}

const App: React.FunctionComponent<IApp> = (props) => {
  const [project, setProject] = useState({
    paddingView: false,
    page: {
      isBright: false,
      isWide: true,
      background: '#000000',
      color: '#ffffff',
      width: 960,
      height: 540,
      scale: 0.35,
      align: 'center',
      vAlign: 'middle',
      padding: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
      },
    },
    items: [
      {
        type: 'Text2Slides',
        uid: Math.random().toString(36).substr(2, 9),
        name: getTitle(props.route),
        artist: '',
        fontSize: 44,
        rendering: null,
        lyric: '',
      },
    ],
  });

  function saveLocal() {
    localStorage.setItem('pageSetting', JSON.stringify(project.page));
  }

  useEffect(() => {
    /// localStorage
    try {
      let tempPageSetting: any = localStorage.getItem('pageSetting');
      if (!tempPageSetting) {
        console.log('no page setting:', tempPageSetting);
        tempPageSetting = {
          isBright: false,
          isWide: true,
          background: '#000000',
          color: '#ffffff',
          width: 960,
          height: 540,
          scale: 0.35,
          align: 'center',
          vAlign: 'middle',
          padding: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30,
          },
        };
      } else {
        tempPageSetting = JSON.parse(tempPageSetting);
        console.log('got page setting:', tempPageSetting);
      }
      let newProject = {
        ...project,
        page: tempPageSetting,
      };
      setProject(newProject);
    } catch (err) {}
  }, []);

  function setRender(rendering: any, uid: any, lyric: any) {
    let newItems = project.items;
    for (let i in newItems) {
      if (newItems[i].uid === uid) {
        newItems[i].rendering = rendering;
        newItems[i].lyric = lyric;
      }
    }
    setProject({
      ...project,
      items: newItems,
    });
  }

  function getItems(project: any) {
    let dom: any = [];
    for (let i in project.items) {
      if (project.items[i].type === 'Text2Slides') {
        dom.push(
          <Text2Slides
            key={i}
            uid={project.items[i].uid}
            page={project.page}
            setRender={setRender}
            lyric={project.items[i].lyric}
          ></Text2Slides>
        );
      }
    }
    return dom;
  }

  function getClass() {
    let tClass = 'App';
    if (project.page.isWide) {
      tClass += ' --wide';
    }
    if (project.page.isBright) {
      tClass += ' --bright';
    }
    if (project.paddingView) {
      tClass += ' --paddingView';
    }
    tClass += ' --align-' + project.page.align;
    tClass += ' --vAlign-' + project.page.vAlign;
    return tClass;
  }

  return (
    <div className={getClass()}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{getTitle(props.route) + ' | ppt | 가사'}</title>
        <link rel="canonical" href={'https://selahworship/songs/' + getTitle(props.route) + '/ppt'} />
        <meta property="og:title" content={getTitle(props.route) + ' | ppt | 가사'}></meta>
        <meta name="Description" content={getDescription(props.route, project)} />
      </Helmet>
      <div className="App__top">
        <div
          className="Logo"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          SelahWorship<span>Beta v0.0.2</span>
        </div>
        <div
          className="Download"
          onClick={() => {
            generatePPTX(project);
          }}
        >
          <i className="fas fa-arrow-alt-circle-down"></i>
          <p>PPTX</p>
        </div>
      </div>
      <div className="App__main">
        <div className="Slide__container">{getItems(project)}</div>
        <div className="Page__setting">
          <div className="Page__setting-color">
            <div className="Page__setting-color-options">
              <div
                className={project.page.isBright ? 'Color-option' : 'Color-option --selected'}
                onClick={() => {
                  let tempPage = project.page;
                  tempPage.isBright = false;
                  tempPage.color = '#ffffff';
                  tempPage.background = '#000000';
                  setProject({
                    ...project,
                    page: tempPage,
                  });
                }}
              >
                <i className="fas fa-font"></i>
              </div>
              <div
                className={project.page.isBright ? 'Color-option --bright --selected' : 'Color-option --bright'}
                onClick={() => {
                  let tempPage = project.page;
                  tempPage.isBright = true;
                  tempPage.color = '#000000';
                  tempPage.background = '#ffffff';
                  setProject({
                    ...project,
                    page: tempPage,
                  });
                }}
              >
                <i className="fas fa-font"></i>
              </div>
            </div>
          </div>

          <div className="Page__setting-ratio">
            <div className="Page__setting-ratio-options">
              <div
                className={project.page.isWide ? 'Ratio-option' : 'Ratio-option --selected'}
                onClick={() => {
                  // let tempProject = project;
                  // tempProject.page.isWide = false;
                  // setProject(tempProject);
                  let tempPage = project.page;
                  tempPage.isWide = false;
                  tempPage.width = 720;
                  setProject({
                    ...project,
                    page: tempPage,
                  });
                }}
              >
                4:3
              </div>
              <div
                className={project.page.isWide ? 'Ratio-option --wide --selected' : 'Ratio-option --wide'}
                onClick={() => {
                  // let tempProject = project;
                  // tempProject.page.isWide = true;
                  // setProject(tempProject);
                  let tempPage = project.page;
                  tempPage.isWide = true;
                  tempPage.width = 960;
                  setProject({
                    ...project,
                    page: tempPage,
                  });
                }}
              >
                16:9
              </div>
            </div>
          </div>
          <div className="Page__setting-align">
            <div className="Page__setting-align-options">
              <div
                className={project.page.align === 'left' ? 'Align-option --left --selected' : 'Align-option --left'}
                onClick={() => {
                  let tempPage = project.page;
                  tempPage.align = 'left';
                  setProject({
                    ...project,
                    page: tempPage,
                  });
                }}
              >
                <i className="fas fa-align-left"></i>
              </div>
              <div
                className={project.page.align === 'center' ? 'Align-option --center --selected' : 'Align-option --center'}
                onClick={() => {
                  let tempPage = project.page;
                  tempPage.align = 'center';
                  setProject({
                    ...project,
                    page: tempPage,
                  });
                }}
              >
                <i className="fas fa-align-center"></i>
              </div>
              <div
                className={project.page.align === 'right' ? 'Align-option --right --selected' : 'Align-option --right'}
                onClick={() => {
                  let tempPage = project.page;
                  tempPage.align = 'right';
                  setProject({
                    ...project,
                    page: tempPage,
                  });
                }}
              >
                <i className="fas fa-align-right"></i>
              </div>
            </div>
          </div>
          <div
            className="Page__setting-padding"
            onFocus={() => {
              setProject({
                ...project,
                paddingView: true,
              });
            }}
            onBlur={() => {
              setProject({
                ...project,
                paddingView: false,
              });
            }}
          >
            <div className="Page__setting-padding-row">
              <div className="Page__setting-padding-option --top">
                <input
                  type="number"
                  value={project.page.padding.top}
                  onChange={(e) => {
                    setProject({
                      ...project,
                      page: {
                        ...project.page,
                        padding: {
                          ...project.page.padding,
                          top: parseInt(e.currentTarget.value),
                        },
                      },
                    });
                  }}
                  onBlur={saveLocal}
                />
              </div>
            </div>

            <div className="Page__setting-padding-row">
              <div className="Page__setting-padding-option --left">
                <input
                  type="number"
                  value={project.page.padding.left}
                  onChange={(e) => {
                    setProject({
                      ...project,
                      page: {
                        ...project.page,
                        padding: {
                          ...project.page.padding,
                          left: parseInt(e.currentTarget.value),
                        },
                      },
                    });
                  }}
                  onBlur={saveLocal}
                />
              </div>
              <div className="Page__setting-padding-box"></div>
              <div className="Page__setting-padding-option --right">
                <input
                  type="number"
                  value={project.page.padding.right}
                  onChange={(e) => {
                    setProject({
                      ...project,
                      page: {
                        ...project.page,
                        padding: {
                          ...project.page.padding,
                          right: parseInt(e.currentTarget.value),
                        },
                      },
                    });
                  }}
                  onBlur={saveLocal}
                />
              </div>
            </div>
            <div className="Page__setting-padding-row">
              <div className="Page__setting-padding-option --bottom">
                <input
                  type="number"
                  value={project.page.padding.bottom}
                  onChange={(e) => {
                    setProject({
                      ...project,
                      page: {
                        ...project.page,
                        padding: {
                          ...project.page.padding,
                          bottom: parseInt(e.currentTarget.value),
                        },
                      },
                    });
                  }}
                  onBlur={saveLocal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
