import React from "react";
import EmojiResultRow from "./EmojiResultRow";
import { useState } from "react";
import { useEffect } from "react";

const EmojiResults=(props)=>{
    const [isLoading,setIsLoading] = useState(true);
    const [arrayss,setArrayss] = useState([]);

    const groupBy = (list, key) => {
      let groups = list.reduce(
        (result, item) => ({
          ...result,
          [item[key]]: [
            ...(result[item[key]] || []),
            item,
          ]
      }),{},);
      return groups;
    }

    useEffect(()=>{
      const emojiGroup = groupBy(props.emojiData, "group");
      const array = [];
      for (let key in emojiGroup) {
        if (emojiGroup.hasOwnProperty(key)) {
          array.push(<div key={key}>{key}</div>);
          array.push(
            emojiGroup[key].map((emojiData, index) => (
              <EmojiResultRow
                key={index}
                symbol={emojiData.symbol}
                title={emojiData.title}
                getEmoji={props.getEmoji}
                group={emojiData.group}
              />
            ))
          );
        }
        setArrayss(array);
      }
    },[]);

    return (
      <div className="component-emoji-results">
        <div>
          {isLoading}
          {arrayss}
        </div>
      </div>
    );
}
export default EmojiResults;
 