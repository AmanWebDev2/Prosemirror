import React, { useState, useRef, useImperativeHandle } from "react";

import attributeSvg from "../assets/svg/attribute.svg";
import { ATTRIBUTE_SPAN } from "./content-editable/custom/schema/nodes/Names";

const RuleSetBlock = React.forwardRef(({ dropdownData, isFocused }, ref) => {
  const [show, setShow] = useState(false);
  const ruleSetRef = useRef();
  const ruleSetPosRef = useRef();
  const dropdownMenuRef = useRef();

  useImperativeHandle(
    ref,
    () => {
      return {
        // ... your methods ...
        closeRuleSetMenu() {
          if (show) {
            setShow(false);
          }
        },
      };
    },
    [show]
  );

  const handleAttributes = (attributeData) => {
    // current selection
    console.log(attributeData);
    const view = window.view;
    if (view) {
      const node = view.state.schema.nodes[ATTRIBUTE_SPAN].create(
        {
          "data-template-identifier": attributeData.key,
          "data-template-display": attributeData.display,
        },
        [view.state.schema.text(attributeData.display)]
      );
      const transaction = view.state.tr.replaceSelectionWith(node);
      view.dispatch(transaction);
    }
    setShow(!show);
  };

  const handleRuleSetClick = (e) => {
    e.stopPropagation();
    setShow(!show);
    if (ruleSetPosRef.current && dropdownMenuRef.current) {
      let topPos = +ruleSetPosRef.current.style.top.replace("px", "");
      if (topPos) {
        // ruleSetPosRef.current.style.top = `${topPos-50}px`
        // dropdownMenuRef.current.style.top = `-40px`
      }
    }
  };

  return (
    <>
      <div className="rulesetBlock-container pos">
        <div
          ref={ruleSetPosRef}
          className="rulset-position hidden"
          style={{
            position: "absolute",
            inset: 0,
            display: "inline-table",
          }}
        >
          <div
            className={`light-theme kh-popup-tiny rulesetBtn`}
            style={{
              display: show ? "none" : "block",
            }}
          >
            <span
              className="kh-popup kh-popup-icon "
              id="rulset-attribute"
              onClick={handleRuleSetClick}
              ref={ruleSetRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "24px",
                width: "34px",
              }}
            >
              <img src={attributeSvg} alt="" />
            </span>
          </div>
          <div>
            <div
              className="attribute-selector kh-popup"
              ref={dropdownMenuRef}
              style={{
                display: show ? "block" : "none",
              }}
            >
              <div className="kh-popup-scrollable">
                {dropdownData.map((data, index) => {
                  return (
                    <p
                      style={{
                        width: "100%",
                      }}
                      className="attribute-items"
                      key={index}
                      onClick={() => handleAttributes(data)}
                    >
                      {data.display}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default RuleSetBlock;
