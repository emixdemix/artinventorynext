export enum FigmaTypes {
   "FRAME" = "FRAME",
   "COMPONENT" = "COMPONENT",
   "RECTANGLE" = "RECTANGLE",
   "INSTANCE" = "INSTANCE",
   "TEXT" = "TEXT",
   "GROUP" = "GROUP"
}

export interface FigmaStyle {
   fill: {
      r: number
      g: number
      b: number
   } | null,
   stroke: string | null,
   fontSize: string | number | null,
   fontFamily: string | null,
}

export interface FigmaObject {
   id: string
   name: string
   type: string
   width: number
   height: number
   x: number
   y: number
   styles: FigmaStyle
   autoLayout?: Object | null
   children: FigmaObject[]
}

export interface FigmaOutput {
   elements: FigmaObject[]
}

export const TwoPerPageData: FigmaOutput = {
   elements:[
      {
        "id": "32:340",
        "name": "Frame 1",
        "type": "FRAME",
        "width": 595,
        "height": 842,
        "x": -98,
        "y": -503,
        "styles": {
          "fill": {
            "r": 1,
            "g": 1,
            "b": 1
          },
          "stroke": null,
          "fontSize": null,
          "fontFamily": null
        },
        "autoLayout": {
          "direction": "NONE",
          "spacing": null,
          "padding": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "alignment": "MIN",
          "crossAxisAlignment": "MIN"
        },
        "children": [
          {
            "id": "34:363",
            "name": "Comp1",
            "type": "INSTANCE",
            "width": 421,
            "height": 301,
            "x": 87,
            "y": 74,
            "styles": {
              "fill": null,
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I34:363;32:351",
                "name": "image",
                "type": "INSTANCE",
                "width": 421,
                "height": 252,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I34:363;32:351;32:341",
                    "name": "Rectangle 2",
                    "type": "RECTANGLE",
                    "width": 421,
                    "height": 252,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I34:363;32:357",
                "name": "dida",
                "type": "INSTANCE",
                "width": 388,
                "height": 36,
                "x": 0,
                "y": 265,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I34:363;32:357;32:343",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 388,
                    "height": 36,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "34:369",
            "name": "Comp2",
            "type": "INSTANCE",
            "width": 421,
            "height": 301,
            "x": 87,
            "y": 455,
            "styles": {
              "fill": null,
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I34:369;32:351",
                "name": "image",
                "type": "INSTANCE",
                "width": 421,
                "height": 252,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I34:369;32:351;32:341",
                    "name": "Rectangle 2",
                    "type": "RECTANGLE",
                    "width": 421,
                    "height": 252,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I34:369;32:357",
                "name": "dida",
                "type": "INSTANCE",
                "width": 388,
                "height": 36,
                "x": 0,
                "y": 265,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I34:369;32:357;32:343",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 388,
                    "height": 36,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "41:89",
            "name": "Name",
            "type": "INSTANCE",
            "width": 498,
            "height": 18,
            "x": 49,
            "y": 808,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I41:89;41:77",
                "name": "name",
                "type": "INSTANCE",
                "width": 498,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I41:89;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 498,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "41:101",
            "name": "Page",
            "type": "INSTANCE",
            "width": 176,
            "height": 18,
            "x": 414,
            "y": 7,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I41:101;41:77",
                "name": "page",
                "type": "INSTANCE",
                "width": 176,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I41:101;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 176,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
}

export const OnePerPageData: FigmaOutput = {
   elements:[
      {
        "id": "1:7",
        "name": "Frame 1",
        "type": "FRAME",
        "width": 595,
        "height": 842,
        "x": -837,
        "y": -503,
        "styles": {
          "fill": {
            "r": 1,
            "g": 1,
            "b": 1
          },
          "stroke": null,
          "fontSize": null,
          "fontFamily": null
        },
        "autoLayout": {
          "direction": "NONE",
          "spacing": null,
          "padding": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "alignment": "MIN",
          "crossAxisAlignment": "MIN"
        },
        "children": [
          {
            "id": "23:23",
            "name": "Comp1",
            "type": "INSTANCE",
            "width": 506,
            "height": 772,
            "x": 45,
            "y": 34,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I23:23;23:12",
                "name": "image",
                "type": "INSTANCE",
                "width": 506,
                "height": 672.6617431640625,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I23:23;23:12;23:8",
                    "name": "Rectangle 1",
                    "type": "RECTANGLE",
                    "width": 506,
                    "height": 672.6617431640625,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I23:23;23:13",
                "name": "dida",
                "type": "INSTANCE",
                "width": 506,
                "height": 34,
                "x": 0,
                "y": 711,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I23:23;23:13;23:9",
                    "name": "Soppresso 120 x 130 2020",
                    "type": "TEXT",
                    "width": 506,
                    "height": 34,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "41:81",
            "name": "Name",
            "type": "INSTANCE",
            "width": 498,
            "height": 18,
            "x": 45,
            "y": 806,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I41:81;41:77",
                "name": "name",
                "type": "INSTANCE",
                "width": 498,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I41:81;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 498,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "41:85",
            "name": "Page",
            "type": "INSTANCE",
            "width": 176,
            "height": 18,
            "x": 414,
            "y": 7,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I41:85;41:77",
                "name": "page",
                "type": "INSTANCE",
                "width": 176,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I41:85;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 176,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
}

export const JustTextData: FigmaOutput = {
   elements: [
      {
        "id": "44:87",
        "name": "Frame 1",
        "type": "FRAME",
        "width": 595,
        "height": 842,
        "x": 2079,
        "y": -503,
        "styles": {
          "fill": {
            "r": 1,
            "g": 1,
            "b": 1
          },
          "stroke": null,
          "fontSize": null,
          "fontFamily": null
        },
        "autoLayout": {
          "direction": "NONE",
          "spacing": null,
          "padding": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "alignment": "MIN",
          "crossAxisAlignment": "MIN"
        },
        "children": [
          {
            "id": "44:96",
            "name": "Name",
            "type": "INSTANCE",
            "width": 498,
            "height": 18,
            "x": 47,
            "y": 808,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I44:96;41:77",
                "name": "name",
                "type": "INSTANCE",
                "width": 498,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I44:96;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 498,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "44:97",
            "name": "Page",
            "type": "INSTANCE",
            "width": 176,
            "height": 18,
            "x": 414,
            "y": 7,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I44:97;41:77",
                "name": "page",
                "type": "INSTANCE",
                "width": 176,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I44:97;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 176,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
}

export const FourPerPageData: FigmaOutput = {
   elements:[
      {
        "id": "35:375",
        "name": "Frame 1",
        "type": "FRAME",
        "width": 595,
        "height": 842,
        "x": 666,
        "y": -503,
        "styles": {
          "fill": {
            "r": 1,
            "g": 1,
            "b": 1
          },
          "stroke": null,
          "fontSize": null,
          "fontFamily": null
        },
        "autoLayout": {
          "direction": "NONE",
          "spacing": null,
          "padding": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "alignment": "MIN",
          "crossAxisAlignment": "MIN"
        },
        "children": [
          {
            "id": "35:395",
            "name": "Comp1",
            "type": "INSTANCE",
            "width": 448,
            "height": 160,
            "x": 74,
            "y": 42,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:395;35:390",
                "name": "image",
                "type": "INSTANCE",
                "width": 160,
                "height": 160,
                "x": 288,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:395;35:390;35:376",
                    "name": "Rectangle 2",
                    "type": "RECTANGLE",
                    "width": 160,
                    "height": 160,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:395;35:391",
                "name": "dida",
                "type": "INSTANCE",
                "width": 247,
                "height": 16,
                "x": 0,
                "y": 144,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:395;35:391;35:387",
                    "name": "DIdascalia su due righe",
                    "type": "TEXT",
                    "width": 247,
                    "height": 16,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 8,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:401",
            "name": "Comp2",
            "type": "INSTANCE",
            "width": 448,
            "height": 160,
            "x": 74,
            "y": 228,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:401;35:390",
                "name": "image",
                "type": "INSTANCE",
                "width": 160,
                "height": 160,
                "x": 288,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:401;35:390;35:376",
                    "name": "Rectangle 2",
                    "type": "RECTANGLE",
                    "width": 160,
                    "height": 160,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:401;35:391",
                "name": "dida",
                "type": "INSTANCE",
                "width": 247,
                "height": 16,
                "x": 0,
                "y": 144,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:401;35:391;35:387",
                    "name": "DIdascalia su due righe",
                    "type": "TEXT",
                    "width": 247,
                    "height": 16,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 8,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:407",
            "name": "Comp3",
            "type": "INSTANCE",
            "width": 448,
            "height": 160,
            "x": 74,
            "y": 415,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:407;35:390",
                "name": "image",
                "type": "INSTANCE",
                "width": 160,
                "height": 160,
                "x": 288,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:407;35:390;35:376",
                    "name": "Rectangle 2",
                    "type": "RECTANGLE",
                    "width": 160,
                    "height": 160,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:407;35:391",
                "name": "dida",
                "type": "INSTANCE",
                "width": 247,
                "height": 16,
                "x": 0,
                "y": 144,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:407;35:391;35:387",
                    "name": "DIdascalia su due righe",
                    "type": "TEXT",
                    "width": 247,
                    "height": 16,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 8,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:413",
            "name": "Comp4",
            "type": "INSTANCE",
            "width": 448,
            "height": 160,
            "x": 74,
            "y": 602,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:413;35:390",
                "name": "image",
                "type": "INSTANCE",
                "width": 160,
                "height": 160,
                "x": 288,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:413;35:390;35:376",
                    "name": "Rectangle 2",
                    "type": "RECTANGLE",
                    "width": 160,
                    "height": 160,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:413;35:391",
                "name": "dida",
                "type": "INSTANCE",
                "width": 247,
                "height": 16,
                "x": 0,
                "y": 144,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:413;35:391;35:387",
                    "name": "DIdascalia su due righe",
                    "type": "TEXT",
                    "width": 247,
                    "height": 16,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 8,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "41:93",
            "name": "Name",
            "type": "INSTANCE",
            "width": 498,
            "height": 18,
            "x": 72,
            "y": 808,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I41:93;41:77",
                "name": "name",
                "type": "INSTANCE",
                "width": 498,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I41:93;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 498,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "41:105",
            "name": "Page",
            "type": "INSTANCE",
            "width": 176,
            "height": 18,
            "x": 414,
            "y": 7,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I41:105;41:77",
                "name": "page",
                "type": "INSTANCE",
                "width": 176,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I41:105;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 176,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
}

export const IconListData: FigmaOutput = {
   elements: [
      {
        "id": "35:467",
        "name": "Frame 1",
        "type": "FRAME",
        "width": 595,
        "height": 842,
        "x": 1444,
        "y": -503,
        "styles": {
          "fill": {
            "r": 1,
            "g": 1,
            "b": 1
          },
          "stroke": null,
          "fontSize": null,
          "fontFamily": null
        },
        "autoLayout": {
          "direction": "NONE",
          "spacing": null,
          "padding": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "alignment": "MIN",
          "crossAxisAlignment": "MIN"
        },
        "children": [
          {
            "id": "35:489",
            "name": "Comp1",
            "type": "INSTANCE",
            "width": 552,
            "height": 75,
            "x": 47,
            "y": 58,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:489;35:484",
                "name": "image",
                "type": "INSTANCE",
                "width": 75,
                "height": 75,
                "x": 0,
                "y": -4,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:489;35:484;35:479",
                    "name": "Rectangle 8",
                    "type": "RECTANGLE",
                    "width": 75,
                    "height": 75,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:489;35:485",
                "name": "dida",
                "type": "INSTANCE",
                "width": 422,
                "height": 33.33333206176758,
                "x": 100,
                "y": 37.5,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:489;35:485;35:482",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 422,
                    "height": 33.33333206176758,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:495",
            "name": "Comp2",
            "type": "INSTANCE",
            "width": 552,
            "height": 75,
            "x": 47,
            "y": 151,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:495;35:484",
                "name": "image",
                "type": "INSTANCE",
                "width": 75,
                "height": 75,
                "x": 0,
                "y": -4,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:495;35:484;35:479",
                    "name": "Rectangle 8",
                    "type": "RECTANGLE",
                    "width": 75,
                    "height": 75,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:495;35:485",
                "name": "dida",
                "type": "INSTANCE",
                "width": 422,
                "height": 33.33333206176758,
                "x": 100,
                "y": 37.5,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:495;35:485;35:482",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 422,
                    "height": 33.33333206176758,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:501",
            "name": "Comp3",
            "type": "INSTANCE",
            "width": 552,
            "height": 75,
            "x": 47,
            "y": 244,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:501;35:484",
                "name": "image",
                "type": "INSTANCE",
                "width": 75,
                "height": 75,
                "x": 0,
                "y": -4,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:501;35:484;35:479",
                    "name": "Rectangle 8",
                    "type": "RECTANGLE",
                    "width": 75,
                    "height": 75,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:501;35:485",
                "name": "dida",
                "type": "INSTANCE",
                "width": 422,
                "height": 33.33333206176758,
                "x": 100,
                "y": 37.5,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:501;35:485;35:482",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 422,
                    "height": 33.33333206176758,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:507",
            "name": "Comp4",
            "type": "INSTANCE",
            "width": 552,
            "height": 75,
            "x": 47,
            "y": 337,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:507;35:484",
                "name": "image",
                "type": "INSTANCE",
                "width": 75,
                "height": 75,
                "x": 0,
                "y": -4,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:507;35:484;35:479",
                    "name": "Rectangle 8",
                    "type": "RECTANGLE",
                    "width": 75,
                    "height": 75,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:507;35:485",
                "name": "dida",
                "type": "INSTANCE",
                "width": 422,
                "height": 33.33333206176758,
                "x": 100,
                "y": 37.5,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:507;35:485;35:482",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 422,
                    "height": 33.33333206176758,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:513",
            "name": "Comp5",
            "type": "INSTANCE",
            "width": 552,
            "height": 75,
            "x": 47,
            "y": 430,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:513;35:484",
                "name": "image",
                "type": "INSTANCE",
                "width": 75,
                "height": 75,
                "x": 0,
                "y": -4,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:513;35:484;35:479",
                    "name": "Rectangle 8",
                    "type": "RECTANGLE",
                    "width": 75,
                    "height": 75,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:513;35:485",
                "name": "dida",
                "type": "INSTANCE",
                "width": 422,
                "height": 33.33333206176758,
                "x": 100,
                "y": 37.5,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:513;35:485;35:482",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 422,
                    "height": 33.33333206176758,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:519",
            "name": "Comp6",
            "type": "INSTANCE",
            "width": 552,
            "height": 75,
            "x": 47,
            "y": 523,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:519;35:484",
                "name": "image",
                "type": "INSTANCE",
                "width": 75,
                "height": 75,
                "x": 0,
                "y": -4,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:519;35:484;35:479",
                    "name": "Rectangle 8",
                    "type": "RECTANGLE",
                    "width": 75,
                    "height": 75,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:519;35:485",
                "name": "dida",
                "type": "INSTANCE",
                "width": 422,
                "height": 33.33333206176758,
                "x": 100,
                "y": 37.5,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:519;35:485;35:482",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 422,
                    "height": 33.33333206176758,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:525",
            "name": "Comp7",
            "type": "INSTANCE",
            "width": 552,
            "height": 75,
            "x": 47,
            "y": 616,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:525;35:484",
                "name": "image",
                "type": "INSTANCE",
                "width": 75,
                "height": 75,
                "x": 0,
                "y": -4,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:525;35:484;35:479",
                    "name": "Rectangle 8",
                    "type": "RECTANGLE",
                    "width": 75,
                    "height": 75,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:525;35:485",
                "name": "dida",
                "type": "INSTANCE",
                "width": 422,
                "height": 33.33333206176758,
                "x": 100,
                "y": 37.5,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:525;35:485;35:482",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 422,
                    "height": 33.33333206176758,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "35:531",
            "name": "Comp8",
            "type": "INSTANCE",
            "width": 552,
            "height": 75,
            "x": 47,
            "y": 709,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I35:531;35:484",
                "name": "image",
                "type": "INSTANCE",
                "width": 75,
                "height": 75,
                "x": 0,
                "y": -4,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:531;35:484;35:479",
                    "name": "Rectangle 8",
                    "type": "RECTANGLE",
                    "width": 75,
                    "height": 75,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0.8509804010391235,
                        "g": 0.8509804010391235,
                        "b": 0.8509804010391235
                      },
                      "stroke": null,
                      "fontSize": null,
                      "fontFamily": null
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              },
              {
                "id": "I35:531;35:485",
                "name": "dida",
                "type": "INSTANCE",
                "width": 422,
                "height": 33.33333206176758,
                "x": 100,
                "y": 37.5,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I35:531;35:485;35:482",
                    "name": "Didascalia",
                    "type": "TEXT",
                    "width": 422,
                    "height": 33.33333206176758,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 14,
                      "fontFamily": "Inknut Antiqua"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "41:97",
            "name": "Name",
            "type": "INSTANCE",
            "width": 498,
            "height": 18,
            "x": 47,
            "y": 808,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I41:97;41:77",
                "name": "name",
                "type": "INSTANCE",
                "width": 498,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I41:97;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 498,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "id": "41:109",
            "name": "Page",
            "type": "INSTANCE",
            "width": 176,
            "height": 18,
            "x": 414,
            "y": 7,
            "styles": {
              "fill": {
                "r": 1,
                "g": 1,
                "b": 1
              },
              "stroke": null,
              "fontSize": null,
              "fontFamily": null
            },
            "autoLayout": {
              "direction": "NONE",
              "spacing": null,
              "padding": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "alignment": "MIN",
              "crossAxisAlignment": "MIN"
            },
            "children": [
              {
                "id": "I41:109;41:77",
                "name": "page",
                "type": "INSTANCE",
                "width": 176,
                "height": 18,
                "x": 0,
                "y": 0,
                "styles": {
                  "fill": {
                    "r": 1,
                    "g": 1,
                    "b": 1
                  },
                  "stroke": null,
                  "fontSize": null,
                  "fontFamily": null
                },
                "autoLayout": {
                  "direction": "NONE",
                  "spacing": null,
                  "padding": {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                  },
                  "alignment": "MIN",
                  "crossAxisAlignment": "MIN"
                },
                "children": [
                  {
                    "id": "I41:109;41:77;39:70",
                    "name": "name",
                    "type": "TEXT",
                    "width": 176,
                    "height": 18,
                    "x": 0,
                    "y": 0,
                    "styles": {
                      "fill": {
                        "r": 0,
                        "g": 0,
                        "b": 0
                      },
                      "stroke": null,
                      "fontSize": 12,
                      "fontFamily": "Inter"
                    },
                    "autoLayout": null,
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
}

export interface PrintData {
   image: string
   title: string
   media: string
   dimensions: string
   year: string
   price: string
   description: string
}